
import React from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilFilter } from "@coreui/icons";
import {  FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'

const WorkOrders = () => {
  const WorkOrder = [
    {
      number: "WO-1001",salesOrder: "G3P0057",client: "Sterling Labs",date: "18/02/2025",etd: "25/02/2025",route: "Corr - Box",sku: "60 ml",
      qty: 5100,stage: "Prod Planning",status: "Pending",
    },
    {
      number: "WO-1002",salesOrder: "G3P0057",client: "Sterling Labs",date: "18/02/2025",etd: "25/02/2025",route: "Corr - Box",sku: "60 ml",
      qty: 10300,stage: "Pending",status: "Pending",
    },
    {
      number: "WO-1003",salesOrder: "G3P0057",client: "Sterling Labs",date: "18/02/2025",etd: "25/02/2025",route: "Corr - Box",sku: "60 ml",
      qty: 5200,stage: "Pending",status: "Pending",
    },
  ]

  return (
    <div  style={{width:'100%',height:'100vh',margin:'0px'}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <h5>Work Orders</h5>
        <div style={{ display: "flex", gap: "10px", marginLeft: "40px", height: "40px" }}>
          <CInputGroup>
            <CFormInput placeholder="Search" />
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
          </CInputGroup>
          <CButton style={{ backgroundColor: "#8761e5", color: "#fff" }}>
            <CIcon icon={cilFilter} />
          </CButton>
          <CButton style={{ color: "#ffffff", width: "300px", backgroundColor: "#8761e5" }}>
            Add Work Order
          </CButton>
        </div>
      </div>
      <div className="table-container" style={{marginTop:"35px"}} >
      <CTable >
        <CTableHead >
          <CTableRow>
            <CTableHeaderCell>Number</CTableHeaderCell>
            <CTableHeaderCell>Sales Order</CTableHeaderCell>
            <CTableHeaderCell>Client</CTableHeaderCell>
            <CTableHeaderCell>Created Date</CTableHeaderCell>
            <CTableHeaderCell>ETD</CTableHeaderCell>
            <CTableHeaderCell>Route(s)</CTableHeaderCell>
            <CTableHeaderCell>SKU Name</CTableHeaderCell>
            <CTableHeaderCell>Qty</CTableHeaderCell>
            <CTableHeaderCell>
              <CDropdown>
                <CDropdownToggle color="#7d7d7d">Stage</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Prod Planning</CDropdownItem>
                  <CDropdownItem>Pending</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CDropdown>
                <CDropdownToggle color="#7d7d7d">Status</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Pending</CDropdownItem>
                  <CDropdownItem>Completed</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {WorkOrder.map((order, index) => (
            <CTableRow key={index}>
              <CTableDataCell><a href="#">{order.number}</a></CTableDataCell>
              <CTableDataCell><a href="#">{order.salesOrder}</a></CTableDataCell>
              <CTableDataCell>{order.client}</CTableDataCell>
              <CTableDataCell>{order.date}</CTableDataCell>
              <CTableDataCell>{order.etd}</CTableDataCell>
              <CTableDataCell>{order.route}</CTableDataCell>
              <CTableDataCell>{order.sku}</CTableDataCell>
              <CTableDataCell>{order.qty}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  style={{
                    height:"35px",
                    width:"130px",
                    marginRight: "5px",
                    color: order.stage === "Prod Planning" ? "#fff" : "#fff",
                    backgroundColor: order.stage === "Prod Planning" ? "#ffd000" : "#7d7d7d",
                  }}
                >
                  {order.stage}
                </CButton>
              </CTableDataCell>

              <CTableDataCell>
                <CButton
                  style={{
                    height:"35px",
                    width:"130px",
                    marginRight: "5px",
                    color: "#fff",
                    backgroundColor: "#6c757d",
                  }}
                >
                  {order.status}
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      </div>
      <div style={{  display:"flex",justifyContent:"flex-end" ,alignItems:"center" ,marginTop:'30px',gap:'5px' }}>
                 <FaAngleDoubleLeft style={{ fontSize: '15px', cursor: 'pointer' }} />
                 {[1, 2, 3, 4].map((num) => (
                   <button
                     key={num}
                     style={{
                       width: '35px',
                       height: '35px',
                       borderRadius: '50%',
                       backgroundColor: num === 4 ? '#c1c0e0' : '#e5e7eb',
                       border: 'none',
                       cursor: 'pointer',
                     }}
                   >
                     {num}
                   </button>
                 ))}
                 <FaAngleDoubleRight style={{ fontSize: '15px', cursor: 'pointer' }} />
               </div>
    </div>
  );
};

export default WorkOrders;