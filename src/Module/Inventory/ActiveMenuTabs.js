import React from 'react'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Info,
  MessageSquare,
  Package,
  Phone,
  Receipt,
  RotateCcw,
  Tag,
  TrendingDown,
  TrendingUp,
  Truck,
  User,
} from 'lucide-react'
import { FaRupeeSign } from 'react-icons/fa'

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />
    case 'in transit':
      return <AlertCircle className="w-5 h-5 text-blue-500" />
    default:
      return <Clock className="w-5 h-5 text-gray-500" />
  }
}

const getDifferenceColor = (difference) => {
  if (difference > 0) return 'text-green-600 bg-green-50'
  if (difference < 0) return 'text-red-600 bg-red-50'
  return 'text-gray-600 bg-gray-50'
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-500 text-green-800 border-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'in transit':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getTypeIcon = (type) => {
  return type === 'increase' ? (
    <TrendingUp className="w-5 h-5 text-green-500" />
  ) : (
    <TrendingDown className="w-5 h-5 text-red-500" />
  )
}

const getTypeColor = (type) => {
  return type === 'increase'
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200'
}

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'N/A'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const ProductDetails = ({ itemDetails, item, navigate, handleEdit }) => {
  const rawCustomFields = itemDetails?.products?.default_custom_fields
  const customData = rawCustomFields || {}

  return (
    <div className="p-3">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          Product Details
        </h2>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigate('/inventoryhandling/inventory_form')}
              className="bg-blue-600 h-8 hover:bg-blue-700 text-white font-bold px-2 rounded"
            >
              + Product
            </button>
            <button onClick={handleEdit} className="text-sm text-blue-600 hover:underline">
              ✎ Edit
            </button>
            <p className="text-xl font-bold m-0">{item?.item?.item_generate_id}</p>
          </div>
          <p className="text-sm font-bold m-0">
            Available Qty: {parseFloat(item?.quantity_available)}
          </p>
        </div>
      </div>

      {itemDetails?.products ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mt-1">
          {/* Header Section */}
          <div className="p-1 border-b bg-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {itemDetails.products.item_name}
                </h3>
                <p className="text-sm text-gray-600 m-0">{itemDetails.products.item_code}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border  ${getStatusColor(
                  itemDetails.products.status,
                )} bg-white/20 border-white/30`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(itemDetails.products.status)}
                  {itemDetails.products.status}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-4">
            {/* Description */}
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="m-0 text-sm font-semibold">Description</p>
              <p className="text-sm text-gray-700">{itemDetails.products.description}</p>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">HSN Code</p>
                    <p className="text-sm font-medium">{itemDetails.products.hsn_code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">Manufacturer</p>
                    <p className="text-sm font-medium">{itemDetails.products.manufacturer}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-gray-500 m-0">Standard Cost</p>
                    <p className="text-sm font-medium">₹{itemDetails.products.standard_cost}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 m-0">UOM</p>
                    <p className="text-sm font-medium">{itemDetails.products.uom || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Specifications</h4>
              <p className="text-sm text-gray-600">{itemDetails.products.specifications}</p>
            </div>

            {/* Stock & Tax Info */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-yellow-50 p-2 rounded-md">
                <p className="text-xs text-gray-500">Min Stock</p>
                <p className="text-sm font-medium text-yellow-700">
                  {itemDetails.products.min_stock_level}
                </p>
              </div>
              <div className="bg-orange-50 p-2 rounded-md">
                <p className="text-xs text-gray-500">Reorder Level</p>
                <p className="text-sm font-medium text-orange-700">
                  {itemDetails.products.reorder_level || 'N/A'}
                </p>
              </div>
              <div className="bg-purple-50 p-2 rounded-md">
                <p className="text-xs text-gray-500">GST</p>
                <p className="text-sm font-medium text-purple-700">
                  {itemDetails.products.cgst}% + {itemDetails.products.sgst}%
                </p>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="p-2">
              {Object.keys(customData).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base font-semibold text-gray-800">Additional Details</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(customData).map(([key, value]) => {
                      const processedKey = key
                        .replace(/[^a-zA-Z0-9 ]/g, ' ')
                        .replace(/\s+/g, ' ')
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                        .trim()

                      return (
                        <div
                          key={key}
                          className="flex gap-2 items-center py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-600">{processedKey}:</span>
                          <span className="text-sm font-semibold text-gray-900">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Created: {formatDate(itemDetails.products.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {formatDate(itemDetails.products.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No products found.</p>
        </div>
      )}
    </div>
  )
}

export const PurchaseOrderDetails = ({ itemDetails, item, navigate }) => {
  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {/* Icon and Title in a row, vertically centered */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Purchase Orders</h1>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2"></div>
              </div>
            </div>

            {/* Right side ID and Item Name */}
            <div className="flex items-center justify-between w-47">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate('/purchaseorder/form', {
                      state: {
                        item_id: itemDetails?.products?.id,
                      },
                    })
                  }
                  className="bg-blue-600 h-8 hover:bg-blue-700 text-white font-bold px-2 rounded"
                >
                  + Purchase
                </button>
              </div>
              <div className="text-right ml-2">
                <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
                <h3 className="text-xs text-gray-800">{itemDetails?.products?.item_name}</h3>
              </div>
            </div>
          </div>
        </div>

        {itemDetails?.purchaseOrders?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {itemDetails.purchaseOrders.map((po) => (
              <div
                key={po.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gray-200 p-2 text-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        {po.purchaseOrder.purchase_generate_id}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        po.status,
                      )} bg-white/20 border-white/30`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(po.status)}
                        {po.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Date and Supplier Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(po.purchaseOrder.po_date)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600 mb-1">
                          Supplier:{' '}
                          <span className="font-medium text-gray-900">
                            {po.purchaseOrder.supplier_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium text-blue-600">
                        {po.purchaseOrder.supplier_contact}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Description:</div>
                    <div className="text-sm font-medium text-gray-900 leading-relaxed">
                      {po.description}
                    </div>
                  </div>

                  {/* Quantity and Unit Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{po.quantity}</div>
                      <div className="text-xs text-gray-600 uppercase tracking-wide">Quantity</div>
                    </div>
                    <div className="text-center bg-green-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(po.unit_price)}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wide">
                        Unit Price
                      </div>
                    </div>
                  </div>

                  {/* Tax Information */}
                  <div className="bg-gray-50 rounded-lg p-1">
                    <div className="text-sm text-gray-600 mb-2">Tax Details:</div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{po.cgst}%</div>
                        <div className="text-xs text-gray-500">CGST</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{po.sgst}%</div>
                        <div className="text-xs text-gray-500">SGST</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(po.tax_amount)}
                        </div>
                        <div className="text-xs text-gray-500">Tax Amount</div>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaRupeeSign className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(po.total_amount)}
                      </div>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(po.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>PO Date: {formatDate(po.purchaseOrder.po_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Found</h3>
            <p className="text-gray-500">Get started by creating your first purchase order.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const BillingsDetails = ({ itemDetails, item, navigate }) => {
  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Billings</h1>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate('/billingmain/billingmainForm')}
                className="bg-blue-600 h-8 hover:bg-blue-700 text-white font-semibold px-2 rounded"
              >
                + Billing
              </button>
              <div className="text-right">
                <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
                <h3 className="text-xs text-gray-800">{itemDetails?.products?.item_name}</h3>
              </div>
            </div>
          </div>
        </div>
        {/* Billings Content */}
        {itemDetails?.billings?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {itemDetails.billings.map((billing) => (
              <div
                key={billing.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-purple-100 p-2 text-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-sm">{billing.bill_reference_number}</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        billing.status,
                      )} bg-white/20 border-white/30`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(billing.status)}
                        {billing.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-4">
                  {/* Date Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Bill Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(billing.bill_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(billing.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Order Info */}
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                    <div className="text-sm text-blue-700 font-medium mb-2">Purchase Order:</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-3 h-3 text-blue-600" />
                        <span className="text-gray-600">PO No:</span>
                        <span className="font-medium text-blue-600">
                          {billing.purchaseOrder.purchase_generate_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3 h-3 text-blue-600" />
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-medium text-gray-900">
                          {billing.purchaseOrder.supplier_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 text-blue-600" />
                        <span className="text-gray-600">PO Date:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(billing.purchaseOrder.po_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Billings Found</h3>
            <p className="text-gray-500">No billing records have been created yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const GrnDetails = ({ itemDetails, item, navigate, renderGrnBillInfo }) => {
  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Goods Receipt Notes (GRN)</h1>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate('/grn_form')}
                className="bg-blue-600 h-8 hover:bg-blue-700 text-white font-semibold px-2 rounded"
              >
                + GRN
              </button>
              <div className="text-right">
                <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
                <h3 className="text-xs text-gray-800">{itemDetails?.products?.item_name}</h3>
              </div>
            </div>
          </div>
        </div>

        {itemDetails?.grns?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {itemDetails.grns.map((grn) => (
              <div
                key={grn.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gray-200 p-2 text-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      <span className="font-semibold text-sm">{grn.grn.grn_generate_id}</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        grn.status,
                      )} bg-white/20 border-white/30`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(grn.status)}
                        {grn.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3 space-y-2">
                  {/* GRN Bill Information - NEW SECTION */}
                  {renderGrnBillInfo(grn.grn.po_id)}

                  {/* Date and Invoice Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">GRN Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(grn.grn.grn_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Invoice No:</span>
                      <span className="font-medium text-gray-900">{grn.grn.invoice_no}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Invoice Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(grn.grn.invoice_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Received By:</span>
                      <span className="font-medium text-gray-900">{grn.grn.received_by}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Delivery Note:</span>
                      <span className="font-medium text-gray-900">{grn.grn.delivery_note_no}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm text-gray-600 mb-1">Description:</div>
                    <div className="text-sm font-medium text-gray-900 leading-relaxed">
                      {grn.description}
                    </div>
                  </div>

                  {/* Quantity Details Grid */}
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-sm text-gray-600 mb-1">Quantity Details:</div>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div className="text-center bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-blue-600">
                          {grn.quantity_ordered}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">Ordered</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-orange-600">
                          {grn.quantity_received}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Received
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-1">Acceptance Details:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-green-600">
                          {grn.accepted_quantity}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Accepted
                        </div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-red-600">
                          {grn.rejected_quantity}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Rejected
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acceptance Rate */}
                  <div className="border-t pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Acceptance Rate:</span>
                      <span className="text-sm font-bold text-green-600">
                        {(
                          (parseFloat(grn.accepted_quantity) / parseFloat(grn.quantity_received)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (parseFloat(grn.accepted_quantity) /
                              parseFloat(grn.quantity_received)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer with timestamps */}
                  <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(grn.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>GRN: {formatDate(grn.grn.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No GRN Found</h3>
            <p className="text-gray-500">No goods receipt notes have been recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const PurchaseReturnsDetails = ({ itemDetails, item, navigate }) => {
  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Purchase Returns</h1>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate('/purchase-return/form')}
                className="bg-blue-600 h-8 hover:bg-blue-700 text-white font-semibold px-2 rounded"
              >
                + Purchase Returns
              </button>
              <div className="text-right">
                <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
                <h3 className="text-xs text-gray-800">{itemDetails?.products?.item_name}</h3>
              </div>
            </div>
          </div>
        </div>

        {itemDetails?.purchaseReturns?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {itemDetails.purchaseReturns.map((returnItem) => (
              <div
                key={returnItem.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-red-100 p-2 text-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-sm">
                        {returnItem.purchaseOrderReturnId.purchase_return_generate_id}
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                      Return
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-4">
                  {/* Date and Creator Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Return Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(returnItem.purchaseOrderReturnId.return_date)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600 mb-1">Created By:</div>
                        <div className="font-medium text-gray-900">
                          {returnItem.purchaseOrderReturnId.creator.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {returnItem.purchaseOrderReturnId.creator.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-orange-700 font-medium mb-1">Reason:</div>
                        <div className="text-sm text-orange-600 leading-relaxed">
                          {returnItem.purchaseOrderReturnId.reason || 'No reason provided'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return Quantity and Unit Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-red-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-red-600">{returnItem.return_qty}</div>
                      <div className="text-xs text-gray-600 uppercase tracking-wide">
                        Return Quantity
                      </div>
                    </div>
                    <div className="text-center bg-blue-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(returnItem.unit_price)}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wide">
                        Unit Price
                      </div>
                    </div>
                  </div>

                  {/* Tax Information */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-2">Tax Details:</div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{returnItem.cgst}%</div>
                        <div className="text-xs text-gray-500">CGST</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{returnItem.sgst}%</div>
                        <div className="text-xs text-gray-500">SGST</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(returnItem.tax_amount)}
                        </div>
                        <div className="text-xs text-gray-500">Tax Amount</div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Base Amount:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(returnItem.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Tax Amount:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(returnItem.tax_amount)}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaRupeeSign className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Total Return Amount:
                          </span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(returnItem.total_amount)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {returnItem.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-blue-700 font-medium mb-1">Notes:</div>
                          <div className="text-sm text-blue-600 leading-relaxed">
                            {returnItem.notes}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(returnItem.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Return: {formatDate(returnItem.purchaseOrderReturnId.return_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Returns Found</h3>
            <p className="text-gray-500">No purchase returns have been recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const StockAdjustmentDetails = ({ itemDetails, item, navigate }) => {
  return (
    <div className="min-h-screen  p-3">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center  justify-between mb-2">
            {/* Left section: Icon + Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Stock Adjustment</h1>
            </div>

            {/* Right section: ID and name */}
            <div className="text-right">
              <div className="flex items-center justify-between w-47">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      navigate('/stockadjustment/stock_form', {
                        state: {
                          item_id: itemDetails?.products?.id,
                        },
                      })
                    }
                    className="bg-blue-600 h-8 hover:bg-blue-700 text-white font-bold px-2 rounded"
                  >
                    + Stock Adjustment
                  </button>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
                  <h3 className="text-xs text-gray-800">{itemDetails.products.item_name}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {itemDetails?.stockAdjustments?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {itemDetails.stockAdjustments.map((adj) => (
              <div
                key={adj.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gray-100 p-2 text-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        {adj.adjustment.stock_adjustment_generate_id}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        adj.adjustment.status,
                      )} bg-white/20 border-white/30`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(adj.adjustment.status)}
                        {adj.adjustment.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2 space-y-3">
                  {/* Date and Type */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(adj.adjustment.adjustment_date)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        {getTypeIcon(adj.type)}
                        <span className="text-gray-600">
                          Type:{' '}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                              adj.type,
                            )}`}
                          >
                            {' '}
                            {adj.type}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Details */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm text-gray-600 mb-3">Quantity Details:</div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {adj.previous_quantity}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Previous
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {adj.adjustment_quantity}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Adjusted
                        </div>
                      </div>
                    </div>

                    {/* Difference */}
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getDifferenceColor(
                          adj.difference,
                        )}`}
                      >
                        {adj.difference > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : adj.difference < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Package className="w-4 h-4" />
                        )}
                        <span className="font-bold">
                          {adj.difference > 0 ? '+' : ''}
                          {adj.difference}
                        </span>
                        <span className="text-xs font-medium">Difference</span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  {adj.adjustment.remarks && (
                    <div className="bg-blue-50 rounded-lg p-2 border-l-4 border-blue-400">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-blue-700 font-medium mb-1">Remarks:</div>
                          <div className="text-sm text-blue-600 leading-relaxed">
                            {adj.adjustment.remarks}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(adj.adjustment.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Stock Adjustments Found</h3>
            <p className="text-gray-500">No inventory adjustments have been recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const DebitNotesDetails = ({ itemDetails, item }) => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-2   text-gray-800 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Debit Notes
        </h2>
        <div className="">
          <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
          <h3 className="text-xs text-gray-800">{itemDetails.products.item_name}</h3>
        </div>
      </div>
      {itemDetails?.debitNotes?.length > 0 ? (
        <></>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Debit Notes Found</h3>
          <p className="text-gray-500">Get started by creating your first purchase order.</p>
        </div>
      )}
    </>
  )
}

export const CreditNotesDetails = ({ itemDetails, item }) => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-2   text-gray-800 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-blue-600" />
          Credit Notes
        </h2>
        <div className="">
          <p className="text-xl font-bold m-0">{item?.item_info?.item_generate_id}</p>
          <h3 className="text-xs text-gray-800">{itemDetails.products.item_name}</h3>
        </div>
      </div>
      {itemDetails?.creditNotes?.length > 0 ? (
        <></>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Credit Notes Found</h3>
          <p className="text-gray-500">Get started by creating your first purchase order.</p>
        </div>
      )}
    </>
  )
}
