import React from 'react'
import PopUp from '../../components/New/PopUp'
import ActionButton from '../../components/New/ActionButton'

function SkuDetails({ showPopUp, cell, editTag, setShowPopUp, handleSkuEdit }) {
  return (
    <PopUp
      visible={showPopUp === cell.id && !editTag}
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
                <h1 className="text-3xl font-bold text-gray-800">SKU Details</h1>
                <p className="text-gray-500 mt-1">#{cell.internal_id}</p>
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
                  onClick={() => handleSkuEdit(cell.id)}
                />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Primary Information Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">SKU Name</span>
                    <span className="text-gray-800 mt-1">{cell.sku_name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Client</span>
                    <span className="text-gray-800 mt-1">{cell.client}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">SKU Type</span>
                    <span className="text-gray-800 mt-1">{cell.sku_type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Customer Reference</span>
                    <span className="text-gray-800 mt-1">{cell.customer_reference}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Reference Number</span>
                    <span className="text-gray-800 mt-1">{cell.reference_number}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Internal ID</span>
                    <span className="text-gray-800 mt-1">{cell.internal_id}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Created By</span>
                    <span className="flex items-center mt-1">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 mr-2">
                        {cell.sku_creator?.name?.charAt(0) || '?'}
                      </span>
                      {cell.sku_creator?.name}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <span className="text-gray-800 mt-1">{cell.last_updated || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Dimensions & Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Length</span>
                    <span className="text-gray-800 mt-1">{cell.length}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Width</span>
                    <span className="text-gray-800 mt-1">{cell.width}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Height</span>
                    <span className="text-gray-800 mt-1">{cell.height}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Flap Width</span>
                    <span className="text-gray-800 mt-1">{cell.flap_width}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Joints</span>
                    <span className="text-gray-800 mt-1">{cell.joints}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">UPS</span>
                    <span className="text-gray-800 mt-1">{cell.ups}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Ply</span>
                    <span className="text-gray-800 mt-1">{cell.ply}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Inner/Outer Dimension</span>
                    <span className="text-gray-800 mt-1">{cell.inner_outer_dimension}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Board Size (cm²)</span>
                    <span className="text-gray-800 mt-1">{cell.board_size_cm2}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Deckle Size</span>
                    <span className="text-gray-800 mt-1">{cell.deckle_size}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Minimum Order Level</span>
                    <span className="text-gray-800 mt-1">{cell.minimum_order_level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tolerances Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Tolerances & Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Flap Tolerance</span>
                    <span className="text-gray-800 mt-1">{cell.flap_tolerance}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      Length Trimming Tolerance
                    </span>
                    <span className="text-gray-800 mt-1">{cell.length_trimming_tolerance}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      Width Trimming Tolerance
                    </span>
                    <span className="text-gray-800 mt-1">{cell.width_trimming_tolerance}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Strict Adherence</span>
                    <span className="flex items-center mt-1">
                      {cell.strict_adherence ? (
                        <span className="inline-flex items-center text-green-800">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-800">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          No
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Materials & Specifications
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Color
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cell.sku_values?.map((value, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {value.material}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: value.color }}
                              ></div>
                              {value.color}
                            </div>
                          </td>
                        </tr>
                      ))}
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

export default SkuDetails
