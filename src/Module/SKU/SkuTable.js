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
import { cilHandPointRight, cilOptions, cilPencil, cilTrash } from '@coreui/icons'
import apiMethods from '../../api/config'
import SkuDetails from './SkuDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import DeleteModal from '../../components/New/DeleteModal'
import ConfirmationModale from '../../components/New/ConfirmationModale'

function SkuTable({ skudata, setSkuData, handleSkuEdit, editTag }) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  const handleSkuDelete = async (id) => {
    console.log(id);
    await apiMethods.deleteSku(id)
    setSkuData((prevTypes) => prevTypes.filter((type) => type.id !== id))

  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  return (
    <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className="text-center">
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
            skudata
              .filter((item) => item.status === 'active')
              .map((cell, index) => (
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
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    {cell.sku_type}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">{cell.client}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    {cell.dimensions}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    {cell.deckle_size}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: () => {
                            setShowPopUp(cell.id)
                          },
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => {
                            handleSkuEdit(cell.id)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            setDeleteModal(true)
                          },
                        },
                      ]}
                    />
                  </CTableDataCell>
                  <ConfirmationModale
                    isOpen={deleteModal}
                    onClose={closeDeleteModal}
                    onConfirm={handleSkuDelete(cell.id)}
                    title="Delete Confirmation"
                    message="Are you sure you want to delete this item?"
                  />

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
