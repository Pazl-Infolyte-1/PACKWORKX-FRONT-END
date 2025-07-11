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
import WorkOrderDetails from './WorkOrderDetails'
import Loading from '../../components/New/Loading'
import ReusableTable from '../SalesOrder/ReusableTable'
import { data, useNavigate } from 'react-router-dom'
import ProgressCompletedModal from './ProgressCompletedModale'
import { workOrderApi } from '../../api/workOrder'
import LayerProduction from './LayerProduction'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'

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
  const [isLayerProductionOpen,setIsLayerProductionOpen] = useState(false)
  const [selectedWorkorder,setSelectedWorkorder] = useState('')
  const [selectedRow,setSelectedRow] = useState('')
  const [showLayersModal,setShowLayersModal] = useState(false)

  useEffect(() => {
    const fetchProgressOptions = async () => {
      try {
        const response = await workOrderApi.getWorkOrderProgressDropDownOptions()
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

  const hanleViewProductionClick = async(row)=>{
    try {
      setIsLayerProductionOpen(true)
      setSelectedWorkorder(row)
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewLayersClick = (row) => {
    setSelectedRow(row);
    setShowLayersModal(true);
  };

  const closeLayersModal = () => setShowLayersModal(false);

  const handlePriorityChange = async (e, id) => {
    const newValue = e
    const body = { priority: newValue }

    try {
      const response = await workOrderApi.workOrderStatusUpdate(id, body)

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
        const response = await workOrderApi.workOrderStatusUpdate(id, body)

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
    { key: 'work_generate_id', header: 'Number', field: 'work_generate_id', cellClass: '', searchIcon: true },
    { key: 'sales_generate_id', header: 'SALES-ID', field: 'salesOrder.sales_generate_id', cellClass: '', searchIcon: true },
    { key: 'sales_ui_id', header: 'SO-Reference', field: 'salesOrder.sales_ui_id', cellClass: '', searchIcon: true },
    { key: 'sku_name', header: 'SKU Name', field: 'sku_name', searchIcon: true },
    // { key: 'manufacture', header: 'Manufacture', field: 'manufacture', searchIcon: true  },
    {
      key: 'layers',
      header: 'Layers',
      field: 'layer_details',
      cellClass: '',
      type: 'custom',
      render: (row) => (
        <button
          title="View Layers"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(90deg, #e0e7ff 60%, #c7d2fe 100%)',
            color: '#3730a3',
            border: '1px solid #a5b4fc',
            borderRadius: '20px',
            padding: '2px 12px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1em',
            boxShadow: '0 2px 6px rgba(55, 48, 163, 0.08)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            outline: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(55, 48, 163, 0.18)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(55, 48, 163, 0.08)';
            e.currentTarget.style.transform = 'none';
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleViewLayersClick(row);
          }}
        >
          {/* Layers Icon */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L18 7.5L10 12L2 7.5L10 3Z" fill="#6366f1"/><path d="M18 12.5L10 17L2 12.5" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          {row.work_order_sku_values?.length || 0}
        </button>
      ),
    },
    { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
    { key: 'qty', header: 'Qty', type: 'number', field: 'qty' },
    {
      key: 'priority',
      header: 'priority',
      field: 'priority',
      type: 'custom',
      render: (row) => {
        const statusColors = {
          High: 'bg-red-100 text-red-800',
          Medium: 'bg-amber-100 text-amber-800',
          Low: 'bg-green-100 text-green-800',
        };
        const fixedSelectClass = "w-[120px] h-[32px] px-2 py-1 rounded-full text-xs font-semibold border outline-none min-w-[100px]";
        if (row.progress === 'Invoiced') {
          return (
            <div className={`${fixedSelectClass} ${statusColors[row.priority] || 'bg-gray-100 text-gray-800'}`}>
              {row.priority}
            </div>
          );
        }
        return (
          <select
            className={`${fixedSelectClass} ${statusColors[row.priority] || 'bg-gray-100 text-gray-800'}`}
            value={row.priority}
            onChange={(e) => handlePriorityChange(e.target.value, row.id)}
            style={{ minWidth: 100, width: 120, height: 32 }}
          >
            <option value="High" className="text-gray-700 bg-white">High</option>
            <option value="Medium" className="text-gray-700 bg-white">Medium</option>
            <option value="Low" className="text-gray-700 bg-white">Low</option>
          </select>
        );
      },
    },
    {
      key: 'progress',
      header: 'progress',
      field: 'progress',
      type: 'custom',
      render: (row) => {
        const statusColors = {
          Pending: 'bg-orange-100 text-orange-800',
          'Raw Material Allocation': 'bg-blue-100 text-blue-800',
          'Production Planned': 'bg-gray-100 text-gray-800',
          'Board Stage': 'bg-yellow-100 text-yellow-800',
          'Finish Stage': 'bg-purple-100 text-purple-800',
          Completed: 'bg-green-100 text-green-800',
          Invoiced: 'bg-red-100 text-red-800',
        };
        const fixedSelectClass = "w-[160px] h-[32px] px-2 py-1 rounded-full text-xs font-semibold border outline-none min-w-[140px]";
        if (row.progress === 'Invoiced') {
          return (
            <div className={`${fixedSelectClass} ${statusColors[row.progress] || 'bg-gray-100 text-gray-800'}`}>
              {row.progress}
            </div>
          );
        }
        return (
          <select
            className={`${fixedSelectClass} ${statusColors[row.progress] || 'bg-gray-100 text-gray-800'}`}
            value={row.progress}
            onChange={(e) => handleProgressChange(e.target.value, row.id)}
            style={{ minWidth: 140, width: 160, height: 32 }}
          >
            {progressOptions.map((option) => (
              <option key={option} value={option} className="text-gray-700 bg-white">{option}</option>
            ))}
          </select>
        );
      },
      searchIcon: true,
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
          {
            label: 'view Production Status',
            icon: cilTrash,
            onClick: () => {
              hanleViewProductionClick(row)
            },
          },
        ]}
      />
    )
  ),
},

  ]



  return (
    <>
      <ReusableTable
        columns={columns}
        data={cellData}
        miniScreenFields={['work_generate_id']}
        isMinimiseTable={isMinimiseTable}
        handleRowClick={handleView}
      />

      {/* Layers Modal */}
      <CustomPopup isOpen={showLayersModal} onClose={closeLayersModal} width="w-[500px]" height="500px">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Layers</h2>
            <p className="text-xs text-gray-500 mt-0.5">{selectedRow?.work_order_sku_values?.length || 0} layers found</p>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto pr-1 space-y-2">
            {(selectedRow?.work_order_sku_values || []).map((layer, idx) => (
              <div key={idx} className="border border-gray-200 rounded-md bg-white hover:shadow-sm transition-shadow duration-200">
                {/* Header row */}
                <div className="flex justify-between items-center p-2 pb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-800">
                       {layer?.layer}
                    </h3>
                    {layer?.layer_status && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${layer.layer_status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>{layer.layer_status}</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500">{layer.work_generate_id}</div>
                </div>
                {/* Content grid */}
                <div className="px-2 pb-2">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">GSM:</span>
                      <span className="font-medium text-gray-800 ml-1">{layer?.gsm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">BF:</span>
                      <span className="font-medium text-gray-800">{layer?.bf}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Material:</span>
                      <span className="font-medium text-gray-800">{layer?.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color:</span>
                      <span className="font-medium text-gray-800">{layer?.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight:</span>
                      <span className="font-medium text-gray-800">{
                        typeof layer?.weight === 'number' ? String(layer.weight).split('.')[0] + (String(layer.weight).includes('.') ? '.' + String(layer.weight).split('.')[1].slice(0,3) : '') : layer?.weight
                      }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bursting Strength:</span>
                      <span className="font-medium text-gray-800">{
                        typeof layer?.bursting_strength === 'number' ? String(layer.bursting_strength).split('.')[0] + (String(layer.bursting_strength).includes('.') ? '.' + String(layer.bursting_strength).split('.')[1].slice(0,3) : '') : layer?.bursting_strength
                      }</span>
                    </div>
                    {layer?.flute_type && (
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-500">Flute Type:</span>
                        <span className="font-medium text-gray-800">{layer.flute_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomPopup>
      
      <LayerProduction
        isOpen={isLayerProductionOpen}
        workorder={selectedWorkorder}
        onClose={()=>{
          setIsLayerProductionOpen(false)
          setSelectedWorkorder('')
        }}
        ></LayerProduction>

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
