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
import apiMethods from '../../api/config'
import WorkOrderLIsting from './WorkOrderLIsting'
import { NextHandlerProvider } from '../../Context/ProductionNextHandlerContext'
import SharedNextButton from './SharedNextButton'




const Index = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [autoSyncOrders, setAutoSyncOrders] = useState({})
  const onNextHandlerRef = useRef(() => Promise.resolve(false));
  const [selectedType, setSelectedType] = useState('')
  const [visibleSplit, setVisibleSplit] = useState(false)
  const [groupOrders, setGroupOrders] = useState([])
  const [activeTab, setActiveTab] = useState('Work Orders')
  const tabs = [
    { label: 'Work Orders', path: 'WorkOrders' },
    { label: 'Group Layers', path: 'GroupLayers' },
    { label: 'Allocate RM', path: 'AllocateRM' },
    { label: 'Returnables', path: 'Returnables' },
    { label: 'Outsource & Preview', path: 'OutsourceAndPreview' },
  ];


  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop();

  useEffect(() => {
    if (!currentPath || currentPath === 'production') {
      navigate('WorkOrders');
    }
  }, [currentPath, navigate]);

  useEffect(() => {
    async function getWorkOrders() {
      try {
        const response = await apiMethods.getWorkOrders()
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

  const activeTabIndex = tabs.findIndex(tab => tab.path === currentPath);

  const handleAddGroup = () => {
    setGroupOrders((prevGroups) => [
      ...prevGroups,
      { name: `Group ${prevGroups.length + 1}`, items: [] },
    ])
  }

  const handleTabChange = (tabPath) => {
    navigate(`/production/${tabPath}`);
  };
  return (
    <NextHandlerProvider>
      <div className='overflow-hidden h-[90vh] flex flex-col'>
        {/* Fixed Header Section */}
        <div className="sticky top-0 bg-white z-[1000] flex-shrink-0">
          <div className="d-flex justify-content-between align-items-center mb-3 pt-0.5">
            <h5>Order Grouping</h5>
            <div className="ms-auto flex flex-row gap-2">
              {activeTab === 'Group Layers' && (
                <ActionButton
                  label={" + Add Group "}
                  onClick={handleAddGroup}
                  variant='add'
                />
              )}
              {/* <ActionButton
          label={"Next Step"}
          onClick={handleNextClick}
          variant='delete'
        /> */}
              <SharedNextButton />
            </div>
          </div>

          <CCol xs={12} className=''>
            <CNav variant="tabs">
              {tabs.map((tab, index) => {
                const isDisabled = '';
                const isActive = activeTabIndex === index;
                return (
                  <CNavItem key={tab.path}>
                    <CNavLink
                      active={isActive}
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          handleTabChange(tab.path);
                        }
                      }}
                      style={{
                        backgroundColor: isActive ? '#8761e5' : 'transparent',
                        color: isActive ? '#ffffff' : isDisabled ? '#9ca3af' : '#8761e5',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.6 : 1,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: '0.4rem 0.8rem',
                      }}
                    >
                      {tab.label}
                    </CNavLink>
                  </CNavItem>
                );
              })}
            </CNav>

          </CCol>
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
    </NextHandlerProvider>
  )
}

export default Index
