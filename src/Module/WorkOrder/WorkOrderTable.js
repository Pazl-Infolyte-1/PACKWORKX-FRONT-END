import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import apiMethods from '../../api/config'
import WorkOrderDetails from './WorkOrderDetails'
import Loading from '../../components/New/Loading'
import ReusableTable from '../SalesOrder/ReusableTable'
import { data, useNavigate } from 'react-router-dom'
import ProgressCompletedModal from './ProgressCompletedModale'

const WorkOrderTable = ({
  cellData,
  setShowPopUp,
  showPopUp,
  handleEdit,
  setCellData,
  handleDelete,
  loading,
  setloading,
  setAlerts,
  isMinimiseTable,
}) => {
  const navigate = useNavigate()
  const [progressOptions, setProgressOptions] = useState([])
  const [isOpenProgressModale, setIsOpenProgressModale] = useState(false)
  const [completedWorkOrderData, setCompletedWorkOrderData] = useState(null) // or useState({})

  useEffect(() => {
    const fetchProgressOptions = async () => {
      try {
        const response = await apiMethods.getWorkOrderProgressDropDownOptions()
        const data = response?.data?.data || []
        const options = data.map((item) => item.work_order_status)
        setProgressOptions(options)
        console.log(options)
      } catch (error) {
        console.error('Error fetching work order progress options:', error)
      }
    }

    fetchProgressOptions()
  }, [])

  const handlePriorityChange = async (e, id) => {
    const newValue = e
    const body = { priority: newValue }

    try {
      const response = await apiMethods.workOrderStatusUpdate(id, body)

      setCellData((prev) => prev.map((r) => (r.id === id ? { ...r, priority: newValue } : r)))
      setAlerts([
        { severity: 'success', message: response?.data?.message || 'Successfull updated Progress' },
      ])
    } catch (error) {
      console.error('Error updating priority:', error)
      setAlerts([
        { severity: 'error', message: response?.data?.message || 'failed to update Progress' },
      ])
    } finally {
    }
  }

  const handleProgressChange = async (e, id) => {
    const newValue = e

    if (newValue == 'Completed') {
      const item = cellData.find((a) => a.id == id)
      if (!item) {
        console.log(`Item with id ${id} not found`)
        return
      }
      const newEntry = { id, qty: item.qty, progress: newValue }
      setCompletedWorkOrderData(newEntry)

      setIsOpenProgressModale(true)
    } else {
      const body = { progress: newValue }

      try {
        const response = await apiMethods.workOrderStatusUpdate(id, body)

        // Update UI if cellData is a state
        setCellData((prev) => prev.map((r) => (r.id === id ? { ...r, progress: newValue } : r)))
        setAlerts([
          {
            severity: 'success',
            message: response?.data?.message || 'Successfull updated Progress',
          },
        ])
      } catch (error) {
        console.error('Error updating progress:', error)
        setAlerts([
          { severity: 'error', message: response?.data?.message || 'failed to update Progress' },
        ])
      } finally {
        // setloading(false)
      }
    }
  }

  const handleView = (row) => {
    navigate(`view/${row.id}`)
  }
  const columns = [
    // {
    //   key: 'select',
    //   field: 'isSelected',
    //   header: '', // empty header for checkbox column
    //   type: 'checkbox',
    // },
    { key: 'work_generate_id', header: 'Number', field: 'work_generate_id', cellClass: '' },
    { key: 'sku_name', header: 'SKU Name', field: 'sku_name' },
    { key: 'manufacture', header: 'Manufacture', field: 'manufacture' },
    { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
    { key: 'qty', header: 'Qty', type: 'number', field: 'qty' },
    {
      key: 'priority',
      header: 'priority',
      field: 'priority',
      type: 'dropdown',
      options: ['High', 'Medium', 'Low'],
      getOptionClass: (val) => {
        switch (val) {
          case 'High':
            return 'bg-red-100 text-red-800'
          case 'Medium':
            return 'bg-amber-100 text-amber-800'
          default:
            return 'bg-green-100 text-green-800'
        }
      },
      onChange: (row, newValue) => {
        handlePriorityChange(newValue, row.id)
      },
    },
    {
      key: 'progress',
      header: 'progress',
      field: 'progress',
      type: 'dropdown',
      options: [...progressOptions],
      getOptionClass: (val) => {
        switch (val) {
          case 'Completed':
            return 'bg-green-100 text-green-800'
          case 'Pending':
            return 'bg-orange-100 text-orange-800'
          case 'Raw Material Allocation':
            return 'bg-blue-100 text-blue-800'
          case 'Production Planned':
            return 'bg-gray-100 text-gray-800'
          case 'Invoiced':
            return 'bg-red-100 text-red-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      },
      onChange: (row, newValue) => {
        handleProgressChange(newValue, row.id)
      },
    },

    {
  key: 'actions',
  header: 'action',
  field: 'actions',
  type: 'custom',
  render: (row) => (
    row.progress === 'Invoiced' ? (
      <div className="text-gray-400 cursor-not-allowed pointer-events-none">
        <svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      </div>
    ) : (
      <ThreeDotMenu
        value={[
          {
            label: 'View',
            icon: cilHandPointRight,
            onClick: () => {
              handleView(row)
            },
          },
          {
            label: 'Edit',
            icon: cilPencil,
            onClick: () => {
              handleEdit(row.id)
            },
          },
          {
            label: 'Delete',
            icon: cilTrash,
            onClick: () => {
              handleDelete(row.id)
            },
          },
        ]}
      />
    )
  ),
},
    // {
    //   key: 'actions',
    //   header: 'action',
    //   field: 'actions',
    //   type: 'custom',
    //   render: (row) => (
    //     <ThreeDotMenu
    //       value={[
    //         {
    //           label: 'View',
    //           icon: cilHandPointRight,
    //           onClick: () => {
    //             handleView(row)
    //           },
    //         },
    //         {
    //           label: 'Edit',
    //           icon: cilPencil,
    //           onClick: () => {
    //             handleEdit(row.id)
    //           },
    //         },
    //         {
    //           label: 'Delete',
    //           icon: cilTrash,
    //           onClick: () => {
    //             handleDelete(row.id)
    //           },
    //         },
    //       ]}
    //     />
    //   ),
    // },
  ]

  return (
    <>
      <ReusableTable
        columns={columns}
        data={cellData}
        miniScreenFields={['select', 'work_generate_id']}
        isMinimiseTable={isMinimiseTable}
        handleRowClick={handleView}
      />

      <ProgressCompletedModal
        qty={completedWorkOrderData?.qty}
        id={completedWorkOrderData?.id}
        progress={completedWorkOrderData?.progress}
        isOpen={isOpenProgressModale}
        onClose={() => setIsOpenProgressModale(false)}
        setAlerts={setAlerts}
        setCellData={setCellData}
      />
    </>
  )
}

export default WorkOrderTable

{
  /* <div className="h-[400px] overflow-y-auto border border-gray-200 custom-scrollbar">
<CTable striped hover className="w-full">
  <CTableHead className="bg-gray-100 sticky top-0 z-10">
    <CTableRow>
      <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        Number
      </CTableHeaderCell>
      <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        SKU Name <span className="text-gray-500">⌕</span>
      </CTableHeaderCell>
      <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        Manufacture <span className="text-gray-500">⌕</span>
      </CTableHeaderCell>
      {/* <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        Sales Order
      </CTableHeaderCell> */
}
{
  /* <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        Client
      </CTableHeaderCell> */
}
// <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//   Created Date
// </CTableHeaderCell>
{
  /* <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        ETD
      </CTableHeaderCell> */
}
// <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//   Qty
// </CTableHeaderCell>
{
  /* <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
        Status
      </CTableHeaderCell> */
}
//       <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//       Priority
//       </CTableHeaderCell>
//       <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//       progress
//       </CTableHeaderCell>
//       <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
//         Action
//       </CTableHeaderCell>
//     </CTableRow>
//   </CTableHead>

//   <CTableBody>
// {loading ? (
// <CTableRow>
//         <CTableDataCell colSpan={8} className="text-center py-6">
//           <Loading isLoading={loading} />
//         </CTableDataCell>
//       </CTableRow>
// ) : (
// cellData.length > 0 ? (
// cellData.map((cell, index) => (
// <CTableRow key={index} className="border-b">
//   <CTableDataCell
//     onClick={() =>setShowPopUp(cell.id)}
//    className="py-3 px-4 !text-[#8761e5] cursor-pointer underline">
//   {cell.work_generate_id}
//   </CTableDataCell>
//   <CTableDataCell className="py-3 px-4 text-gray-700">
//     {cell.sku_name}
//   </CTableDataCell>
//   <CTableDataCell className="py-3 px-4 text-gray-700">
//     {cell.manufacture}
//   </CTableDataCell>
//   {/* <CTableDataCell className="py-3 px-4 text-gray-700">
//     {cell.sales_order}
//   </CTableDataCell> */}
//   {/* <CTableDataCell className="py-3 px-4 text-gray-700">{cell.client}</CTableDataCell> */}
//   <CTableDataCell className="py-3 px-4 text-gray-700">
//     {/*{apiMethods.formatDate(cell.created_at)}*/}
//     {new Date(cell.created_at).toLocaleString()}
//   </CTableDataCell>
//   {/* <CTableDataCell className="py-3 px-4 text-gray-700">{cell.etd}</CTableDataCell> */}
//   <CTableDataCell className="py-3 px-4 text-gray-700">{cell.qty}</CTableDataCell>

//   {/* <CTableDataCell className="py-3 px-4 text-gray-700">
//     <span
//       className={`px-2.5 py-1 rounded-full text-sm font-medium ${
//         cell.status === 'active'
//           ? 'bg-green-100 text-green-800'
//           : 'bg-gray-100 text-gray-800'
//       }`}
//     >
//       {cell.status}
//     </span>
//   </CTableDataCell> */}
// <CTableDataCell className="py-3 px-4">
// <select
// className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border border-gray-300
// ${cell.priority === "High"
// ? "bg-red-100 text-red-800"
// : cell.priority === "Medium"
// ? "bg-amber-100 text-amber-800"
// : "bg-green-100 text-green-800"
// }`}
// value={cell.priority}
// onChange={(e) => handlePriorityChange(e, cell.id)}
// >
// <option className="text-gray-700 bg-white" value="High">High</option>
// <option className="text-gray-700 bg-white" value="Medium">Medium</option>
// <option className="text-gray-700 bg-white" value="Low">Low</option>
// </select>
// </CTableDataCell>

//   <CTableDataCell className="py-3 px-4 text-gray-700">
//     <select
//       className="px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-800 border border-gray-300 outline-none"
//       value={cell.progress}
//       onChange={(e) => handleProgressChange(e, cell.id)}
//     >
//       <option value="Pending">Pending</option>
//       <option value="Product Planning">Product Planning</option>
//       <option value="Procurement Sourcing">Procurement Sourcing</option>
//       <option value="Production Planning">Production Planning</option>
//       <option value="Production">Production</option>
//       <option value="Quality Control">Quality Control</option>
//       <option value="Packaging">Packaging</option>
//       <option value="Shipping">Shipping</option>
//     </select>
//   </CTableDataCell>

//   <CTableDataCell className="py-3 px-4 text-gray-700 text-center">
//     <ThreeDotMenu
//       value={[
//         {
//           label: 'View',
//           icon: cilHandPointRight,
//           onClick: () => {
//             setShowPopUp(cell.id)
//           },
//         },
//         {
//           label: 'Edit',
//           icon: cilPencil,
//           onClick: () => {
//             handleEdit(cell.id)
//           },
//         },
//         {
//           label: 'Delete',
//           icon: cilTrash,
//           onClick: () => {
//             handleDelete(cell.id)
//           },
//         },
//       ]}
//     />
//   </CTableDataCell>
//   <WorkOrderDetails showPopUp={showPopUp} setShowPopUp={setShowPopUp} cell={cell} />
// </CTableRow>
// ))
// ) : (
// <CTableRow>
// <CTableDataCell colSpan={11} className="text-center py-3">
//   No data available
// </CTableDataCell>
// </CTableRow>
// )
// )}
// </CTableBody>
// </CTable>
// </div> */}
