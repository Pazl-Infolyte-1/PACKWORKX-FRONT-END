import React, { useContext, useEffect, useState } from 'react'
import { Lock } from 'lucide-react' // or your icon lib
import { productionApi } from '../../api/production'
import { useRawMaterialContext } from '../../Context/AlocateRawMeterialContext'

const AllcoateRMModal = ({ visibleAllocate, setVisibleAllocate, group, droppedItem }) => {
  const [allocateAmount, setAllocateAmount] = useState('')
  const [historyData, setHistoryData] = useState()
  const { getData,setAlertsApp } = useRawMaterialContext()



  useEffect(() => {
    async function fetchData() {
      const response = await productionApi.getInventoryHistory(droppedItem?.sfg?.id)
      setHistoryData(response.data.data)
      console.log('Modal opened with group & droppedItem:', response)
    }

    fetchData()
  }, [])

  const handleConfirm = async () => {
    const quantityNumber = parseFloat(allocateAmount)
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      setAlertsApp([{severity:'warning',message:'Please enter a valid allocation amount.'}])

      return
    }
    if (quantityNumber > group?.balance_Qty) {
      setAlertsApp([{severity:'warning',message:'Cannot allocate more than the balance to allocate in group.'}])
      // alert('Cannot allocate more than the balance to allocate in group.')
      return
    }

    console.log(droppedItem)
    const payload = {
      allocations: [
        {
          production_group_id: group?.id,
          inventory_id: droppedItem?.sfg.id,
          quantity_to_allocate: quantityNumber,
        },
      ],
    }

    console.log('Confirm Allocation Payload:', payload)
    try {
      const response = await productionApi.allocateInventoryToGroup(payload)
      if (response.status === 200 || response.status === 201) {
        setVisibleAllocate(false)
        setTimeout(async () => {
          await getData()
        }, 100)
      } else {
        alert('Failed to allocate. Please try again.')
      }
    } catch (error) {
      console.error('Allocation error:', error)
      alert('An error occurred during allocation. Please try again.')
    }
  }

  if (!visibleAllocate) return null

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setVisibleAllocate(false)}
      />

      <div className="flex  items-center justify-center p-1">
        <div className="relative w-[600px] max-h-[730px] bg-white px-4 shadow-lg overflow-hidden rounded-xl">
          <div className="p-2  border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Allocation - Reel 02</h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Quantity In Inventory</span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 w-24 text-right pr-2">
                  {droppedItem?.sfg?.quantity_available} KG
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Group Quantity</span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 w-24 text-right pr-2">
                  {group?.group_Qty} KG
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600"> Balance To Allocate In group</span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 w-24 text-right pr-2">
                  {group?.balance_Qty < 0 ? 0 : group?.balance_Qty} KG
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">How much to allocate</span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={allocateAmount}
                    onChange={(e) => setAllocateAmount(e.target.value)}
                    className="bg-blue-50 border border-blue-200 pr-14 px-3 py-1.5 rounded-md text-sm text-blue-600 w-24 text-left focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <span className="absolute z-4 top-1/2 right-2 -translate-y-1/2 text-sm text-gray-600 pointer-events-none">
                    Kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mt-2 w-[400px] mx-auto">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Blocked Quantity</h2>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex bg-gray-100 border-b border-gray-200">
                  <div className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 text-left">
                    Groups
                  </div>
                  <div className=" bg-gray-300"></div>
                  <div className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                    Quantity (Kg)
                  </div>
                </div>

                <div className="bg-white h-[250px] custom-scrollbar overflow-y-auto">
                  {historyData && historyData.group_allocations.length > 0 ? (
                    historyData.group_allocations
                      .filter((order) => order.net_allocated_qty > 0)
                      .length > 0 ? (
                        historyData.group_allocations
                          .filter((order) => order.net_allocated_qty > 0)
                          .map((order, index) => (
                            <div key={index} className="flex">
                              <div className="flex-1 px-4 py-3">
                                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                  GRP-#{order?.group_id}
                                </span>
                              </div>
                              <div className="w-px bg-gray-200"></div>
                              <div className="flex-1 px-4 py-3 flex items-center justify-end gap-2">
                                <span className="text-sm text-gray-800">{order.net_allocated_qty}</span>
                                <Lock className="w-4 h-4 text-gray-600" />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-sm text-gray-500">No history available</span>
                        </div>
                      )
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-sm text-gray-500">No history available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 justify-center">
              <button
                onClick={() => setVisibleAllocate(false)}
                className="w-32 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="w-32 py-2 bg-blue-800 text-white rounded-full text-sm font-medium hover:bg-blue-900 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllcoateRMModal
