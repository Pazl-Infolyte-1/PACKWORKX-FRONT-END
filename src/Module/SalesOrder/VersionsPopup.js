import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react'
import { CButton, CRow, CCol, CContainer, CFormCheck } from '@coreui/react'
import PopUp from '../../components/New/PopUp'

function VersionsPopup({ visible, setVisible }) {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/334af563-8d92-468d-9805-bffd1484485b')
        setData(response.data.sections[0]?.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <PopUp visible={visible} setVisible={setVisible} width="500px" height="500px" size="lg">
      

      <div>
        {/* Header Section */}
        <div className=" flex justify-between">
          <div>
            <p className="text-lg text-black">SKU Name: <span className="text-gray-700">60ml</span></p>
          </div>
          <div>
            <p className="text-lg text-black">Dimensions: <span className="text-gray-700">60 x 30 x 40</span></p>
          </div>
          <div>
            <p className="text-lg text-black">Print: <span className="text-gray-700">Flexo</span></p>
          </div>
        </div>

        
       

        {/* Table Component */}
        <CContainer className="rounded-md p-2">
          <CTable  striped hover responsive>
            <CTableHead>
              <CTableRow  className='border-t-2'>
                <CTableHeaderCell className="!text-[#7f7f7f] font-semibold">Version</CTableHeaderCell>
                <CTableHeaderCell className="!text-[#7f7f7f] font-semibold">GSM</CTableHeaderCell>
                <CTableHeaderCell className="!text-[#7f7f7f] font-semibold">Board size (L × W)</CTableHeaderCell>
                <CTableHeaderCell className="!text-[#7f7f7f] font-semibold">BF</CTableHeaderCell>
                <CTableHeaderCell className="!text-[#7f7f7f] font-semibold">Color</CTableHeaderCell>
                <CTableHeaderCell className="!text-[#7f7f7f] font-semibold">Print</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <div className=" flex justify-start items-center gap-3 mb-2 mt-2">
          <div className='flex justify-start items-center gap-2'>
            <input id="version-checkbox"  type='checkbox' />
            Version
          </div>
          <div>
            Deckle: 180
          </div>
        </div>

            <CTableBody >
              {data.length > 0 ? (
                data.map((item, index) => (
                  <CTableRow key={index} className='border-none'>
                    <CTableDataCell className="font-semibold">{item.version}</CTableDataCell>
                    <CTableDataCell>{item.gsm}</CTableDataCell>
                    <CTableDataCell>{item.bordersize}</CTableDataCell>
                    <CTableDataCell>{item.bf}</CTableDataCell>
                    <CTableDataCell>{item.color}</CTableDataCell>
                    <CTableDataCell>{item.print}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-primary">
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CContainer>
      </div>

      <div className='flex justify-end items-center'>
        <button className="cursor-pointer  w-[200px] h-[35px] px-2 border-0  rounded-md shadow-md bg-[#8167e5] text-white  outline-none">
          Save As New Version
        </button>
      </div>
    </PopUp>
  )
}

export default VersionsPopup
