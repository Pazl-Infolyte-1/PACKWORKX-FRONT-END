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
import PurchaseOrderDetails from './PurchaseOrderDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'

function PurchaseOrderTable({ data , handleDelete, handleEdit, handleView, loading }) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [poData, setPoData] = useState([])


  // Optional: if local state update is needed after delete

  

  const handlePoDelete = async () => { 
    
    if (!deleteId) {
      setAlerts([{ severity: 'warning', message: 'No Purchase Order selected to delete.' }])
      return
    }
  
    try {
      await apiMethods.deletePurchaseOrder(deleteId)
      setPoData(prevData => prevData.filter(po => po.id !== deleteId))
      setAlerts([{ severity: 'success', message: 'Purchase Order deleted successfully!' }])
      setTimeout(() => {window.location.reload() }, 100) 
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to delete Purchase Order.' }])
    } finally {
      setDeleteModal(false)
    }
  }
  
  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }


  
  const closeDeleteModal = () => {
    setDeleteModal(false)
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

  const handleCloseAlert = () => {
    setAlerts([])
  }

  const handlePoEdit = (id) => {
    if (typeof handleEdit === 'function' && id != null) {
      handleEdit(id);
    }
  }

  return (
  <div className="h-[400px] overflow-x-auto h-[350px] border whitespace-nowrap mt-2">      <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className="text-center">
            <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">
              PO ID
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Supplier Name
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Supplier Contact
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium text-start">
              PO Date
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Valid Till
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Decision
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
              Payment Terms
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
        {data.length > 0 ? (
                data.map((row, index) => (
                <CTableRow key= {row.id} className="border-b text-center">
                  <CTableDataCell
                     onClick={() => setShowPopUp(row.id)}
                    
                 
                    className="py-3 px-4 !text-blue-600 font-semibold cursor-pointer underline text-start "
                 >
                    {row.id}
                  </CTableDataCell>
                  
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {row.supplier_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {row.supplier_contact}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700 text-start">
                    {formatDate(row.po_date)}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {formatDate(row.valid_till)}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {row.decision}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {row.payment_terms}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          onClick: () => setShowPopUp(row.id),
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => handleEdit(row.id),
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => openDeleteModal(row.id),
                        },
                      ]}
                    />
                  </CTableDataCell>

                  {/* Modals & Details */}
                  {deleteModal && (
                    <ConfirmationModale
                      isOpen={deleteModal}
                      onClose={closeDeleteModal}
                      onConfirm={handlePoDelete}
                      title="Delete Confirmation"
                      message="Are you sure you want to delete this Po?"
                    />
                  )}

                  {showPopUp && (
                    <PurchaseOrderDetails
                      showPopUp={showPopUp}
                      cell={data.find(row => row.id === showPopUp)}
                      editTag={false} // Changed from true to false to allow viewing
                      setShowPopUp={setShowPopUp}
                      handleEdit={handleEdit} // Changed from handlePoEdit to handleSkuEdit to match component prop
                    />
                  )}
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

export default PurchaseOrderTable
