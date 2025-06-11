import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const AllcoateRMModal = ({ visibleAllocate, setVisibleAllocate }) => {
  const [allocateAmount, setAllocateAmount] = useState('50 Kg');

  const workOrders = [
    { id: 'WO - 2005', quantity: 10 },
    { id: 'WO - 2006', quantity: 250 },
    { id: 'WO - 2007', quantity: 100 },
    { id: 'WO - 2008', quantity: 50 }
  ];

  if (!visibleAllocate) return null;

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setVisibleAllocate(false)} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-[600px] max-h-[750px] bg-white shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-4 pb-2 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-800 mb-5">
              Allocation - Reel 02
            </h1>
            
            {/* Quantity Information */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Quantity</span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 w-24 text-right pr-2">
                  500 Kg
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Quantity</span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 w-24 text-right pr-2">
                  90 Kg
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">How much do you want to allocate</span>
                <input 
                  type="text" 
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(e.target.value)}
                  className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md text-sm text-blue-600 w-24 text-right pr-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Blocked Quantity Section */}
            <div className="mt-2 w-[400px] mx-auto">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Blocked Quantity
              </h2>
              
              {/* Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="flex bg-gray-100 border-b border-gray-200">
                  <div className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 text-left">
                    Work Order
                  </div>
                  <div className="w-px bg-gray-300"></div>
                  <div className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                    Quantity (Kg)
                  </div>
                </div>
                
                {/* Table Rows */}
                <div className="bg-white">
                  {workOrders.map((order, index) => (
                    <div key={index} className={`flex`}>
                      <div className="flex-1 px-4 py-3">
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                          {order.id}
                        </a>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="flex-1 px-4 py-3 flex items-center justify-end gap-2">
                        <span className="text-sm text-gray-800">{order.quantity}</span>
                        <Lock className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 justify-center">
              <button 
                onClick={() => setVisibleAllocate(false)}
                className="w-32 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button className="w-32 py-2 bg-blue-800 text-white rounded-full text-sm font-medium hover:bg-blue-900 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllcoateRMModal;