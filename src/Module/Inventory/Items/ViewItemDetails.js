import React, { useEffect, useState } from 'react'
import PopUp from '../../../components/New/PopUp'

function ItemView({ viewItem, setViewItem, selectedItemData }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  if (!selectedItemData) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const openItemDetails = () => {
    const item = selectedItemData
    const customFields = item.custom_fields ? JSON.parse(item.custom_fields) : {}

    setModalContent(
      <>
        <h3 className="text-xl font-semibold mb-3">Custom Fields</h3>
        {Object.entries(customFields).map(([key, value], index) => (
          <p key={index}>
            <strong>{key}:</strong> {value}
          </p>
        ))}
      </>,
    )
    setIsModalOpen(true)
  }

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 max-w-md w-full">
          <button onClick={onClose} className="float-right">
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    )
  }

  return (
    <PopUp
      visible={viewItem}
      showCloseButton={true}
      setVisible={() => setViewItem(false)}
      height={'95vh'}
      width={'70vw'}
    >
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md h-full overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-indigo-800">Product Details</h2>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-indigo-800">
                Product ID: #{selectedItemData?.item_generate_id}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-gray-600">
              Created on {formatDate(selectedItemData?.created_at)}
            </span>
          </div>
        </div>

        {/* Item Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              {/* <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg> */}
              <span onClick={openItemDetails} className="cursor-pointer text-blue-600">
                ℹ️
              </span>
              Product Details
            </h3>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                <Detail label="Reference Number" value={selectedItemData?.item_code} />
                <Detail label="Product Name" value={selectedItemData?.item_name} />

                <Detail label="UOM" value={selectedItemData?.uom} />
                <Detail label="HSN Code" value={selectedItemData?.hsn_code} />
                <Detail label="Product Type" value={selectedItemData?.item_type} />
                <Detail label="Category" value={selectedItemData?.category} />
                <Detail label="Minimum Stock" value={selectedItemData?.minimum_stock} />
                <Detail label="Manufacturer" value={selectedItemData?.manufacturer} />
                <Detail label="Standard Cost" value={`₹${selectedItemData?.standard_cost}`} />
                <Detail label="Specifications" value={selectedItemData?.specifications} />
                <Detail label="Reorder Level" value={selectedItemData?.reorder_level} />
                <Detail label="Status" value={selectedItemData?.status} />
                <Detail label="Description" value={selectedItemData?.description} />

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  {modalContent}
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  )
}

// Reusable detail component
const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value || 'N/A'}</p>
  </div>
)

export default ItemView
