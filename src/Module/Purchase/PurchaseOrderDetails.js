// import React from 'react'
import PopUp from '../../components/New/PopUp'
import ActionButton from '../../components/New/ActionButton'
import React, { useState, useEffect, useMemo } from 'react'
import apiMethods from '../../api/config'

function PurchaseOrderDetails({ showPopUp, cell, editTag, setShowPopUp, handleSkuEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
      <div className="absolute bottom-44 -my-64 inset-0 bg-opacity-25 flex items-center justify-center">
        <div className="bg-white rounded p-6 max-w-md w-full border border-gray-950 z-50">
          <button onClick={onClose} className="float-right">
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    )
  }

  const openItemDetails = async (id) => {
    const response = await apiMethods.getItemList()
    const items = response?.data?.data || []
    console.log(items, 'item')
    const item = items.find((i) => i.id === parseInt(id))
    const customFields = item?.custom_fields ? JSON.parse(item.custom_fields) : {}
    console.log(customFields)

    setModalContent(
      <>
        <h3 className="text-xl font-semibold mb-3">Custom Fields</h3>
        {Object.entries(customFields).length > 0 ? (
          Object.entries(customFields).map(([key, value], idx) => (
            <p key={idx}>
              <strong>{key}:</strong> {value}
            </p>
          ))
        ) : (
          <p>No custom fields available.</p>
        )}
      </>,
    )
    setIsModalOpen(true)
  }

  const handlePDFDownload = async () => {
    try {
      const response = await apiMethods.downloadPurchaseOrderPDF(cell.id)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `purchase_order_${cell.purchase_generate_id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  return (
    <PopUp
      visible={showPopUp && !editTag} // This ensures proper visibility
      showCloseButton={true}
      setVisible={() => setShowPopUp(null)}
      height={'95vh'}
      width={'70vw'}
    >
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <header className="mb-2">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Purchase Order Details</h1>
                <p className="text-gray-500 mt-1">Purchase Order - #{cell.purchase_generate_id}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cell.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {cell.status === 'active' ? 'Approved' : 'Rejected'}
                </span>
                  <ActionButton label={'Download PDF'} variant="edit" height={8} onClick={handlePDFDownload}/>
                {/* <ActionButton
                  label={'Edit'}
                  variant="edit"
                  height={8}
                  width={24}
                  onClick={() => handleSkuEdit(cell.id)}
                /> */}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Supplier Information Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">Supplier Information</h2>
                <p className="text-gray-500">#{cell.supplier_id}</p>

                <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Name</span>
                      <span className="text-gray-800 mt-1">{cell.supplier_name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Contact</span>
                      <span className="text-gray-800 mt-1">{cell.supplier_contact}</span>
                    </div>
                    <div className="flex flex-col p-2 gap-2">
                      <span className="text-sm font-medium text-gray-500">Email</span>
                      <span className="text-gray-800 mt-1">{cell.supplier_email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Address</span>
                      <span className="text-gray-800 mt-1">{cell.shipping_address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Order Details Card */}
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Purchase Order Details</h2>
                  <p className="text-gray-500">Purchase Order - #{cell.purchase_generate_id}</p>

                  <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">PO Date</span>
                        <span className="text-gray-800 mt-1">{cell.po_date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Valid Till</span>
                        <span className="text-gray-800 mt-1">{cell.valid_till}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Payment Terms</span>
                        <span className="text-gray-800 mt-1">{cell.payment_terms}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Freight Terms</span>
                        <span className="text-gray-800 mt-1">{cell.freight_terms}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Decision</span>
                        <span className="text-gray-800 mt-1">{cell.decision}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 relative">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">Item Details</h2>

                <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Name
                          </th> */}
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Code
                          </th>
                          <th></th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CGST
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SGST
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cell.items?.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.po_item_name}
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.item_code}
                            </td>
                            <td
                              onClick={() => openItemDetails(item.id)}
                              className="cursor-pointer text-blue-600"
                            >
                              ℹ️
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.unit_price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.cgst}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.sgst}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.total_amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex mt-4">
                  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {modalContent}
                  </Modal>

                  <table className="flex-1">
                    <tbody className="gap-4">
                      <tr>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total Qty: {cell.total_qty}
                        </td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          C-GST: {cell.cgst_amount}
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          S-GST: {cell.sgst_amount}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total: {cell.amount}
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Tax Amount: {cell.tax_amount}
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                          Total Incl of GST: {cell.total_amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  )
}

export default PurchaseOrderDetails