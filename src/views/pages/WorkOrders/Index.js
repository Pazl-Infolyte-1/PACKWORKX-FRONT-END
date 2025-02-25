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

const Index = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [autoSyncOrders, setAutoSyncOrders] = useState({})

  useEffect(() => {
    async function getWorkOrders() {
      try {
        const response = await axios.get('https://mocki.io/v1/ba2ffb2a-adbd-4ea7-a08f-84d1f99c8e36')
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
  const [activeTab, setActiveTab] = useState('group')
  const tabs = ['group', 'sfg', 'rm', 'returnables']

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
          {activeTab === 'group' && (
            <CButton
              color="white border-black hover-text-white background-black"
              className="text-black me-2"
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
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, ' ')}
              </CNavLink>
            </CNavItem>
          ))}
        </CNav>
      </CCol>

      <CRow>
        {activeTab === 'group' && (
          <Group
            workOrders={workOrders}
            groupOrders={groupOrders}
            setGroupOrders={setGroupOrders}
            setWorkOrders={setWorkOrders}
            autoSyncOrders={autoSyncOrders}
          />
        )}
        {activeTab === 'sfg' && <AllocateSFG workOrders={workOrders} groupOrders={groupOrders} />}
        {activeTab === 'rm' && <AllocateRM />}
        {activeTab === 'returnables' && <ReturnablesContent />}
      </CRow>
    </div>
  )
}

export default Index
