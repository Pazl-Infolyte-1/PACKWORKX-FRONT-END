import { useFormContext } from 'react-hook-form'
import { IoTrash } from 'react-icons/io5'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FiCopy } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import get from 'lodash/get'

const AddressForm = ({ fields, remove, expandedIndices, toggleExpand }) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext()

  const [stateOptions, setStateOptions] = useState([])
  
  // Watch all address values to handle state display properly
  const addresses = watch('addresses')

  // Set default country value for all addresses on initial load
  useEffect(() => {
    fields.forEach((field, index) => {
      setValue(`addresses.${index}.country`, 'India')
    })
  }, [fields, setValue])

  // Function to copy billing address details to shipping address
  const copyBillingToShipping = () => {
    const billingAddress = getValues('addresses.0')
    setValue('addresses.1.attention', billingAddress.attention)
    setValue('addresses.1.country', billingAddress.country)
    setValue('addresses.1.street1', billingAddress.street1)
    setValue('addresses.1.street2', billingAddress.street2)
    setValue('addresses.1.city', billingAddress.city)
    setValue('addresses.1.state', billingAddress.state)
    setValue('addresses.1.pinCode', billingAddress.pinCode)
    setValue('addresses.1.phone', billingAddress.phone)
  }

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await apiMethods.getState()
        setStateOptions(response.data.data)
      } catch (error) {
        console.error('Error fetching states:', error)
      }
    }
    fetchStates()
  }, [])

  return (
    <div className="ml-4 w-full m-2">
      <div className="grid grid-cols-2 gap-3 bg-white rounded-lg w-full">
        {fields.map((address, index) => {
          const isExpanded = index <= 1 || expandedIndices[index]
          const isFirstShippingAddress = index === 1
          const currentStateId = addresses?.[index]?.state

          return (
            <div
              key={address.id}
              className={`bg-white shadow-md p-4 px-4 rounded-lg transition-all duration-300 ${
                isExpanded ? 'p-2' : 'p-1 h-10 flex items-center'
              }`}
            >
              {/* Header with title and actions */}
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium text-gray-700">{address.type} Address</h3>

                  {isFirstShippingAddress && (
                    <button
                      type="button"
                      onClick={copyBillingToShipping}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                    >
                      <FiCopy size={12} /> Copy billing address
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {index > 1 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(index)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      aria-label="Toggle Expand"
                    >
                      {isExpanded ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                    </button>
                  )}
                  {index > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label="Remove Address"
                    >
                      <IoTrash size={16} />
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-1">
                  {/* Attention Field */}
                  <div className="flex items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2">Name</label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.attention`, { required: 'Required' })}
                      style={{
                        border: get(errors, `addresses.${index}.attention`)
                          ? '1px solid #EF4444'
                          : '1px solid #D1D5DB',
                      }}
                      className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                    />
                  </div>

                  {/* Country/Region */}
                  <div className="flex items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2">
                      Country/Region
                    </label>
                    <select
                      {...register(`addresses.${index}.country`, { required: 'Required' })}
                      style={{
                        border: get(errors, `addresses.${index}.country`)
                          ? '1px solid #EF4444'
                          : '1px solid #D1D5DB',
                      }}
                      className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                      defaultValue="India"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>

                  {/* Address - Street 1 */}
                  <div className="flex items-start mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2 pt-1">
                      Address
                    </label>
                    <textarea
                      {...register(`addresses.${index}.street1`)}
                      className="w-64 border border-gray-300 p-1 rounded text-sm h-10"
                      placeholder="Street 1"
                    />
                  </div>

                  {/* Street 2 - Without Label */}
                  <div className="flex items-center mb-2">
                    <div className="w-24 mr-2"></div>
                    <textarea
                      {...register(`addresses.${index}.street2`)}
                      className="w-64 border border-gray-300 p-1 rounded text-sm h-10"
                      placeholder="Street 2"
                    />
                  </div>

                  {/* City */}
                  <div className="flex items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2">City</label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.city`, { required: 'Required' })}
                      style={{
                        border: get(errors, `addresses.${index}.city`)
                          ? '1px solid #EF4444'
                          : '1px solid #D1D5DB',
                      }}
                      className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                    />
                  </div>

                  {/* State */}
                  <div className="flex items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2">State</label>
                    <select
                      {...register(`addresses.${index}.state`, {
                        required: 'Required',
                        setValueAs: (val) => (val === '' ? null : Number(val)),
                      })}
                      style={{
                        border: get(errors, `addresses.${index}.state`)
                          ? '1px solid #EF4444'
                          : '1px solid #D1D5DB',
                      }}
                      className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                      value={currentStateId || ''}
                    >
                      <option value="">Select State</option>
                      {stateOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.states}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pin Code */}
                  <div className="flex items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2">Pin Code</label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.pinCode`, { required: 'Required' })}
                      style={{
                        border: get(errors, `addresses.${index}.pinCode`)
                          ? '1px solid #EF4444'
                          : '1px solid #D1D5DB',
                      }}
                      className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex items-center mb-2">
                    <label className="text-xs font-medium text-gray-600 w-24 mr-2">Phone</label>
                    <div className="w-64 flex flex-col">
                      <input
                        type="tel"
                        onKeyDown={(e) => {
                          if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        maxLength={10}
                        {...register(`addresses.${index}.phone`, {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^\d{10}$/,
                            message: 'Phone number must be exactly 10 digits',
                          },
                        })}
                        style={{
                          border: get(errors, `addresses.${index}.phone`)
                            ? '1px solid #EF4444'
                            : '1px solid #D1D5DB',
                        }}
                        className="p-1.5 rounded w-64 focus:ring-1 focus:ring-indigo-400 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AddressForm