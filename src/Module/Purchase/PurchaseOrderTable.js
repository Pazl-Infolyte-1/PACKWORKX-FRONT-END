import React, { useState, useEffect } from 'react'
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
import ReusableTable from '../SalesOrder/ReusableTable'

function PurchaseOrderTable({
  data = [],
  handleDelete,
  handleEdit,
  handleView,
  handlePurchaseDetails,
  loading,
  setRefresh,
}) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [poData, setPoData] = useState([])
  const [grnValidationMap, setGrnValidationMap] = useState({}) // ✅ for per-row validation
  const [expandedRowId, setExpandedRowId] = useState(null)
  // const [itemData, setItemData] = useState([])

  const openItemDetails = (id) => {
    setExpandedRowId((prevId) => (prevId === id ? null : id))
  }
  // getItemData
  // const getItemData = async () => {
  //   try {
  //     const response = await apiMethods.getItemList()
  //     const productData = response || []
  //     console.log('Fetched Item Data:', productData)
  //     setItemData(productData)
  //   } catch (error) {
  //     console.error('Error fetching Purchase Order data:', error)
  //   }
  // }
  // useEffect(() => {
  //   getItemData()
  // }, [])

  // const handleGrnCheck = async () => {
  //   try {
  //     const response = await apiMethods.getGrn()
  //     const grnData = response?.data?.data || []

  //     const poReturn = await apiMethods.getPurchaseReturn()
  //     const poReturnData = [
  //       ...(poReturn?.data?.approved || []),
  //       ...(poReturn?.data?.disapproved || []),
  //     ]

  //     const map = {}

  //     data.forEach((row) => {
  //       const hasGrn = grnData.some((grn) => grn.po_id === row.id)
  //       const matchingPor = poReturnData.find((por) => por.po_id === row.id)

  //       let status = 'Created'

  //       if (matchingPor) {
  //         status =
  //           Number(row.total_amount) === Number(matchingPor.total_amount) ? 'Returned' : 'Amendment'
  //       } else if (hasGrn) {
  //         status = 'Received'
  //       }

  //       map[row.id] = status
  //     })

  //     setGrnValidationMap(map)
  //   } catch (error) {
  //     console.error('Error fetching GRN or Purchase Return data:', error)
  //   }
  // }

  // useEffect(() => {
  //   if (data?.length > 0) {
  //     handleGrnCheck()
  //   }
  // }, [data])

  const handlePoDelete = async () => {
    if (!deleteId) {
      setAlerts([{ severity: 'warning', message: 'No Purchase Order selected to delete.' }])
      return
    }

    try {
      await apiMethods.deletePurchaseOrder(deleteId)
      setPoData((prev) => prev.filter((po) => po.id !== deleteId))
      setAlerts([{ severity: 'success', message: 'Purchase Order deleted successfully!' }])
      setTimeout(() => {
        window.location.reload()
      }, 100)
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

  const handleCloseAlert = () => {
    setAlerts([])
  }

  const handleStatusChange = async (id, newStatus) => {
    const currentPo = data.find((po) => po.id === id)
    const payload = {
      decision: newStatus,
      items: currentPo.items || [],
    }

    try {
      const response = await apiMethods.updatePurchaseOrder(id, payload)
      setAlerts([{ severity: 'success', message: response.data.message }])
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Error:', error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Failed to update status' },
      ])
    }
  }

  const columns = [
    { key: 'purchase_generate_id', header: 'PO ID', field: 'purchase_generate_id' },
    {
      key: 'supplier_name',
      header: (
        <>
          Supplier Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'supplier_name',
    },
    {
      key: 'supplier_contact',
      header: 'Supplier Contact',
      field: 'supplier_contact',
      type: 'number',
    },
    {
      key: 'po_date',
      header: 'PO Date',
      field: 'po_date',
      type: 'date',
    },
    {
      key: 'valid_till',
      header: 'Valid Till',
      field: 'valid_till',
      type: 'date',
    },
    {
      key: 'status',
      header: 'Status',
      type: 'custom',
      render: (row) => (
        <>
          {console.log(row.po_status)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold 
          ${row.po_status === 'partialy-recieved' ? 'bg-blue-100 text-blue-800' : ''}
          ${row.po_status === 'created' ? 'bg-green-100 text-green-800' : ''}
          ${row.po_status === 'returned' ? 'bg-red-100 text-red-800' : ''}
          ${row.po_status === 'recieved' ? 'bg-green-500 text-black' : ''}
          ${row.po_status === 'amended' ? 'bg-orange-600 text-white' : ''}
          `}
          >
            {row.po_status || 'Created'}
          </span>
        </>
      ),
    },
    {
      key: 'decision',
      header: 'Decision',
      field: 'decision',
      type: 'dropdown',
      options: ['approve', 'disapprove'],
      getOptionClass: (val) => {
        switch (val) {
          case 'approve':
            return 'bg-green-100 text-green-800 border-green-300 text-xs w-[120px]'
          case 'disapprove':
            return 'bg-red-100 text-red-800 border-red-300 text-xs w-[120px]'
          default:
            return 'bg-gray-100 text-gray-800 border-gray-300 text-xs w-[120px]'
        }
      },
      onChange: (row, newValue) => {
        handleStatusChange(row.id, newValue.toLowerCase())
      },
    },
    {
      key: 'payment_terms',
      header: 'Payment Terms',
      field: 'payment_terms',
    },
    {
      key: 'actions',
      header: 'Action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'View',
              icon: cilHandPointRight,
              onClick: () => setShowPopUp(row.id),
            },

            ...(row.po_status === 'created'
              ? [
                  { label: 'Edit', icon: cilPencil, onClick: () => handleEdit(row.id) },
                  {
                    label: 'Delete',
                    icon: cilTrash,
                    onClick: () => openDeleteModal(row.id),
                  },
                ]
              : []),

            ...(row.po_status === 'recieved'
              ? [
                  {
                    label: 'Purchase Return',
                    icon: cilPencil,
                    onClick: () => handlePurchaseDetails(row.id),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />
      <ReusableTable data={data} columns={columns} handleRowClick={(row) => setShowPopUp(row.id)} />

      {/* Popups */}
      {showPopUp && (
        <PurchaseOrderDetails
          showPopUp={showPopUp}
          cell={data.find((row) => row.id === showPopUp)}
          editTag={false}
          setShowPopUp={setShowPopUp}
          handleEdit={handleEdit}
        />
      )}

      {/* expandedRow */}
      {/* {expandedRowId === row.id && (
            <CTableRow className="bg-gray-50">
              <CTableDataCell colSpan={10} className="py-3 px-4 text-left">
                <div className="text-sm text-gray-800">
                  <strong>Item Details:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {row.supplier_name?.length > 0 ? (
                      row.items.map((item, index) => (
                        <li key={index}>
                          {item.supplier_name} - Qty: {item.supplier_name} - Price: {item.supplier_name}
                        </li>
                      ))
                    ) : (
                      <li>No items available</li>
                    )}
                  </ul>
                </div>
              </CTableDataCell>
            </CTableRow>
            )} */}

      {/* Delete Modal (placed once outside loop) */}
      <ConfirmationModale
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handlePoDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this PO?"
      />
    </div>
  )
}

export default PurchaseOrderTable
