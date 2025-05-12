import React, { useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import Loader from '../../components/New/Loader'

const GSTModal = ({
  isOpen,
  setIsGstModalOpen = () => {},
  onFetch,
  loading,
  gstNumber,
  setGstNumber,
  gstData,
  setValue
}) => {
  const [shouldValidate, setShouldValidate] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const handleGstNumberChange = (e) => {
    setGstNumber(e.target.value)
    setShouldValidate(false)
  }

  const handleBlur = () => {
    setIsTouched(true)
  }

  const handleFetchClick = () => {
    setShouldValidate(true)
    onFetch()
  }

  const handleClose = () => {
    setIsGstModalOpen(false);
    // If no GST data was fetched, set status back to false
    if (!gstData) {
      setValue('clientData.gst_status', 'false');
    }
  }

  // Basic GSTIN format validation (15 alphanumeric characters)
  const isValidFormat = gstNumber && /^[0-9A-Z]{15}$/.test(gstNumber)

  const showError = (shouldValidate || isTouched) && gstNumber && !isValidFormat
  const hasError = gstNumber && !gstData?.success && shouldValidate
  const hasData = gstData?.success && gstData?.gstDetails?.data

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-[50%]">
          <Loader isLoading={loading} />

          {/* Modal header */}
          <div className="bg-white px-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Prefill Customer Details From the GST Portal
              </h3>
              {/* <button
                onClick={() => setIsGstModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button> */}
            </div>
          </div>

          {/* Modal body */}
          <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-red-500">GSTIN/UIN*</label>

              {/* Format validation error (while typing) */}
              {showError && (
                <div className="bg-red-100 text-red-500 rounded p-2 mb-2 flex items-center">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                    !
                  </span>
                  GSTIN should be 15 alphanumeric characters
                  <span className="ml-auto cursor-pointer" onClick={() => setGstNumber('')}>
                    &times;
                  </span>
                </div>
              )}

              {/* API error (after fetch attempt) */}
              {hasError && (
                <div className="bg-red-100 text-red-500 rounded p-2 mb-2 flex items-center">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                    !
                  </span>
                  {gstData?.message || 'Invalid GSTIN/UIN - Please check the number'}
                  <span className="ml-auto cursor-pointer" onClick={() => setGstNumber('')}>
                    &times;
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={gstNumber}
                  onChange={handleGstNumberChange}
                  onBlur={handleBlur}
                  placeholder="Enter 15-digit GST Number"
                  className="border p-2 text-sm rounded flex-1"
                  maxLength={15}
                />
                <ActionButton
                  height="10"
                  label="Fetch"
                  onClick={handleFetchClick}
                  className="text-sm"
                  disabled={!isValidFormat}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Format: 15 alphanumeric characters (e.g., 22AAAAA0000A1Z5)
              </div>
            </div>

            {/* Rest of the modal content remains the same */}
            {hasData && (
              <div>
                <div className="font-medium">Business Details</div>

                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3">
                  <div>
                    <div className="text-gray-500 text-sm">Company Name</div>
                    <div className="flex items-center">
                      <div className="bg-purple-500 rounded-full w-6 h-6 mr-2"></div>
                      <div className="text-sm">
                        {gstData?.gstDetails?.data?.lgnm || 'Not available'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">GSTIN/UIN status</div>
                    <div className="flex items-center">
                      <div className="bg-pink-500 rounded-full w-6 h-6 mr-2"></div>
                      <div className="text-sm">
                        {gstData?.gstDetails?.data?.sts || 'Not available'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 my-2">
                  <div>
                    <div className="text-gray-500 text-sm">Taxpayer Type</div>
                    <div className="text-xs">
                      {gstData?.gstDetails?.data?.dty || 'Not available'}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Business Trade Name</div>
                    <div className="text-xs">
                      {gstData?.gstDetails?.data?.tradeNam ||
                        gstData?.gstDetails?.data?.lgnm ||
                        'Not available'}
                    </div>
                  </div>
                </div>

                {gstData?.gstDetails?.data?.pradr && (
                  <div className="mb-1 w-full">
                    <div className="text-gray-500 text-sm">Available Addresses</div>
                    <div>
                      <div className="flex items-start bg-blue-50 p-2 rounded-lg">
                        <input type="radio" className="mt-1 mr-2" name="address" checked readOnly />
                        <div>
                          <div className="font-small">
                            {gstData?.gstDetails?.data?.nba?.join(', ') ||
                              'No business activities listed'}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {gstData?.gstDetails?.data?.pradr?.addr?.bnm && (
                              <>
                                {gstData.gstDetails.data.pradr.addr.bnm}
                                <br />
                              </>
                            )}
                            {gstData?.gstDetails?.data?.pradr?.addr?.loc && (
                              <>
                                {gstData.gstDetails.data.pradr.addr.loc}
                                <br />
                              </>
                            )}
                            {gstData?.gstDetails?.data?.pradr?.addr?.stcd && (
                              <>
                                {gstData.gstDetails.data.pradr.addr.stcd}
                                <br />
                              </>
                            )}
                            {gstData?.gstDetails?.data?.pradr?.addr?.pncd || 'No PIN code'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {gstData?.gstDetails?.data?.rgdt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Registration Date: {new Date(gstData.gstDetails.data.rgdt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* {hasData && ( */}
            <div className="bg-gray-50 px-4 py-1 sm:px-6 sm:flex sm:flex-row-reverse">
              <div className="flex space-x-2">
                <button
                  className="bg-white border border-gray-300 px-4 py-2 rounded text-sm"
                  onClick={handleClose} 
                >
                  Cancel
                </button>
              </div>
            </div>
          {/* )} */}
        </div>
      </div>
    </div>
  )
}

export default GSTModal
