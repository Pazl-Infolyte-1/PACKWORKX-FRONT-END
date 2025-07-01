// Split your Index component into two parts:

import React, { useEffect, useRef, useState } from "react"
import { RawMaterialProvider } from "../../Context/AlocateRawMeterialContext"
import { GroupLayersProvider, useGroupLayers } from "../../Context/GroupLayersContext"
import { NextHandlerProvider, useNextHandler } from "../../Context/ProductionNextHandlerContext"
import { useLocation, useNavigate } from "react-router-dom"
import SplitWorkOrder from './SplitWorkOrder'
import UserConfirmation from './UserConfirmation'
import { workOrderApi } from '../../api/workOrder'
import { Outlet } from 'react-router-dom'
import { CRow } from '@coreui/react'

// 1. The main Index component that provides contexts
const Index = () => {
  return (
    <NextHandlerProvider>
      <GroupLayersProvider>
        <RawMaterialProvider>
          <IndexContent />  {/* Move all the logic here */}
        </RawMaterialProvider>
      </GroupLayersProvider>
    </NextHandlerProvider>
  )
}

// 2. IndexContent component that uses the contexts
const IndexContent = () => {
  const [workOrders, setWorkOrders] = useState([])
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
  const locked = location.state?.lockedSteps === true;

  
  // ✅ Now this will work because we're inside the provider
  const {triggerNext} = useNextHandler()

  const currentPath = location.pathname.split('/').pop();

  const tabs = [
    { label: 'Work Orders', path: 'WorkOrders' },
    { label: 'Group Layers', path: 'GroupLayers' },
    { label: 'Allocate RM', path: 'AllocateRM' },
    { label: 'Returnables', path: 'Returnables' },
    { label: 'Outsource & Preview', path: 'OutsourceAndPreview' },
  ];

  useEffect(() => {
    if (!currentPath || currentPath === 'form') {
      navigate('WorkOrders');   
    }
  }, [currentPath, navigate]);

  useEffect(() => {
    async function getWorkOrders() {
      try {
        const response = await workOrderApi.getWorkOrders()
        setWorkOrders(response?.data?.workOrders)
      } catch (error) {
        console.error('Error fetching work orders:', error)
      }
    }

    getWorkOrders()
  }, [])

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === currentPath);
    if (currentTab) {
      setActiveTab(currentTab.label);
    }
  }, [currentPath]);

  const activeTabIndex = tabs.findIndex(tab => tab.path === currentPath);

  const handleTabChange = (tabPath) => {
    const targetTabIndex = tabs.findIndex(tab => tab.path === tabPath);
    if (tabPath !== currentPath) {
      if (targetTabIndex < activeTabIndex) {
        setPendingTab(tabPath);
        setShowConfirm(true);
      } else {
        navigate(`/production/form/${tabPath}`);
      }
    }
  };

  const handleConfirmTabChange = async() => {
    setShowConfirm(false);
    if (pendingTab) {
      await triggerNext()   // ✅ This will now work
      navigate(`/production/form/${pendingTab}`);
      setPendingTab(null);
    }
  };

  const handleCancelTabChange = () => {
    setShowConfirm(false);
    setPendingTab(null);
  };
  
  return (
    <div className='overflow-hidden h-[90vh] flex flex-col'>
      {/* Fixed Header Section */}
      <div className="sticky top-0 bg-white z-[900] flex-shrink-0" style={{paddingTop: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'}}>

        {/* Step Indicator - Exact HTML Pattern */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '18px',
          padding: '0 10px',
          minHeight: '54px',
          alignItems: 'flex-start',
        }}>
          {tabs.map((tab, index) => {
            let isDisabled = '';
            const isActive = activeTabIndex === index;
            const isCompleted = activeTabIndex > index;

            if (locked && index < activeTabIndex) {
              isDisabled = true;
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
                      background: isCompleted ? '#10b981' : isActive ? '#667eea' : '#e2e8f0',
                      color: isCompleted || isActive ? 'white' : '#64748b',
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
                      // opacity: isDisabled ? 0.6 : 1,
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
                     tab.label === 'Returnables' ? 'Allocate Inventory' : 
                     'Review & Plan'}
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
    </div>
  )
}

export default Index