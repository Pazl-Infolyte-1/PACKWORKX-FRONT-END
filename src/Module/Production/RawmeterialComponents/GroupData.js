import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCollapse } from "@coreui/react"
import { FaAngleDown, FaAngleUp, FaHistory, FaUsers, FaTimes } from "react-icons/fa"
import ProgressBar from '../ProgressBar' // Assuming you have this component

function GroupData({ isVisible, onClose, data }) {
    console.log(data,'fffff')
  const [visibleHistory, setVisibleHistory] = useState(false)

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isVisible) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isVisible, onClose])


  const { production_group, allocation_status, allocation_history } = data

  const toggleHistoryCollapse = () => {
    setVisibleHistory(!visibleHistory)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const AllocationHistoryItem = ({ allocation }) => (
    <CCard className="p-2.5 mt-2.5 rounded-lg bg-transparent">
      <div className='flex justify-between'>
        <div className='flex flex-col items-start'>
          <div className="text-sm font-medium">Allocation #{allocation.id}</div>
          <div className="flex gap-3 mt-2 text-xs">
            <span>Allocated Qty: {allocation.allocated_Qty}</span>
            <span>Inventory ID: {allocation.Inventory?.inventory_generate_id}</span>
            <span className={allocation.Inventory.quantity_available === "0.00" ? "text-red-600" : ""}>
              Available In Inventory: {allocation.Inventory.quantity_available}
            </span>
            {/* <span className={`px-2 py-1 rounded text-xs ${
              allocation.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {allocation.status.toUpperCase()}
            </span> */}
          </div>
        </div>
        {/* <div className='flex justify-end items-center'>
          <span className="text-xs text-gray-500">
            {formatDate(allocation.created_at)}
          </span>
        </div> */}
      </div>
    </CCard>
  )

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
        onClick={onClose}
      />
      
      {/* Right-side Modal */}
      <div 
        className={`fixed right-0 top-0 h-full w-[29%] bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800">Production Group Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FaTimes className="text-gray-500 hover:text-gray-700" size={16} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="h-full overflow-y-auto pb-20"> {/* pb-20 to account for header */}
          <div className="p-4">
            <CCard
              className="mb-0"
              style={{
                backgroundColor: '#f5f4f7',
                borderRadius: '5px',
              }}
            >
              <CCardBody>
                <div className="flex flex-col">
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-3">
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-2 mb-1'>
                        <FaUsers className="text-primary" />
                        <span className="font-bold text-lg">{production_group.group_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          production_group.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {production_group.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">ID: {production_group.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Allocation Status Section */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Allocation Progress</div>
                    <div className="flex justify-between items-center mb-2">
                      <h6 className='text-primary font-bold text-lg'>
                        {allocation_status.allocated_qty}/{allocation_status.required_qty}
                      </h6>
                      {/* <span className="text-lg font-bold text-gray-700">
                        {allocation_status.allocation_percentage}%
                      </span> */}
                    </div>
                    <div className="w-[35%] mb-3 mx-auto flex justify-center">
                      <ProgressBar
                        value={allocation_status.allocation_percentage}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Required:</span>
                        <span className="font-medium">{allocation_status.required_qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allocated:</span>
                        <span className="font-medium">{allocation_status.allocated_qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-medium text-orange-600">{allocation_status.remaining_to_allocate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Group Details */}
                  <div className="mb-4 p-3 bg-white rounded-lg">
                    <div className="text-sm font-medium mb-2">Group Information</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Group Quantity:</span>
                        <span className="font-medium">{production_group.group_Qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allocated Quantity:</span>
                        <span className="font-medium">{production_group.allocated_Qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{formatDate(production_group.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(production_group.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* History Toggle */}
                  <div className="flex justify-between items-center mb-2">
                    <span
                      onClick={toggleHistoryCollapse}
                      className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      <FaHistory />
                      Allocation History ({allocation_history.length})
                      {visibleHistory ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </div>

                  {/* Collapsible History Section */}
                  <CCollapse className="custom-collapse" visible={visibleHistory}>
                    <hr className="my-3" />
                    {allocation_history.map((allocation) => (
                      <AllocationHistoryItem 
                        key={`allocation-${allocation.id}`} 
                        allocation={allocation} 
                      />
                    ))}
                  </CCollapse>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    </>
  )
}

export default GroupData