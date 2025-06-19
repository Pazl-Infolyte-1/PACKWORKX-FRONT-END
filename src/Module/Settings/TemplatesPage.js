import React, { useState, Suspense } from 'react'
import InvoiceTemplate from './InvoiceTemplate'
import PurchaseTemplate from './Template'


function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('purchase')

  return (
    <div className="w-full rounded-lg shadow p-6">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`ml-4 px-4 py-2 font-semibold focus:outline-none ${
            activeTab === 'purchase'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('purchase')}
        >
          Purchase Order
        </button>
        <button
          className={`px-4 py-2 font-semibold focus:outline-none ${
            activeTab === 'invoice'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('invoice')}
        >
          Invoice
        </button>
        
      </div>
      {/* Tab Content */}
        {activeTab === 'invoice' && <InvoiceTemplate />}
        {activeTab === 'purchase' && <PurchaseTemplate/> }
    </div>
  )
}

export default TemplatesPage