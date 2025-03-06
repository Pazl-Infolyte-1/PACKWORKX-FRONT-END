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
  CTableBody
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
import { FaLock } from "react-icons/fa";


const Index = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [autoSyncOrders, setAutoSyncOrders] = useState({})
  const [visible, setVisible] = useState(false)
  


  const [selectedType, setSelectedType] = useState("");
  const [visibleIndex, setVisibleIndex] = useState(false)



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
          <CButton onClick={() => setVisible(true)}>model</CButton>
          <CButton onClick={() => setVisibleIndex(true)}>switch</CButton>
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
          />
        )}
        {activeTab === 'Allocate SFG' && (
          <AllocateSFG
            workOrders={workOrders}
            groupOrders={groupOrders}
            setGroupOrders={setGroupOrders}
            setWorkOrders={setWorkOrders}
            autoSyncOrders={autoSyncOrders}
          />
        )}
        {activeTab === 'Allocate RM' && (
          <AllocateRM
            workOrders={workOrders}
            groupOrders={groupOrders}
            setGroupOrders={setGroupOrders}
            setWorkOrders={setWorkOrders}
            autoSyncOrders={autoSyncOrders}
          />
        )}
        {activeTab === 'Returnables' && (
          <ReturnablesContent
            workOrders={workOrders}
            groupOrders={groupOrders}
            setGroupOrders={setGroupOrders}
            setWorkOrders={setWorkOrders}
            autoSyncOrders={autoSyncOrders}
          />
        )}
      </CRow>
      <div>



      </div>
      <div>
        <PopUp visible={visible} setVisible={setVisible} width="800px" height="500px" size="lg">
          
          <CModalHeader>
            <CModalTitle className='text-[#030303]'>Split Work Order



            </CModalTitle>
          </CModalHeader>
          <CModalBody>
          <div className="mb-3 text-[#023f81] text-[16px] flex float-right">
        <strong>WO - #50015</strong> | <strong>Qty - 150</strong> | <strong>FG - 100</strong>
    </div>
    <h5 className="mb-1 text-[#023f81]">Balance Qty from Work Order:</h5>
    <div className="mb-3 d-flex align-items-center gap-2">
        <label className="form-label mb-0 ">Balance Qty</label>
        <CFormInput value="50" disabled style={{ width: "80px", height: "35px", marginLeft: "150px" }} />
    </div>
    <div className="mb-3 d-flex align-items-center gap-2">
        <label className="form-label mb-0 ">Allocate To</label>
        <CFormSelect onChange={(e) => setSelectedType(e.target.value)} style={{ width: "150px", marginLeft: "150px" }}>
            <option value="">Select type</option>
            <option value="Outsource">Outsource</option>
            <option value="Purchase Order">Purchase Order</option>
        </CFormSelect>
        <CFormInput value="50" disabled style={{ width: "80px", height: "35px" }} />
    </div>
    <h5 className='text-[#023f81]'>Allocated Finished Goods:</h5>
    <div className="d-flex gap-2 mb-3">
        <CFormSelect style={{ width: "220px", height: "35px",    color: '#023f81',}}>
            <option value="WO-50015" >WO - 50015</option>
        </CFormSelect >
        <CFormInput style={{ width: "80px", height: "35px" }} value="50" disabled />
        <CButton style={{ width: "80px", height: "35px", backgroundColor: "#8761e5", color: "#ffffff" }} color="success"> Add</CButton>
    </div>
    {/* <CListGroup style={{ maxWidth: "300px" }}>
        <CListGroupItem className="d-flex justify-content-between">
            <span>WO - 50015</span>
            <span>Qty. 50</span>
        </CListGroupItem>
    </CListGroup> */}
</CModalBody>






          <CModalFooter>

            <CButton color="secondary" onClick={() => setVisible(false)}>

              Close
            </CButton>
            <CButton style={{ backgroundColor: "#023f81", color: "#ffffff" }} color="primary">Submit</CButton>

          </CModalFooter>
        </PopUp>
        <PopUp visible={visibleIndex} setVisible={setVisibleIndex}  size="md">

          <CModalBody>
          <CCardHeader className="text-xl font-bold">Allocation - Reel 02</CCardHeader>

            <div className="mb-2 flex gap-40 items-center">
              <label className="text-gray-600">Total Quantity:</label>
              <input type="text" value="500 Kg" disabled className="bg-gray-200 p-2 rounded-md w-15 text-left h-9 " />
            </div>
            <div className="mb-2 flex gap-32 items-center">
              <label className="text-gray-600">Available Quantity:</label>
              <input type="text" value="90 Kg" disabled className="bg-gray-200 p-2 rounded-md w-15 text-left h-9" />
            </div>
            <div className="mb-2 flex gap-2 items-center">
              <label className="text-gray-600 ">How much do you want to allocate:</label>
              <input type="text" value="50 Kg" disabled className="bg-gray-200 p-2 rounded-md w-15 text-left h-9" />
            </div>
            <h3 className="text-lg font-bold mt-2 mb-2">Blocked Quantity</h3>
           
            
            <div className="flex flex-col items-center text-center p-4 ">
      <CCard className="w-full max-w-md shadow-lg p-3">
        <CCardBody>
          <div className="flex w-full font-bold pb-2 text-center">
            <div className="w-1/2 text-left" >Work Order</div>
            <div className="w-1/2">Quantity (Kg)</div>
          </div>
          <div className="mt-1 w-full relative">
            <div className="flex py-2 text-center relative">
              <div className="w-1/2 text-[#8167e5] cursor-pointer  text-left ">WO – 1005</div>
              <div className="w-1/2 flex justify-center items-center gap-4">
                100 <FaLock className="text-[#023f81]" />
              </div>
            </div>
            <div className="flex py-2 text-center relative">
              <div className="w-1/2 text-[#8167e5] cursor-pointer text-left">WO – 1006</div>
              <div className="w-1/2 flex justify-center items-center gap-4">
                250 <FaLock className="text-[#023f81]" />
              </div>
            </div>
            <div className="flex py-2 text-center relative">
              <div className="w-1/2 text-[#8167e5] cursor-pointer text-left">WO – 1007</div>
              <div className="w-1/2 flex justify-center items-center gap-4">
                100 <FaLock className="text-[#023f81]" />
              </div>
            </div>
            <div className="flex py-2 text-center relative">
              <div className="w-1/2 text-[#8167e5] cursor-pointer text-left">WO – 1008</div>
              <div className="w-1/2 flex justify-center items-center gap-4">
                500 <FaLock className="text-[#023f81]" />
              </div>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 transform -translate-x-1/2"></div>
          </div>
        </CCardBody>
      </CCard>
    </div>

</CModalBody>
          <CModalFooter>
            <div className="flex justify-between mt-3 mr-5 gap-2">
            <CButton style={{ backgroundColor: "#e3e7fd", color: "#21338e" }} onClick={() => setVisibleIndex(false)}>Cancel</CButton>

            <CButton style={{ backgroundColor: "#023f81", color: "#ffffff" }} color="primary">Confirm</CButton>


            </div>
          </CModalFooter>
        </PopUp>


      </div>
    </div>
  )
}

export default Index
