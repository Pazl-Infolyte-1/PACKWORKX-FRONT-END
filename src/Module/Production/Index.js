import React, { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
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


const Index = () => {
  const [workOrders, setWorkOrders] = useState([
    {
      // Essential identifiers
      work_generate_id: "WO-1005",
      id: 1,
  
      // Product details
      sku_name: "60ml",
      dimensions: {
        length: 20,
        width: 20,
        height: 10
      },
  
      // Manufacturing specifications
      ply: 3,
      print: "Flexo Print",
      qty: 250,
      boxType: "RSC",
      route: "Standard",
  
      // Progress tracking
      orderProgress: {
        completed: 138,
        total: 150,
        percent: 92
      },
  
      // Planning dates
      planned_start_date: "2025-05-15",
      planned_end_date: "2025-05-20",
  
      // Layer information
      layer_group: [
        {
          id: 101,
          layer_name: "Top Layer",
          boardSize: { length: 20, width: 20 },
          color: "Golden Yellow",
          gsm: 180,
          bf: 20,
          progressPercent: 80
        },
        {
          id: 102,
          layer_name: "Corrugated Layer 1",
          boardSize: { length: 20, width: 20 },
          color: "Golden Yellow",
          gsm: 180,
          bf: 20,
          progressPercent: 80
        },
        {
          id: 103,
          layer_name: "Liner Layer 1",
          boardSize: { length: 20, width: 20 },
          color: "Golden Yellow",
          gsm: 180,
          bf: 20,
          progressPercent: 80
        }
      ]
    },
    {
      work_generate_id: "WO-1006",
      id: 2,
      sku_name: "100ml",
      dimensions: {
        length: 25,
        width: 25,
        height: 12
      },
      ply: 5,
      print: "Offset Print",
      qty: 300,
      boxType: "HSC",
      route: "Standard",
      orderProgress: {
        completed: 220,
        total: 300,
        percent: 73
      },
      planned_start_date: "2025-05-16",
      planned_end_date: "2025-05-22",
      layer_group: [
        {
          id: 201,
          layer_name: "Top Layer",
          boardSize: { length: 25, width: 25 },
          color: "Brown Kraft",
          gsm: 200,
          bf: 25,
          progressPercent: 70
        },
        {
          id: 202,
          layer_name: "Corrugated Layer 1",
          boardSize: { length: 25, width: 25 },
          color: "Brown Kraft",
          gsm: 200,
          bf: 25,
          progressPercent: 70
        },
        {
          id: 203,
          layer_name: "Liner Layer 1",
          boardSize: { length: 25, width: 25 },
          color: "Brown Kraft",
          gsm: 200,
          bf: 25,
          progressPercent: 70
        },
        {
          id: 204,
          layer_name: "Corrugated Layer 2",
          boardSize: { length: 25, width: 25 },
          color: "Brown Kraft",
          gsm: 200,
          bf: 25,
          progressPercent: 65
        },
        {
          id: 205,
          layer_name: "Liner Layer 2",
          boardSize: { length: 25, width: 25 },
          color: "Brown Kraft",
          gsm: 200,
          bf: 25,
          progressPercent: 65
        }
      ]
    }
  ]);
    
  const [autoSyncOrders, setAutoSyncOrders] = useState({})
  const [visible, setVisible] = useState(false)

  const [selectedType, setSelectedType] = useState('')
  const [visibleSplit, setVisibleSplit] = useState(false)

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

  const [groupOrders, setGroupOrders] = useState([])
  const [activeTab, setActiveTab] = useState('Work Orders')
  const tabs = ['Work Orders','Group Layers', 'Allocate SFG', 'Allocate RM', 'Returnables', 'Outsource & Preview']

  const handleNextStep = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleAddGroup = () => {
    setGroupOrders((prevGroups) => [
      ...prevGroups,
      { name: `Group ${prevGroups.length + 1}`, items: [] },
    ])
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Order Grouping</h3>
        <div className="ms-auto flex flex-row gap-2">
          {activeTab === 'Group Layers' && (
            <ActionButton
            label={" + Add Group "}
            onClick={handleAddGroup}
            variant='add'
            />
          )}
          <ActionButton
          label={"Next Step"}
          onClick={handleNextStep}
          variant='delete'
          />
          
        </div>
      </div>

      <CCol xs={12} className=''>
        <CNav variant="tabs">
          {tabs.map((tab) => (
            <CNavItem key={tab}>
              <CNavLink
                active={activeTab === tab}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab(tab)
                }}
                style={{
                  backgroundColor: activeTab === tab ? '#8761e5' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#8761e5',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </CNavLink>
            </CNavItem>
          ))}
        </CNav>
      </CCol>

      <CRow>
      {activeTab === 'Work Orders' && (
          // <Group
          //   workOrders={workOrders}
          //   groupOrders={groupOrders}
          //   setGroupOrders={setGroupOrders}
          //   setWorkOrders={setWorkOrders}
          //   autoSyncOrders={autoSyncOrders}
          //   setVisibleSplit={setVisibleSplit}
          // />
          <WorkOrderLIsting
          workOrders={workOrders}
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
        )}
      </CRow>

      <SplitWorkOrder
        visibleSplit={visibleSplit}
        setVisibleSplit={setVisibleSplit}
        setSelectedType={setSelectedType}
      />
    </div>
  )
}

export default Index
