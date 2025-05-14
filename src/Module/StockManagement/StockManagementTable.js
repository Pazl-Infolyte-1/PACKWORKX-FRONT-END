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
import ThreeDotMenu from '../../components/ThreeDotMenu'
import EditStockModal from './EditStockModal'

function StockManagementTable({ data, handleEdit, handleDelete }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
  
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  
    const handleEditClick = (item) => {
      setEditItem(item);
      setShowEditModal(true);
    };
  
    const handleDeleteClick = (id) => {
      setDeleteId(id);
      setShowDeleteConfirm(true);
    };
  
    const confirmDelete = () => {
      handleDelete(deleteId);
      setShowDeleteConfirm(false);
    };
  return (
  <div className="h-[400px] overflow-x-auto h-[350px] border whitespace-nowrap mt-2">      
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className="text-center">
            <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">
             Item Name
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
             SKU
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
             Previous Qty
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium text-start">
            Adjusted Qty
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
            Difference
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
            Reason
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
            Remarks
            </CTableHeaderCell>
            <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <CTableRow key={item.id} className="border-b text-center">
                <CTableDataCell className="py-3 px-4 text-blue-600 font-semibold underline text-start">
                  {item.item_name}
                </CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{item.sku}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{item.previous_qty}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700 text-start">{item.adjusted_qty}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{item.difference}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{item.reason}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{item.remarks}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'View',
                          icon: cilHandPointRight,
                          
                        },
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => handleEditClick(item),
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => handleDeleteClick(item.id),
                        },
                      ]}
                    />
                  </CTableDataCell>
                  {showEditModal && (
                        <EditStockModal
                        item={editItem}
                        onClose={() => setShowEditModal(false)}
                        onSave={(updatedItem) => {
                            handleEdit(updatedItem);
                            setShowEditModal(false);
                        }}
                        />
                    )}

                    {showDeleteConfirm && (
                        <ConfirmationModal
                        title="Delete Confirmation"
                        message="Are you sure you want to delete this record?"
                        onCancel={() => setShowDeleteConfirm(false)}
                        onConfirm={confirmDelete}
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

export default StockManagementTable




























