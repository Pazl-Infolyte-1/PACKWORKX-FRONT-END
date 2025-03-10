import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import PopUp from '../../components/New/PopUp'
import { BiSolidDownArrow } from 'react-icons/bi'
import { BiSolidUpArrow } from 'react-icons/bi'

function VersionsPopup({ visible, setVisible }) {
  const [data, setData] = useState([])
  const [collapseopen, setcollapseopen] = useState(false)

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

  const handleToggleCollapse = () => {
    setcollapseopen((prev) => !prev)
  }

  return (
    <PopUp
      visible={visible}
      setVisible={setVisible}
      width="1200px"
      height="500px"
      size="xl"
      header=""
      showCloseButton={true}
    >
      <div>
        {/* Header Section */}
        <div className="flex justify-between  pb-2 mb-3">
          <span className="text-lg font-semibold text-gray-800">
            SKU Name: <span>60ml</span>
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Dimensions: <span>60 x 30 x 40</span>
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Print: <span>Flexo</span>
          </span>
        </div>

        {/* Scrollable Table */}
        <div className="max-h-[300px] overflow-auto">
          <CTable striped hover responsive className="table-fixed border-none">
            {/* Fixed Table Header */}
            <CTableHead className="sticky top-0 !border-none">
              <CTableRow className="!border-y-2">
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Version
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[80px] !text-gray-600">
                  GSM
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[120px] !text-gray-600">
                  Board Size (L × W)
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[70px] !text-gray-600">
                  BF
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[90px] !text-gray-600">
                  Color
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Print
                </CTableHeaderCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell colSpan={6}>
                  <div className="flex justify-start gap-4 items-center mb-3 mt-3">
                    <div className="flex items-center gap-2">
                      <input id="version-checkbox" type="checkbox" />
                      <label htmlFor="version-checkbox" className="text-gray-700">
                        Version
                      </label>
                    </div>
                    <div className="flex items-center gap-4 justify-between w-full">
                      <span className="text-gray-700">Deckle: 180</span>
                      <button className="px-3 py-1" onClick={handleToggleCollapse}>
                        {collapseopen == '' ? <BiSolidDownArrow /> : <BiSolidUpArrow />}
                        {console.log(handleToggleCollapse)}
                      </button>
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            </CTableHead>

            {/* Scrollable Table Body */}
            <CTableBody
              className={`transition-all duration-300 ease-in-out overflow-hidden ${collapseopen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              {collapseopen ? (
                data.length > 0 ? (
                  data.map((item, index) => (
                    <CTableRow key={index} className="h-[50px] transition ">
                      <CTableDataCell className="min-w-[100px] border-none font-semibold">
                        {item.version}
                      </CTableDataCell>
                      <CTableDataCell className="min-w-[80px] border-none ">
                        {item.gsm}
                      </CTableDataCell>
                      <CTableDataCell className="min-w-[120px] border-none">
                        {item.bordersize}
                      </CTableDataCell>
                      <CTableDataCell className="min-w-[70px] border-none">
                        {item.bf}
                      </CTableDataCell>
                      <CTableDataCell className="min-w-[90px] border-none">
                        {item.color}
                      </CTableDataCell>
                      <CTableDataCell className="min-w-[100px] border-none">
                        {item.print}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={6}
                      className="text-center py-3 text-gray-500 border-none"
                    >
                      No data available
                    </CTableDataCell>
                  </CTableRow>
                )
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="py-2 border-none"></CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end items-center h-15 mt-3">
        <button className="bg-[#8167e5] text-white rounded-md h-10 w-52 flex justify-center items-center">
          Save as New Version
        </button>
      </div>
    </PopUp>
  )
}

export default VersionsPopup
