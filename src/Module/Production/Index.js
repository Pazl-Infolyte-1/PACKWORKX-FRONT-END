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

const Index = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [autoSyncOrders, setAutoSyncOrders] = useState({})
  const [visible, setVisible] = useState(false)

  const [selectedType, setSelectedType] = useState('')
  const [visibleSplit, setVisibleSplit] = useState(false)

  useEffect(() => {
    async function getWorkOrders() {
      try {
        const response = await axios.get('https://mocki.io/v1/c070abb2-c022-41a6-853d-84f1288963d8')
        console.log(response.data)
        setWorkOrders(response.data.orders)
      } catch (error) {
        console.error('Error fetching work orders:', error)
      }
    }

    async function getAutoSyncOrders() {
      try {
        const res = await axios.get('https://mocki.io/v1/a2ee364a-3e78-4dbe-afbc-7141c7d0a4d5')
        setAutoSyncOrders(res.data)
      } catch (error) {
        console.error('Error fetching auto-sync orders:', error)
      }
    }

    getWorkOrders()
    getAutoSyncOrders()
  }, [])

  const [groupOrders, setGroupOrders] = useState([])
  const [activeTab, setActiveTab] = useState('Group Layers')
  const tabs = ['Group Layers', 'Allocate SFG', 'Allocate RM', 'Returnables']

  const handleNextStep = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleAddGroup = () => {
    console.log('Adding group')
    setGroupOrders((prevGroups) => [
      ...prevGroups,
      { name: `Group ${prevGroups.length + 1}`, items: [] },
    ])
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Order Grouping</h3>
        <div className="ms-auto d-flex">
          {activeTab === 'Group Layers' && (
            <CButton
              className="text-black border border-black bg-white hover:bg-black hover:text-white me-2 cursor-pointer"
              onClick={handleAddGroup}
            >
              + Add Group
            </CButton>
          )}
          <CButton color="danger" className="text-white" onClick={handleNextStep}>
            Next Step
          </CButton>
        </div>
      </div>

      <CCol xs={12}>
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
