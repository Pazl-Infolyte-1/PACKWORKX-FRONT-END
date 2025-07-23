import React, { useEffect, useState } from 'react'
import { X, Lock } from 'lucide-react'
import { productionApi } from '../../api/production'
import { useRawMaterialContext } from '../../Context/AlocateRawMeterialContext'

const AllcoateRMModal = ({ visibleAllocate, setVisibleAllocate, group, droppedItem }) => {
  const [allocateAmount, setAllocateAmount] = useState('')
  const [historyData, setHistoryData] = useState()
  const { getData, setAlertsApp } = useRawMaterialContext()

  useEffect(() => {
    async function fetchData() {
      const response = await productionApi.getInventoryHistory(droppedItem?.sfg?.id)
      setHistoryData(response.data.data)
    }
    if (visibleAllocate) fetchData()
  }, [visibleAllocate, droppedItem])

  const handleConfirm = async () => {
    const quantityNumber = parseFloat(allocateAmount)
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      setAlertsApp([{ severity: 'warning', message: 'Please enter a valid allocation amount.' }])
      return
    }
    if (quantityNumber > group?.balance_qty) {
      setAlertsApp([{ severity: 'warning', message: 'Cannot allocate more than the balance to allocate in group.' }])
      return
    }
    if (quantityNumber > droppedItem?.sfg?.quantity_available) {
      setAlertsApp([{ severity: 'warning', message: 'Cannot allocate more than available inventory quantity.' }])
      return
    }
    const payload = {
      allocations: [
        {
          production_group_id: group?.id,
          inventory_id: droppedItem?.sfg.id,
          quantity_to_allocate: quantityNumber,
        },
      ],
    }
    try {
      const response = await productionApi.allocateInventoryToGroup(payload)
      if (response.status === 200 || response.status === 201) {
        setVisibleAllocate(false)
        setTimeout(async () => {
          await getData()
        }, 100)
      } else {
        setAlertsApp([{ severity: 'error', message: 'Failed to allocate. Please try again.' }])
      }
    } catch (error) {
      setAlertsApp([{ severity: 'error', message: 'An error occurred during allocation. Please try again.' }])
    }
  }

  if (!visibleAllocate) return null

  return (
    <div
    // onClick={() => setVisibleAllocate(false)}
     className="fixed inset-0 z-[2000] flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm px-1 sm:px-2 md:px-0">
      <div className="relative w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeInUp max-h-[98vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-50 bg-white">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 tracking-tight">Allocate Raw Material</h2>
          <button
            onClick={() => setVisibleAllocate(false)}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {/* Content */}
        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-8 p-2 sm:p-4 md:p-8 bg-gray-50 overflow-y-auto flex-1">
          {/* Left: Allocation Form */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-xs text-gray-500">Available Quantity In Inventory</span>
                <div className="text-sm sm:text-base font-medium text-gray-800 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-100">
                  {droppedItem?.sfg?.quantity_available ?? '--'} <span className="text-xs font-normal text-gray-400">KG</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-xs text-gray-500">Total Group Quantity</span>
                <div className="text-sm sm:text-base font-medium text-gray-800 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-100">
                  {group?.group_Qty ?? '--'} <span className="text-xs font-normal text-gray-400">KG</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-xs text-gray-500">Balance To Allocate In Group</span>
                <div className="text-sm sm:text-base font-medium text-gray-800 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-100">
                  {group?.balance_qty < 0 ? 0 : group?.balance_qty ?? '--'} <span className="text-xs font-normal text-gray-400">KG</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs sm:text-xs text-gray-500">How much to allocate</span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={allocateAmount}
                    onChange={(e) => setAllocateAmount(e.target.value)}
                    className="bg-white border border-gray-200 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all pr-14 shadow-sm placeholder-gray-300"
                    placeholder="Enter amount"
                  />
                  <span className="absolute right-3 sm:right-4 text-sm text-gray-400 pointer-events-none">KG</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 justify-center md:justify-start">
              <button
                onClick={() => setVisibleAllocate(false)}
                className="w-24 sm:w-28 py-2 bg-white text-gray-600 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="w-24 sm:w-28 py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Confirm
              </button>
            </div>
          </div>
          {/* Right: Blocked Quantity/History */}
          <div className="flex-1 min-w-0 mt-6 md:mt-0">
            <div className="bg-white rounded-xl p-0 shadow-none border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-2 px-3 sm:px-4 pt-4 pb-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-800">Blocked Quantity</h3>
              </div>
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-40 sm:max-h-64 custom-scrollbar">
                {historyData && historyData.group_allocations && historyData.group_allocations.filter((order) => order.net_allocated_qty > 0).length > 0 ? (
                  historyData.group_allocations
                    .filter((order) => order.net_allocated_qty > 0)
                    .map((order, index) => (
                      <div key={index} className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-transparent">
                        <span className="text-blue-700 font-medium text-xs sm:text-sm">GRP-#{order?.group_id}</span>
                        <span className="text-gray-800 font-semibold text-sm sm:text-base flex items-center gap-1">{order.net_allocated_qty} <span className="text-xs font-normal text-gray-400">KG</span></span>
                      </div>
                    ))
                ) : (
                  <div className="flex items-center justify-center h-16 sm:h-20">
                    <span className="text-xs sm:text-sm text-gray-400">No blocked quantity history available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.25s cubic-bezier(.4,0,.2,1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e7ef; border-radius: 6px; }
      `}</style>
      </div>
    </div>
  )
}

export default AllcoateRMModal
