import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import apiMethods from '../../api/config'
import PopUp from '../../components/New/PopUp'
import GrnView from './GrnView'

const GrnTable = ({ grnData, setGrnData, setAlerts, handleEdit,setRefresh }) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openGrnModal, setOpenGrnModal] = useState(false)

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const handleDelete = async () => {
    try {
      const response = await apiMethods.deleteGrn(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setGrnData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'error', message: 'GRN deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete process',
        },
      ])
    }
  }

   const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  const handleStatusChange = async (id, newStatus) => {
  
    const currentGrn = grnData.find(grn => grn.id === id); // get full PO data
    console.log('Updating status for ID:', id, 'to', newStatus, 'Current GRN:', currentGrn);
    
    const payload = {
      status: newStatus,
      items: currentGrn.items || [] // send existing items back
    };
  
    try {
      const response = await apiMethods.editGrn(id, payload);
      console.log('Response:', response);
      
      setAlerts([{ severity: 'success', message: "Status updated successfully" }]);
            setRefresh((prev) => !prev);
  
    } catch (error) {
      console.error('Error:', error);
      setAlerts([{ severity: 'error', message: error?.response?.data?.message || 'Failed to update status' }]);
    }
  };
  

  return (
    <>
      <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
        <CTable striped hover className="w-full m-0">
          <CTableHead className="bg-gray-100 sticky -top-2 z-10">
            <CTableRow className="text-center">
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Id
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                PO ID
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                GRN Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Delivery Note No.
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Invoice No.
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Invoice Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Decision
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Received By
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {grnData && grnData.length > 0 ? (
              grnData.map((item) => (
                <CTableRow key={item.id} className="border-b text-center">
                  <CTableDataCell
                    onClick={() => setOpenGrnModal({ open: true, id: item.id })}
                    className="py-3 px-2 !text-blue-600 cursor-pointer underline text-start"
                  >
                    {item.grn_generate_id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.po_id}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    {formatDate(item.grn_date)}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.delivery_note_no}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.invoice_no}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    {formatDate(item.invoice_date)}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2">{item.received_by}</CTableDataCell>

                  <CTableDataCell className="py-3 px-4 text-gray-700 align-middle">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border 
                        ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : item.status === 'inactive'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                    >
                      <option className="text-gray-700 bg-white" value="active">
                        Approved
                      </option>
                      <option className="text-gray-700 bg-white" value="inactive">
                        Rejected
                      </option>
                    </select>
                  </CTableDataCell>



                  <CTableDataCell className="py-3 px-2">{item.received_by}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'Edit Grn',
                          icon: cilPencil,
                          onClick: () => {
                            handleEdit(item)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            openDeleteModal(item.id)
                          },
                        },
                      ]}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={8} className="py-3 px-2 text-center !text-red-500 ">
                  No Records Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
        <ConfirmationModale
          isOpen={confirmModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
        <PopUp
          visible={openGrnModal.open}
          setVisible={(isVisible) => {
            if (!isVisible) setOpenGrnModal({ open: false, id: null })
          }}
          showCloseButton={true}
          width={'60vw'}
          height="660px"
        >
          <GrnView id={openGrnModal.id} handleEdit={handleEdit} setOpenGrnModal={setOpenGrnModal} />
        </PopUp>
      </div>
    </>
  )
}

export default GrnTable
