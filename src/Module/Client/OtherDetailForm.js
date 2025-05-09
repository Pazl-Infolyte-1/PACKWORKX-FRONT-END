import { useFormContext } from 'react-hook-form'
import apiMethods from '../../api/config'
import { useState } from 'react'

const OtherDetailForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext()

  const [showMore, setShowMore] = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiMethods.uploadFile(formData)
      const fileUrl = response?.data?.data?.file_url

      if (fileUrl) {
        setValue('clientData.documents', [fileUrl])
      }
    } catch (err) {
      console.error('File upload failed', err)
    }
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
                {...register('clientData.PAN', { required: 'Required' })}
                style={{
                  border: errors.clientData?.PAN ? '1px solid #EF4444' : '1px solid #D1D5DB',
                }}
                className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
              />
            </div>
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
              type="text"
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
            <label className="text-xs w-32">ID Proof</label>
            <input
              type="file"
              className="w-64 border border-gray-300 p-1.5 rounded text-sm"
              accept="application/pdf"
              onChange={handleFileUpload}
            />
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
                <label className="text-xs w-32">Skype Name/Number</label>
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
