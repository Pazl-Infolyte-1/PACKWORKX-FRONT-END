import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { HiOutlineDotsVertical } from 'react-icons/hi'

function SkuTable(skudata = []) {
  console.log('datasss', JSON.stringify(skudata))
  return (
    <>
      <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className=" w-full m-0">
          <CTableHead className="bg-gray-100 sticky top-0 ">
            <CTableRow>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              SKU Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Created Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Modified Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              SKU Type
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Client
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Dimensions
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Deckle
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {skudata.skudata.length > 0 ? (
              skudata.skudata.map((cell, index) => (
                <CTableRow key={index} className="border-b">
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.sku_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.created_date}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.modified_date}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.sku_type}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.client}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.dimensions}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.deckle}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <CButton>
                      <HiOutlineDotsVertical />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={10} className="text-center py-3">
                  No data available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}

export default SkuTable
