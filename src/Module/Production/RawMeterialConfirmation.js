import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function RawMeterialConfirmation() {
  const [allocateAmount, setAllocateAmount] = useState('50 Kg');

  const workOrders = [
    { id: 'WO - 2005', quantity: 10 },
    { id: 'WO - 2006', quantity: 250 },
    { id: 'WO - 2007', quantity: 100 },
    { id: 'WO - 2008', quantity: 50 }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800 mb-5">
            Allocation - Reel 02
          </h1>
          
          {/* Quantity Information */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Quantity</span>
              <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 min-w-16 text-center">
                500 Kg
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available Quantity</span>
              <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 min-w-16 text-center">
                90 Kg
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">How much do you want to allocate</span>
              <input 
                type="text" 
                value={allocateAmount}
                onChange={(e) => setAllocateAmount(e.target.value)}
                className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md text-sm text-blue-600 min-w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Blocked Quantity Section */}
          <div className="mt-2">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Blocked Quantity
            </h2>
            
            {/* Table Header */}
            <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md mb-2">
              <span className="text-sm font-medium text-gray-600">Work Order</span>
              <span className="text-sm font-medium text-gray-600">Quantity (Kg)</span>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-1">
              {workOrders.map((order, index) => (
                <div key={index} className="flex justify-between items-center px-3 py-3 border border-gray-200 rounded-md bg-white">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    {order.id}
                  </a>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-800">{order.quantity}</span>
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button className="flex-1 py-3.5 px-4 bg-gray-200 text-gray-600 rounded-full text-base font-medium hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button className="flex-1 py-3.5 px-4 bg-blue-800 text-white rounded-full text-base font-medium hover:bg-blue-900 transition-colors">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
