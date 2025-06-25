import React, { useEffect, useRef, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CCollapse,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CModal,
  CListGroup,
  CListGroupItem,
  CTableRow,
  CTableHead,
  CTableDataCell,
  CTableHeaderCell,
  CTableBody,
} from '@coreui/react'
import axios from 'axios'
import { useDrag, useDrop } from 'react-dnd'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAngleDown, FaAngleUp, FaEllipsisV, FaRedoAlt, FaEye } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilBriefcase, cilMinus, cilClipboard, cilCut, cilOptions, cilReload } from '@coreui/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Group from './Group'
import AllocateSFG from './AllocateSFG'
import AllocateRM from './AllocateRM'
import ReturnablesContent from './ReturnablesContent'
import PopUp from '../../components/New/PopUp'
import { FaLock } from 'react-icons/fa'
import SplitWorkOrder from './SplitWorkOrder'
import ActionButton from '../../components/New/ActionButton'
import Outsource_Preview from './Outsource_Preview'
import WorkOrderLIsting from './WorkOrderLIsting'
import { NextHandlerProvider } from '../../Context/ProductionNextHandlerContext'
import SharedNextButton from './SharedNextButton'
import { GroupLayersProvider, useGroupLayers } from '../../Context/GroupLayersContext'
import AddGroupButton from './AddGroupButton'
import { RawMaterialProvider } from '../../Context/AlocateRawMeterialContext'
import { workOrderApi } from '../../api/workOrder'




const Index = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [autoSyncOrders, setAutoSyncOrders] = useState({})
  const onNextHandlerRef = useRef(() => Promise.resolve(false));
  const [selectedType, setSelectedType] = useState('')
  const [visibleSplit, setVisibleSplit] = useState(false)
  const [groupOrders, setGroupOrders] = useState([])
  const [activeTab, setActiveTab] = useState('Work Orders')
  const groupLayersContext = useGroupLayers()  
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split('/').pop();



  const tabs = [
    { label: 'Work Orders', path: 'WorkOrders' },
    { label: 'Group Layers', path: 'GroupLayers' },
    { label: 'Allocate RM', path: 'AllocateRM' },
    { label: 'Returnables', path: 'Returnables' },
    { label: 'Outsource & Preview', path: 'OutsourceAndPreview' },
  ];


  useEffect(() => {
    if (!currentPath || currentPath === 'production') {
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

    // async function getAutoSyncOrders() {
    //   try {
    //     const res = await axios.get('https://mocki.io/v1/a2ee364a-3e78-4dbe-afbc-7141c7d0a4d5')
    //     setAutoSyncOrders(res.data)
    //   } catch (error) {
    //     console.error('Error fetching auto-sync orders:', error)
    //   }
    // }

    getWorkOrders()
    // getAutoSyncOrders()
  }, [])

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === currentPath);
    if (currentTab) {
      setActiveTab(currentTab.label);
    }
  }, [currentPath]);

  const activeTabIndex = tabs.findIndex(tab => tab.path === currentPath);


  const handleTabChange = (tabPath) => {
    navigate(`/production/${tabPath}`);
  };
  return (
    <NextHandlerProvider>
      <GroupLayersProvider>
        <RawMaterialProvider>
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
    const isDisabled = '';
    const isActive = activeTabIndex === index;
    const isCompleted = activeTabIndex > index;
    
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
              opacity: isDisabled ? 0.6 : 1,
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
          {/* {activeTab === 'Work Orders' && (
      <WorkOrderLIsting
      setActiveTab={setActiveTab}
      registerNextHandler={registerNextHandler}
      />
    )}

    {activeTab === 'Group Layers' && (
      <Group
        workOrders={workOrders}
        groupOrders={groupOrders}
        setGroupOrders={setGroupOrders}
        setWorkOrders={setWorkOrders}
        autoSyncOrders={autoSyncOrders}
        setVisibleSplit={setVisibleSplit}
      />
    )}
    {activeTab === 'Allocate SFG' && (
      <AllocateSFG
        workOrders={workOrders}
        groupOrders={groupOrders}
        setGroupOrders={setGroupOrders}
        setWorkOrders={setWorkOrders}
        autoSyncOrders={autoSyncOrders}
        setVisibleSplit={setVisibleSplit}
      />
    )}
    {activeTab === 'Allocate RM' && (
      <AllocateRM
        workOrders={workOrders}
        groupOrders={groupOrders}
        setGroupOrders={setGroupOrders}
        setWorkOrders={setWorkOrders}
        autoSyncOrders={autoSyncOrders}
        setVisibleSplit={setVisibleSplit}
      />
    )}
    {activeTab === 'Returnables' && (
      <ReturnablesContent
        workOrders={workOrders}
        groupOrders={groupOrders}
        setGroupOrders={setGroupOrders}
        setWorkOrders={setWorkOrders}
        autoSyncOrders={autoSyncOrders}
        setVisibleSplit={setVisibleSplit}
      />
    )}
    {activeTab === 'Outsource & Preview' && (
      <Outsource_Preview
        workOrders={workOrders}
        setWorkOrders={setWorkOrders}
        autoSyncOrders={autoSyncOrders}
        setVisibleSplit={setVisibleSplit}
      />
    )} */}
        </CRow>

        <SplitWorkOrder
          visibleSplit={visibleSplit}
          setVisibleSplit={setVisibleSplit}
          setSelectedType={setSelectedType}
        />
      </div>
      </RawMaterialProvider>
      </GroupLayersProvider>
    </NextHandlerProvider>
  )
}

export default Index
