import React, { useEffect, useState } from 'react'
import ReusableTable from '../SalesOrder/ReusableTable'
import { useNavigate } from 'react-router-dom'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilGroup, cilLayers, cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import { workOrderApi } from '../../api/workOrder'
import { taskApi } from '../../api/task'

const TaskTable = ({ isMinimized, handleEdit, taskData ,selectedStatus,setSelectedStatus}) => {
  const navigate = useNavigate()
  const [groupPopupData, setGroupPopupData] = useState(null);
    const [progressOptions, setProgressOptions] = useState([])
      const [completedWorkOrderData, setCompletedWorkOrderData] = useState(null)
        const [isOpenProgressModale, setIsOpenProgressModale] = useState(false)
      const [updatePopupData, setUpdatePopupData] = useState(null);
const closeUpdatePopup = () => setUpdatePopupData(null);
const handleOk = async () => {
  if (!selectedStatus || !updatePopupData?.id) {
    console.warn('Missing status or group ID');
    return;
  }

  try {
    const bodyData = {
      progress: selectedStatus,
    };

    const response = await taskApi.groupStatusUpdate(updatePopupData.id, bodyData);

    console.log('Status updated successfully:', response.data);
    // Optionally show success message, refresh list, or close popup
    closeUpdatePopup();
  } catch (error) {
    console.error('Error updating group status:', error.response?.data || error.message);
    // Optionally show error toast/alert
  }
};

 const statusOptions = [
    {
      id: 'completed',
      label: 'Completed',
      icon: '✓',
      description: 'Mark work order as completed',
      color: 'emerald',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      selectedBg: 'from-emerald-500 to-emerald-600',
      hoverBg: 'hover:from-emerald-100 hover:to-emerald-200'
    },
    {
      id: 'invoiced',
      label: 'Invoiced',
      icon: '📄',
      description: 'Mark work order as invoiced',
      color: 'blue',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      selectedBg: 'from-blue-500 to-blue-600',
      hoverBg: 'hover:from-blue-100 hover:to-blue-200'
    }
  ];

useEffect(() => {
  const fetchProgressOptions = async () => {
    try {
      const response = await workOrderApi.getWorkOrderProgressDropDownOptions();
      const data = response?.data?.data || [];

      // Filter only items with id 6 and 7
      const options = data
        //.filter((item) => item.id === 6 || item.id === 7)
        .map((item) => item.work_order_status);

      setProgressOptions(options);
      console.log('Filtered Progress Options (id 6 & 7):', options);
    } catch (error) {
      console.error('Error fetching work order progress options:', error);
    }
  };

  fetchProgressOptions();
}, []);

const handleUpdateStatus = (row) => {
  setUpdatePopupData(row); // Pass row data if needed in popup
};

const openGroupPopup = (row) => {
  setGroupPopupData(row.production_groups);
};

const closeGroupPopup = () => {
  setGroupPopupData(null);
};


  const handleProgressChange = async (e, id) => {
    const newValue = e

    if (newValue == 'Completed') {
      const item = cellData.find((a) => a.id == id)
      if (!item) {
        console.log(`Item with id ${id} not found`)
        return
      }
      const newEntry = { id, qty: item.qty, group_status: newValue }
      setCompletedWorkOrderData(newEntry)

      setIsOpenProgressModale(true)
    } else {
      const body = { group_status: newValue }

      try {
        const response = await taskApi.groupStatusUpdate(id, body)

        // Update UI if cellData is a state
        //setCellData((prev) => prev.map((r) => (r.id === id ? { ...r, progress: newValue } : r)))
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
  const columns = [
            { key: 'work_order', header: 'Work Order', field: 'work_generate_id' },
{
  key: 'group',
  header: 'Group',
  field: 'production_groups',
  type: 'custom',
  render: (row) => {
    const groupCount = row.production_groups?.length ?? 0;

    return groupCount > 0 ? (
   <button
  onClick={() => openGroupPopup(row)}
  className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded-full shadow-sm hover:bg-blue-200 hover:scale-[1.03] transition-all duration-200 ease-in-out"
  title="View Groups"
>
  <CIcon icon={cilLayers} size="sm" />
  {groupCount} Groups
</button>

    ) : (
      <span className="text-gray-500 text-sm">--</span>
    );
  },
},

    {
  key: 'progress',
  header: 'Status',
  field: 'progress',
  type: 'custom',
  render: (row) => {
    const status = row.progress;

    const getChipClass = (val) => {
      switch (val) {
        case 'Completed':
          return 'bg-green-100 text-green-800';
        case 'Pending':
          return 'bg-orange-100 text-orange-800';
        case 'Raw Material Allocation':
          return 'bg-blue-100 text-blue-800';
        case 'Production Planned':
          return 'bg-gray-100 text-gray-800';
        case 'Invoiced':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span
        className={`inline-block text-center px-2 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getChipClass(status)}`}
        style={{ width: '200px' }} // 👈 Enforces fixed width
      >
        {status || '--'}
      </span>
    );
  },
}
,
 {
  key: 'update',
  header: 'Update Status',
  field: 'actions',
  type: 'custom',
  render: (row) => {
    const isInvoiced = row.progress === 'Invoiced';

    return (
      <button
        onClick={() => {
          if (!isInvoiced) handleUpdateStatus(row);
        }}
        disabled={isInvoiced}
        className={`group relative w-[170px] inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-all duration-200 ease-in-out focus:outline-none
          ${isInvoiced
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md active:scale-95 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
          }
        `}
      >
        <CIcon 
          icon={cilPencil} 
          size="sm"
          className={`
            transition-transform duration-200
            ${isInvoiced ? 'text-gray-400' : 'group-hover:rotate-12 group-hover:scale-110'}
          `}
        />
        <span className={`transition-all duration-200 ${!isInvoiced && 'group-hover:translate-x-0.5'}`}>
          {isInvoiced ? 'Updated' : 'Update Status'}
        </span>

        {!isInvoiced && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        )}
      </button>
    );
  },
}

  ]
  return (  
    <div>
      <ReusableTable
        data={taskData}
        columns={columns}
        //handleRowClick={(row) => navigate(`/task/view/${row.id}`)}
        //miniScreenFields={['id', 'work_order']}
        //isMinimiseTable={isMinimized}
      />
<CustomPopup isOpen={!!groupPopupData} onClose={closeGroupPopup} width="w-[500px]" height="500px">
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="border-b pb-2 mb-2">
      <h2 className="text-lg font-semibold text-gray-800">Production Groups</h2>
      <p className="text-xs text-gray-500 mt-0.5">{groupPopupData?.length || 0} groups found</p>
    </div>

    {/* Scrollable content */}
    <div className="overflow-y-auto pr-1 space-y-2">
      {groupPopupData?.map((group) => (
        <div key={group.id} className="border border-gray-200 rounded-md bg-white hover:shadow-sm transition-shadow duration-200">
          {/* Header row */}
          <div className="flex justify-between items-center p-2 pb-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-800">
                {group.production_group_generate_id}
              </h3>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  group.group_status === 'pending'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {group.group_status}
              </span>
            </div>
            <div className="text-[10px] text-gray-500">
              {new Date(group.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Content grid */}
          <div className="px-2 pb-2">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-800 truncate ml-1">{group.group_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total Qty:</span>
                <span className="font-medium text-gray-800">{group.group_Qty?.toLocaleString() || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Balance:</span>
                <span className="font-medium text-gray-800">{group.balance_qty?.toLocaleString() || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Entries:</span>
                <span className="font-medium text-gray-800">{group.work_order_entries_count || 0}</span>
              </div>

              <div className="flex justify-between col-span-2">
                <span className="text-gray-500">Group Values:</span>
                <span className="font-medium text-gray-800">{group.group_value?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</CustomPopup>

 <CustomPopup isOpen={!!updatePopupData} onClose={closeUpdatePopup} width="w-[600px]" height="420px">
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Update Work Order Status</h2>
      <p className="text-xs text-gray-600">Choose the new status for this work order</p>
    </div>

    {/* Status Options */}
    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
      {statusOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => setSelectedStatus(option.label)}
          className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-300 transform
            ${selectedStatus === option.label 
              ? `bg-gradient-to-r ${option.selectedBg} text-white border-transparent shadow-md scale-100`
              : `bg-gradient-to-r ${option.bgGradient} ${option.borderColor} ${option.hoverBg} hover:shadow-sm`
            }
          `}
        >
          <div className="flex items-center space-x-3">
            {/* Icon */}
            <div className={`text-xl p-2 rounded-full transition-all
              ${selectedStatus === option.label 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-white shadow-sm'}
            `}>
              {option.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`text-sm font-medium transition-colors
                ${selectedStatus === option.label ? 'text-white' : 'text-gray-800'}
              `}>
                {option.label}
              </h3>
              <p className={`text-xs transition-colors
                ${selectedStatus === option.label ? 'text-white/80' : 'text-gray-600'}
              `}>
                {option.description}
              </p>
            </div>

            {/* Selection indicator */}
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
              ${selectedStatus === option.label 
                ? 'border-white bg-white' 
                : 'border-gray-300 bg-transparent'}
            `}>
              {selectedStatus === option.label && (
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${option.selectedBg}`}></div>
              )}
            </div>
          </div>

          {/* Shine effect */}
          {selectedStatus === option.label && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-pulse"></div>
          )}
        </div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end space-x-3 mt-4 pt-3 border-t">
      <button
        onClick={closeUpdatePopup}
        className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Cancel
      </button>
      <button
        onClick={handleOk}
        disabled={!selectedStatus}
        className={`
          px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
          ${selectedStatus 
            ? 'text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-sm hover:shadow-md' 
            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }
        `}
      >
        Update Status
      </button>
    </div>
  </div>
</CustomPopup>


    </div>
  )
}

export default TaskTable
