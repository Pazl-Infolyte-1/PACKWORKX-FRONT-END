  import React from 'react'
  import PopUp from '../../components/New/PopUp'
  import ActionButton from '../../components/New/ActionButton'
  // import apiMethods from '../../api/config'

  function WorkOrderDetails({ showPopUp, setShowPopUp, cell }) {
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
                  <h1 className="text-3xl font-bold text-gray-800">Work Order Details</h1>
                </div>
                
              </div>
            </header>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {/* Primary Information Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Order Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Work Order Name</span>
                    <span className="text-gray-800 mt-1">{cell.sku_name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Description</span>
                    <span className="text-gray-800 mt-1">{cell.description}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Manufacture</span>
                    <span className="text-gray-800 mt-1">{cell.manufacture}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">SKU Version</span>
                    <span className="text-gray-800 mt-1">{cell.sku_version}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Quantity</span>
                    <span className="text-gray-800 mt-1">{cell.qty}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Outsource name</span>
                    <span className="text-gray-800 mt-1">{cell.outsource_name}</span>
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
                    <span className="text-sm font-medium text-gray-500">EDD</span>
                    <span className="text-gray-800 mt-1">{apiMethods.formatDate(cell.edd)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Planned start date</span>
                    <span className="text-gray-800 mt-1">
                      {apiMethods.formatDate(cell.planned_start_date)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Planned end date</span>
                    <span className="text-gray-800 mt-1">
                      {apiMethods.formatDate(cell.planned_end_date)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Created at</span>
                    <span className="text-gray-800 mt-1">
                      {apiMethods.formatDate(cell.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Updated at</span>
                    <span className="text-gray-800 mt-1">
                      {apiMethods.formatDate(cell.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopUp>
    )
  }

  export default WorkOrderDetails
