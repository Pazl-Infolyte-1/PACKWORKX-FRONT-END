import React from 'react'
import {
  Package,
  Tag,
  DollarSign,
  TrendingUp,
  Factory,
  Layers,
  FileText,
  Settings,
} from 'lucide-react'
import { capitalize } from 'lodash'

const ItemDetails = ({ item, customFields = {} }) => {
  const InfoCard = ({ title, icon: Icon, children, className = '' }) => (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-center mb-2">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-md mr-2">
          <Icon className="w-3 h-3 text-white" />
        </div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      </div>
      {children}
    </div>
  )

  const InfoRow = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className={`text-xs font-semibold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>
        {value || 'N/A'}
      </span>
    </div>
  )

  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'active'
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
        }`}
      ></div>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  )

  if (!item) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 max-h-[400px] overflow-y-scroll custom-scrollbar">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-1.5 rounded-lg mr-3">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 m-0">
                  {item.item_name || 'Unnamed Item'}
                </h1>
                <h1 className="text-sm font-bold text-gray-900">
                  {item.item_generate_id || 'Unnamed Item'}
                </h1>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-3">
          {/* Row 1: Basic Information and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Basic Information */}
            <InfoCard title="Basic Information" icon={FileText}>
              <div className="space-y-0.5">
                <InfoRow label="Generated ID" value={item.item_generate_id} />
                <InfoRow label="Unit of Measure" value={item.uom} highlight />
                <InfoRow label="HSN Code" value={item.hsn_code} />
              </div>
            </InfoCard>

            {/* Description */}
            {item.description ? (
              <InfoCard title="Description" icon={FileText}>
                <p className="text-xs text-gray-700 leading-relaxed">{item.description}</p>
              </InfoCard>
            ) : (
              <InfoCard title="Description" icon={FileText}>
                <div className="text-center py-4">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No description available</p>
                </div>
              </InfoCard>
            )}
          </div>

          {/* Custom Fields - Full Width */}
          <InfoCard title="Custom Fields" icon={Settings}>
            {Object.entries(customFields).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {Object.entries(customFields).map(([key, value], idx) => (
                  <InfoRow key={idx} label={capitalize(key)} value={value} />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Settings className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No custom fields available</p>
              </div>
            )}
          </InfoCard>

          {/* Row 2: Manufacturing Information and Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Manufacturing Information */}
            <InfoCard title="Manufacturing Information" icon={Factory}>
              <div className="space-y-0.5">
                <InfoRow label="Manufacturer" value={item.manufacturer} highlight />
                {item.specifications && (
                  <div className="pt-2 border-t border-gray-50">
                    <span className="text-xs font-medium text-gray-600 block mb-1">
                      Specifications
                    </span>
                    <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md">
                      {item.specifications}
                    </p>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Financial Information */}
            <InfoCard title="Financial Information" icon={DollarSign}>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                  <div className="text-xs text-green-600 font-medium mb-0.5">Standard Cost</div>
                  <div className="text-lg font-bold text-green-700">
                    ₹{item.standard_cost || '0'}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <InfoRow label="CGST" value={item.cgst ? `${item.cgst}%` : 'N/A'} />
                  <InfoRow label="SGST" value={item.sgst ? `${item.sgst}%` : 'N/A'} />
                  <InfoRow
                    label="Total GST"
                    value={
                      item.cgst && item.sgst
                        ? `${parseInt(item.cgst) + parseInt(item.sgst)}%`
                        : 'N/A'
                    }
                    highlight
                  />
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Row 3: Category Information and Stock Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Category Information */}
            <InfoCard title="Category Information" icon={Layers}>
              <div className="space-y-0.5">
                <InfoRow label="Category" value={item.category_info.category_name} />
                <InfoRow label="Sub Category" value={item.sub_category_info.sub_category_name} />
              </div>
            </InfoCard>

            {/* Stock Information */}
            <InfoCard title="Stock Information" icon={TrendingUp}>
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg border border-orange-100">
                  <div className="text-xs text-orange-600 font-medium mb-0.5">Min Stock Level</div>
                  <div className="text-base font-bold text-orange-700">
                    {item.min_stock_level || '0'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-100">
                  <div className="text-xs text-yellow-600 font-medium mb-0.5">Reorder Level</div>
                  <div className="text-base font-bold text-yellow-700">
                    {item.reorder_level || '0'}
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails
