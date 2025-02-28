
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
import CommonPagination from '../../components/New/Pagination';
import { useEffect,useState } from 'react'
import axios from 'axios'


const WorkOrders = () => {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 4
 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/41daccf7-65a8-4414-bb04-de0fc4272d78')
 
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
 
  const tableData = data?.values && Array.isArray(data.values) ? data.values : []
  const headers = data?.headers && Array.isArray(data.headers) ? data.headers : []


  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)


  return (
    <div  style={{width:'100%'}}>
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
      <div className="border h-[80%]">
      <div className=" overflow-x-auto overflow-y-auto  whitespace-nowrap mt-9 h-50 p-2 ">
      <CTable striped hover className="mt-3 border border-gray-200  ">
          <CTableHead className="bg-gray-100 sticky top-0  z-10">
            <CTableRow>
              {headers.map((header, index) => (
                <CTableHeaderCell key={index} className="py-3 px-4 text-gray-600 font-medium">
                  {header}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <CTableRow key={rowIndex} className="border-b ">
                  {row.map((cell, cellIndex) => (
                    <CTableDataCell key={cellIndex} className="py-3 px-4 text-gray-700">
                      {cell}
                    </CTableDataCell>
                  ))}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={headers.length} className="text-center py-3">
                  No data available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
        </div>
      <div className="flex justify-end items-center gap-4 mt-4">
          <CommonPagination count={5} page={1} onChange={''} />
        </div>
        </div>
    </div>
  );
};

export default WorkOrders;