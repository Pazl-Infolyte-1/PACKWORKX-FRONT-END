import React, { useState, Suspense } from 'react'
import InvoiceTemplate from './InvoiceTemplate'
import PurchaseTemplate from './Template'


function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('invoice')

  return (
    <div className="w-full rounded-lg shadow p-6">
      {/* Tabs */}
      <div className="flex border-b mb-6">
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
      </div>
      {/* Tab Content */}
        {activeTab === 'purchase' && <PurchaseTemplate/> }
        {activeTab === 'invoice' && <InvoiceTemplate />}
    </div>
  )
}

export default TemplatesPage