import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { Dropdown } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilCut, cilOptions, cilTrash } from '@coreui/icons'
import apiMethods from '../../api/config'
import SkuDetails from './SkuDetails'

function SkuTable({ skudata, handleSkuEdit, editTag }) {
  const [showPopUp, setShowPopUp] = useState(null)

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      style={{ cursor: 'pointer' }}
    >
      <CIcon
        icon={cilOptions}
        className="me-2 hover-pointer"
        style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
      />
    </span>
  ))

  const handleSkuDelete = async (id) => {
    await apiMethods.deleteSku(id)
  }

  return (
    <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className='text-center'>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
              SKU Name
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Created Date
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Modified Date
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              SKU Type
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Client
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Dimensions
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Deckle
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {skudata.length > 0 ? (
            skudata.map((cell, index) => (
              <CTableRow key={index} className="border-b text-center">
                <CTableDataCell
                  onClick={() => setShowPopUp(cell.id)}
                  className="py-3 px-2 !text-blue-600 font-semibold cursor-pointer underline text-start "
                >
                  {cell.sku_name}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">
                  {cell.created_date}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">
                  {cell.modified_date}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">{cell.sku_type}</CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">{cell.client}</CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">
                  {cell.dimensions}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">
                  {cell.deckle_size}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-2 text-gray-700">
                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleSkuEdit(cell.id)}>
                        <CIcon
                          icon={cilCut}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSkuDelete(cell.id)}>
                        <CIcon
                          icon={cilTrash}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </CTableDataCell>

                <SkuDetails
                  showPopUp={showPopUp}
                  cell={cell}
                  editTag={editTag}
                  setShowPopUp={setShowPopUp}
                  handleSkuEdit={handleSkuEdit}
                />
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={8} className="text-center py-3">
                No data available
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default SkuTable
