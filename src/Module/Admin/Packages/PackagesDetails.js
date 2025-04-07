import React from 'react'
import PopUp from '../../../components/New/PopUp'
import ActionButton from '../../../components/New/ActionButton'

function PackagesDetails({ showPopUp, cell, setShowPopUp, onEdit }) {
  return (
    <PopUp
      visible={showPopUp === cell.id}
      showCloseButton={true}
      setVisible={() => setShowPopUp(null)}
      height={'95vh'}
      width={'70vw'}
    >
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Package Details</h1>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cell.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {cell.status}
                </span>
                <ActionButton
                  label={'Edit'}
                  variant="edit"
                  height={8}
                  width={24}
                  onClick={() => onEdit(cell)}
                />
              </div>
            </div>
          </header>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {/* Primary Information Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Package Name</span>
                  <span className="text-gray-800 mt-1">{cell.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Description</span>
                  <span className="text-gray-800 mt-1">{cell.description}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Storage Unit</span>
                  <span className="text-gray-800 mt-1">{cell.storage_unit}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Max Employees</span>
                  <span className="text-gray-800 mt-1">{cell.max_employees}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Monthly Plan</span>
                  <span className="text-gray-800 mt-1">{cell.stripe_monthly_plan_id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Annual Plan</span>
                  <span className="text-gray-800 mt-1">{cell.stripe_annual_plan_id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Created at</span>
                  <span className="text-gray-800 mt-1">{cell.created_at}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Updated at</span>
                  <span className="text-gray-800 mt-1">{cell.updated_at}</span>
                </div>
              </div>
            </div>
          </div>

          {/* secondary Information Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Secondary Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Storage Size</span>
                  <span className="text-gray-800 mt-1">{cell.max_storage_size}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">File Size</span>
                  <span className="text-gray-800 mt-1">{cell.max_file_size}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Sort</span>
                  <span className="text-gray-800 mt-1">{cell.sort}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Annual Price</span>
                  <span className="text-gray-800 mt-1">{cell.annual_price}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Monthly Price</span>
                  <span className="text-gray-800 mt-1">{cell.monthly_price}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Billing Cycle</span>
                  <span className="text-gray-800 mt-1">{cell.billing_cycle}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Private</span>
                  <span className="text-gray-800 mt-1">{cell.is_private ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Storage Unit</span>
                  <span className="text-gray-800 mt-1">{cell.storage_unit}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Auto Renew</span>
                  <span className="text-gray-800 mt-1">{cell.is_auto_renew ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Recommended</span>
                  <span className="text-gray-800 mt-1">{cell.is_recommended ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Free</span>
                  <span className="text-gray-800 mt-1">{cell.is_free ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Monthly Status</span>
                  <span className="text-gray-800 mt-1">{cell.monthly_status ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Annual Status</span>
                  <span className="text-gray-800 mt-1">{cell.annual_status ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Package Module</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cell.module_in_package.map((module, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">{module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  )
}

export default PackagesDetails
