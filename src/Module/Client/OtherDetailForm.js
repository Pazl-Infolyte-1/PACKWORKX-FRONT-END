import { useFormContext } from 'react-hook-form'
import apiMethods from '../../api/config'
import { useState } from 'react'

const OtherDetailForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const [showMore, setShowMore] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const uploadedFiles = watch('clientData.documents') || []
  const [fileNames, setFileNames] = useState([])
  const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)

    // Get current URLs
    const currentDocs = watch('clientData.documents')
    const urls = Array.isArray(currentDocs) ? [...currentDocs] : []

    // Keep track of file names for display
    const names = [...fileNames]

    // Process each selected file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await apiMethods.uploadFile(formData)
        const fileUrl = response?.data?.data?.file_url

        if (fileUrl) {
          // Store only the URL in form data
          urls.push(fileUrl)

          // Store name for display purposes
          names.push(file.name)
        }
      } catch (err) {
        console.error('File upload failed:', err)
      }
    }

    // Update form with URLs only
    setValue('clientData.documents', urls)
    setFileNames(names)

    setIsUploading(false)
    event.target.value = ''
  }
  // Add this function to handle file removal
  const removeFile = (indexToRemove) => {
    // Remove URL from form data
    const urls = Array.isArray(watch('clientData.documents'))
      ? [...watch('clientData.documents')]
      : []

    const updatedUrls = urls.filter((_, index) => index !== indexToRemove)
    setValue('clientData.documents', updatedUrls)

    // Remove from display names
    const updatedNames = fileNames.filter((_, index) => index !== indexToRemove)
    setFileNames(updatedNames)
  }

  return (
    <div className="bg-white px-4 py-2 w-full">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-3">
          {/* PAN */}
          <div className="mb-2">
            <div className="flex items-center">
              <label className="text-xs w-32 flex items-center after:content-['*'] after:text-red-500 after:ml-1">
                PAN
              </label>
              <input
                type="text"
                {...register('clientData.PAN', {
                  required: true,
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: 'Invalid PAN format',
                  },
                })}
                style={{
                  border: errors.clientData?.PAN ? '1px solid #EF4444' : '1px solid #D1D5DB',
                }}
                className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                onChange={(e) => {
                  // Auto-uppercase PAN input
                  const value = e.target.value.toUpperCase()
                  setValue('clientData.PAN', value)
                }}
              />
            </div>
            {errors.clientData?.PAN && (
              <div className="ml-32 mt-1">
                <p className="text-red-500 text-xs">{errors.clientData.PAN.message}</p>
              </div>
            )}
          </div>

          {/* Currency */}
          <div className="flex items-center mb-3">
            <label className="text-xs w-32">Currency</label>
            <select
              {...register('clientData.currency')}
              className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
            >
              <option value="" disabled>
                Select Currency
              </option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>

          {/* Opening Balance */}
          <div className="flex items-center mb-3">
            <label className="text-xs w-32">Opening Balance</label>
            <input
              type="number"
              placeholder="INR"
              {...register('clientData.opening_balance')}
              className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Payment Terms */}
          <div className="flex items-center mb-3">
            <label className="text-xs w-32">Payment Terms</label>
            <select
              {...register('clientData.payment_terms')}
              className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
            >
              <option value="" disabled>
                Select Payment Terms
              </option>
              <option value="due_on_receipt">Due On Receipt</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          {/* Portal Language */}
          <div className="flex items-center mb-3">
            <label className="text-xs w-32">Portal Language</label>
            <select
              defaultValue="English"
              {...register('clientData.portal_language')}
              className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
            >
              <option value="" disabled>
                Select Language
              </option>
              <option value="English" id="lang-en">
                English
              </option>
              <option value="French" id="lang-fr">
                French
              </option>
              <option value="Spanish" id="lang-es">
                Spanish
              </option>
              <option value="German" id="lang-de">
                German
              </option>
              <option value="Chinese" id="lang-zh">
                Chinese
              </option>
            </select>
          </div>

          {/* Documents */}
          <div className="flex items-center mb-3">
            <label className="text-xs w-32">Documents</label>
            <div className="flex flex-col w-full">
              <input
                type="file"
                className="w-64 border border-gray-300 p-1.5 rounded text-sm ml-6"
                accept="application/pdf"
                onChange={handleFileUpload}
                multiple
              />

              {isUploading && <div className="text-sm text-blue-600 mt-1">Uploading files...</div>}

              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Uploaded files:</p>
                  <ul className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center text-sm w-[300px]">
                        <div className="flex-1 truncate">
                          {file.name ||
                            (typeof file === 'string'
                              ? file.split('/').pop()
                              : file.url.split('/').pop())}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          {/* You can use an X icon from your icon library */}
                          <span>✕</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {!showMore && (
            <p
              onClick={() => setShowMore(true)}
              className="text-blue-500 text-xs font-semibold cursor-pointer"
            >
              Add More Details
            </p>
          )}

          {showMore && (
            <>
              {/* Website */}
              <div className="flex items-center">
                <label className="text-xs w-32">Website URL</label>
                <input
                  type="text"
                  placeholder="ex: www.example.com"
                  {...register('clientData.website_url')}
                  className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Department */}
              <div className="flex items-center mb-3">
                <label className="text-xs w-32">Department</label>
                <input
                  {...register('clientData.department')}
                  type="text"
                  className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Designation */}
              <div className="flex items-center mb-3">
                <label className="text-xs w-32">Designation</label>
                <input
                  {...register('clientData.designation')}
                  type="text"
                  className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Twitter */}
              <div className="flex items-center mb-3">
                <label className="text-xs w-32">Twitter</label>
                <input
                  {...register('clientData.twitter')}
                  type="text"
                  className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Skype */}
              <div className="flex items-center mb-3">
                <label className="text-xs w-32">Advance Payment</label>
                <input
                  {...register('clientData.skype')}
                  type="text"
                  className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Facebook */}
              <div className="flex items-center">
                <label className="text-xs w-32">Facebook</label>
                <input
                  {...register('clientData.facebook')}
                  type="text"
                  className="border border-gray-300 p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                />
              </div>

              {showMore && (
                <p
                  onClick={() => setShowMore(false)}
                  className="text-blue-500 text-xs font-semibold cursor-pointer"
                >
                  Show Less
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OtherDetailForm
