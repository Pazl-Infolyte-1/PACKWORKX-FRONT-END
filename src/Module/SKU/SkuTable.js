import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import apiMethods from '../../api/config'
import SkuDetails from './SkuDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import { useDispatch, useSelector } from 'react-redux'


function SkuTable({ skudata, setSkuData, handleSkuEdit, editTag, alerts, setAlerts }) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const dispatch = useDispatch()


  const handleSkuDelete = async () => {
    await apiMethods.deleteSku(deleteId)
    setDeleteModal(false)
    setSkuData((prevTypes) => prevTypes.filter((type) => type.id !== deleteId))
    setAlerts([{ severity: 'success', message: 'Sku deleted successfully!' }])
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const handleClose = () => {
    setAlerts([]);
  };

  return (
    <div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar">
      <CustomAlert alerts={alerts} handleClose={handleClose}/>
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className="text-center">
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
              SKU Name
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              SKU Type 🔎
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Client 🔎
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Dimensions
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Deckle 🔎
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Created Date
            </CTableHeaderCell>
            {/*<CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
              Status
            </CTableHeaderCell>*/}
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
                    {cell.sku_type}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">{cell.client}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    {cell.length && cell.width && cell.height
                      ? [cell.length, cell.width, cell.height].join(' x ')
                      : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    {cell.deckle_size}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    {formatDate(cell.updated_at)}
                  </CTableDataCell>
                  {/*<CTableDataCell className="py-3 px-2 text-gray-700">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        cell.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {cell.status}
                    </span>
                  </CTableDataCell>*/}
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
                            dispatch({ type: 'RESET_DIECUT_CALCULATIONS' });

                            dispatch({
                              type: 'SET_SELECTED_ROUTE_IDS',
                              payload: [], // 👈 empty array
                            });
                            dispatch({
                              type: 'SET_DECKLE_SIZE',
                              payload: {
                                deckle_size: "",
                                deckleError: "",
                              },
                            });
                            handleSkuEdit(cell.id)
                        
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            openDeleteModal(cell.id)
                          },
                        },
                      ]}
                    />
                  </CTableDataCell>
                  <ConfirmationModale
                    isOpen={deleteModal}
                    onClose={closeDeleteModal}
                    onConfirm={handleSkuDelete}
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
