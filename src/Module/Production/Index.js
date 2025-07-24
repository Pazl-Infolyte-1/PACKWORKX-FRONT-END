import React, { useEffect, useRef, useState } from "react"
import { RawMaterialProvider, useRawMaterialContext } from "../../Context/AlocateRawMeterialContext"
import { GroupLayersProvider, useGroupLayers } from "../../Context/GroupLayersContext"
import { NextHandlerProvider, useNextHandler } from "../../Context/ProductionNextHandlerContext"
import { useLocation, useNavigate } from "react-router-dom"
import SplitWorkOrder from './SplitWorkOrder'
import UserConfirmation from './UserConfirmation'
import { workOrderApi } from '../../api/workOrder'
import { Outlet } from 'react-router-dom'
import { CRow } from '@coreui/react'
import CustomAlert from "../../components/New/CustomAlert"
import { productionApi } from "../../api/production"

// 1. The main Index component that provides contexts
const Index = () => {
  return (
    <NextHandlerProvider>
      <GroupLayersProvider>
        <RawMaterialProvider>
          <IndexContent />
        </RawMaterialProvider>
      </GroupLayersProvider>
    </NextHandlerProvider>
  )
}

// 2. IndexContent component that uses the contexts
const IndexContent = () => {
  const [autoSyncOrders, setAutoSyncOrders] = useState({})
  const [selectedType, setSelectedType] = useState('')
  const [visibleSplit, setVisibleSplit] = useState(false)
  const [groupOrders, setGroupOrders] = useState([])
  const [activeTab, setActiveTab] = useState('Work Orders')
  const groupLayersContext = useGroupLayers()  
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  
  // Persist locked state in component state instead of relying on route state
  const [isLocked, setIsLocked] = useState(false);
  
  const { groupOrders: rawMaterialGroupOrders } = useRawMaterialContext();
  const [showPendingAllocAlert, setShowPendingAllocAlert] = useState(false);
  const [pendingAllocTab, setPendingAllocTab] = useState(null);
  const [pendingAllocDetails, setPendingAllocDetails] = useState([]);
  const [pendingAllocLoading, setPendingAllocLoading] = useState(false);
  const [pendingAllocError, setPendingAllocError] = useState(null);

  // ✅ Now this will work because we're inside the provider
  const {triggerNext} = useNextHandler()

  const currentPath = location.pathname.split('/').pop();

  const tabs = [
    { label: 'Work Orders', path: 'WorkOrders' },
    { label: 'Group Layers', path: 'GroupLayers' },
    { label: 'Allocate RM', path: 'AllocateRM' },
    { label: 'Outsource & Preview', path: 'OutsourceAndPreview' },
  ];

  // Initialize locked state from route state on first load
  useEffect(() => {
    if (location.state?.lockedSteps === true) {
      setIsLocked(true);
    }
  }, []); // Only run on component mount

  useEffect(() => {
    if (!currentPath || currentPath === 'form') {
      navigate('WorkOrders', {
        state: { lockedSteps: isLocked }
      });   
    }
  }, [currentPath, navigate]);

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === currentPath);
    if (currentTab) {
      setActiveTab(currentTab.label);
    }
  }, [currentPath]);

  const activeTabIndex = tabs.findIndex(tab => tab.path === currentPath);

  const handleTabChange = (tabPath) => {
    const targetTabIndex = tabs.findIndex(tab => tab.path === tabPath);
    const isLeavingAllocateRM = currentPath === 'AllocateRM' && (tabPath === 'Returnables' || tabPath === 'OutsourceAndPreview');
    
    if (isLeavingAllocateRM) {
      const pendingGroups = Array.isArray(rawMaterialGroupOrders)
        ? rawMaterialGroupOrders.filter(g => (g.allocated_qty || 0) < (g.group_Qty || 0) && (g.allocated_qty || 0) > 0)
        : [];
      if (pendingGroups.length > 0) {
        setPendingAllocTab(tabPath);
        setPendingAllocDetails(pendingGroups.map(g => ({
          name: g.group_name || g.id || 'Unnamed Group',
          group_id: g.id,
          production_group_generate_id: g.production_group_generate_id,
          inventory_id: g.allocation_history?.allocation_by_inventory?.[0]?.inventory_id || null,
          balance_allocate: (g.group_Qty || 0) - (g.allocated_qty || 0),
          qty: g.group_Qty || 0
        })));
        setShowPendingAllocAlert(true);
        return;
      } else {
        // No pending allocations, proceed to navigate directly
        navigate(`/production/form/${tabPath}`, {
          state: { lockedSteps: isLocked }
        });
        return;
      }
    }
    
    if (tabPath !== currentPath) {
      // Check if moving from step 4 to step 3 (OutsourceAndPreview to AllocateRM)
      const isMovingFrom4To3 = currentPath === 'OutsourceAndPreview' && tabPath === 'AllocateRM';
      
      if (targetTabIndex < activeTabIndex) {
        if (isMovingFrom4To3) {
          // Skip confirmation and navigate directly from step 4 to step 3
          navigate(`/production/form/${tabPath}`, {
            state: { lockedSteps: isLocked }
          });
        } else {
          // Show confirmation for other backward movements
          setPendingTab(tabPath);
          setShowConfirm(true);
        }
      } else {
        // Pass along the locked state when navigating forward
        navigate(`/production/form/${tabPath}`, {
          state: { lockedSteps: isLocked }
        });
      }
    }
  };

  const handleConfirmTabChange = async() => {
    setShowConfirm(false);
    if (pendingTab) {
      await triggerNext();
      // Pass along the locked state when navigating
      navigate(`/production/form/${pendingTab}`, {
        state: { lockedSteps: isLocked }
      });
      setPendingTab(null);
    }
  };

  const handleCancelTabChange = () => {
    setShowConfirm(false);
    setPendingTab(null);
  };

  const handleConfirmPendingAlloc = async () => {
    setPendingAllocLoading(true);
    setPendingAllocError(null);
    // Only include items where qty !== balance_allocate (i.e., some allocation has happened)
    const body = pendingAllocDetails
      .filter(g => g.qty !== g.balance_allocate)
      .map(g => ({
        group_id: g.group_id,
        inventory_id: g.inventory_id,
        balance_allocate: g.balance_allocate,
        production_group_generate_id: g.production_group_generate_id
      }));
    console.log('body:', body);
    setShowPendingAllocAlert(false);

    if (pendingAllocTab.length !== 0) {
      try {
        await productionApi.AllocateInventoryForPendingQuantityGroups(body);
        // Pass along the locked state when navigating
        navigate(`/production/form/${pendingAllocTab}`, {
          state: { lockedSteps: isLocked }
        });
        setPendingAllocTab(null);
      } catch (error) {
        setPendingAllocError('Failed to allocate pending quantity. Please try again.');
        setShowPendingAllocAlert(true); // Optionally re-show the alert
        console.error('Error allocating pending quantity:', error);
      } finally {
        setPendingAllocLoading(false);
      }
    } else {
      setPendingAllocLoading(false);
    }
  };

  const handleCancelPendingAlloc = () => {
    setShowPendingAllocAlert(false);
    setPendingAllocTab(null);
  };
  
  return (
    <div className='overflow-hidden h-[90vh] flex flex-col'>
      {/* Fixed Header Section */}
      <div className="sticky top-0 bg-white z-[900] flex-shrink-0" style={{paddingTop: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'}}>

        {/* Step Indicator - Fixed Logic */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '18px',
          padding: '0 10px',
          minHeight: '54px',
          alignItems: 'flex-start',
        }}>
          {tabs.map((tab, index) => {
            let isDisabled = false;
            const isActive = activeTabIndex === index;
            const isCompleted = activeTabIndex > index;

            // Fixed step enabling/disabling logic
            if (isLocked) {
              // When locked, disable step 2 and below (indices 1 and below)
              isDisabled = index <= 1;
            } else {
              // When not locked, allow normal navigation rules:
              // - Can click current step (though it does nothing)
              // - Can go back to immediate previous step only
              // - Cannot go forward by clicking
              if (index > activeTabIndex) {
                // Cannot go forward by clicking step numbers
                isDisabled = true;
              } else if (index < activeTabIndex - 1) {
                // Can only go back to immediate previous step
                isDisabled = true;
              }
              // index === activeTabIndex (current) or index === activeTabIndex - 1 (previous) remain enabled
            }
            
            return (
              <React.Fragment key={tab.path}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  position: 'relative',
                  minWidth: 0,
                }}>
                  {/* Connecting Line */}
                  {index < tabs.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '13px',
                      right: '-50%',
                      width: '100%',
                      height: '2px',
                      background: isCompleted || isActive ? '#667eea' : '#e2e8f0',
                      zIndex: 1
                    }} />
                  )}
                  
                  {/* Step Number Circle */}
                  <button
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        handleTabChange(tab.path);
                      }
                    }}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isDisabled
                        ? '#e2e8f0' // light gray for disabled
                        : isCompleted
                          ? '#10b981'
                          : isActive
                            ? '#667eea'
                            : '#e2e8f0',
                      color: isDisabled
                        ? '#cbd5e1' // gray text for disabled
                        : isCompleted || isActive
                          ? 'white'
                          : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      marginBottom: '4px',
                      position: 'relative',
                      zIndex: 2,
                      border: 'none',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      transition: 'background 0.2s, color 0.2s',
                      boxShadow: isActive ? '0 2px 8px rgba(102,126,234,0.08)' : 'none',
                    }}
                  >
                    {index + 1}
                  </button>
                  
                  {/* Step Label */}
                  <div style={{
                    fontSize: '11px',
                    textAlign: 'center',
                    color: isActive ? '#667eea' : '#64748b',
                    fontWeight: isActive ? 600 : 'normal',
                    maxWidth: 80,
                    lineHeight: 1.2,
                    whiteSpace: 'normal',
                    marginTop: 0,
                  }}>
                    {tab.label === 'Work Orders' ? 'Select Work Orders' : 
                     tab.label === 'Group Layers' ? 'Group Layers' : 
                     tab.label === 'Allocate RM' ? 'allocate rawmeterials' : 
                     'Preview Allocation'}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Section */}
      <CRow className='flex-1 overflow-y-auto'>
        <Outlet />
      </CRow>

      <SplitWorkOrder
        visibleSplit={visibleSplit}
        setVisibleSplit={setVisibleSplit}
        setSelectedType={setSelectedType}
      />
      <UserConfirmation
        open={showConfirm}
        message="Are you sure? Unsaved data will be lost."
        onConfirm={handleConfirmTabChange}
        onCancel={handleCancelTabChange}
      />
      <UserConfirmation
        open={showPendingAllocAlert}
        message={
          <div>
            <div>There is still pending quantity to allocate. Do you want to continue?</div>
            {pendingAllocDetails.length > 0 && (
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18, color: '#b91c1c', fontSize: 13 }}>
                {pendingAllocDetails.map((g, idx) => (
                  <li key={idx}>
                    <b>{g.production_group_generate_id}</b>: <span style={{ color: '#b91c1c' }}>{g.balance_allocate}</span> KG left to allocate
                  </li>
                ))}
              </ul>
            )}
            {pendingAllocError && (
              <div style={{ color: '#b91c1c', marginTop: 8 }}>{pendingAllocError}</div>
            )}
          </div>
        }
        onConfirm={handleConfirmPendingAlloc}
        onCancel={handleCancelPendingAlloc}
        confirmDisabled={pendingAllocLoading}
      />
    </div>
  )
}

export default Index