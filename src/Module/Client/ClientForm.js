import React, { useEffect, useRef, useState } from 'react'
import Phone from '../../assets/images/phone.png'
import Cell from '../../assets/images/mob.png'
import OtherDetailForm from './OtherDetailForm'
import AddressForm from './AddressForm'
import ContactPersonsForm from './ContactPersonsForm'
import GSTModal from './GSTComponent'
import { FormProvider, useForm } from 'react-hook-form'
import apiMethods from '../../api/config'
import CustomAlert from '../../components/New/CustomAlert'
import ActionButton from '../../components/New/ActionButton'
import Loader from '../../components/New/Loader'
import { CRow, CCol, CNav, CNavItem, CNavLink } from '@coreui/react'
import { useFieldArray } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const ClientForm = ({ resetForm, setReloadData }) => {
  const [activeTab, setActiveTab] = useState('Other Details')
  const [alerts, setAlerts] = useState([])
  const [gstNumber, setGstNumber] = useState('')
  const [gstData, setGstData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isGstModalOpen, setIsGstModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const originalDataRef = useRef(null)
  const [changesCount, setChangesCount] = useState(0)
  const tabs = ['Other Details', 'Address']
  const navigate = useNavigate()
  const location = useLocation()
  const entityType = location.state?.entityType
  const client = location.state?.client
  useEffect(() => {
    if (client) {
      setEditData(client)
    }
  }, [client])
  const handleClose = () => {
    setAlerts([])
  }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: editData || {
      clientData: {
        customer_type: '',
        client_ref_id: '',
        entity_type: entityType,
        gst_number: '',
        gst_status: false,
        salutation: '',
        first_name: '',
        last_name: '',
        display_name: '',
        company_name: '',
        email: '',
        work_phone: '',
        mobile: '',
        PAN: '',
        currency: '',
        payment_terms: '',
        portal_language: '',
        documents: [],
        website_url: '',
        department: '',
        designation: '',
        opening_balance: 0,
        twitter: '',
        skype: '',
        facebook: '',
      },
      addresses: [
        {
          type: 'Billing',
          attention: '',
          country: '',
          street1: '',
          street2: '',
          city: '',
          state: null,
          pinCode: '',
          phone: '',
        },
        {
          type: 'Shipping',
          attention: '',
          country: '',
          street1: '',
          street2: '',
          city: '',
          state: null,
          pinCode: '',
          phone: '',
        },
      ],
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid, errors, isSubmitted },
    control,
    setValue,
  } = methods

  useEffect(() => {
    methods.setValue('clientData.entity_type', entityType)
    reset({
      ...methods.getValues(),
      clientData: {
        ...methods.getValues().clientData,
        entity_type: entityType,
      },
    })
  }, [entityType])

  useEffect(() => {
    if (editData) {
      const initialFormValues = {
        clientData: {
          customer_type: editData.customer_type || '',
          gst_number: editData.gst_number || '',
          gst_status: editData.gst_status ? 'true' : 'false',
          entity_type: editData.entity_type || '',
          salutation: editData.salutation || '',
          first_name: editData.first_name || '',
          last_name: editData.last_name || '',
          display_name: editData.display_name || '',
          company_name: editData.company_name || '',
          email: editData.email || '',
          work_phone: editData.work_phone || '',
          mobile: editData.mobile || '',
          PAN: editData.PAN || '',
          currency: editData.currency || '',
          payment_terms: editData.payment_terms || '',
          portal_language: editData.portal_language || '',
          documents:
            typeof editData?.documents === 'string'
              ? JSON.parse(editData.documents || '[]')
              : editData?.documents || [],
          website_url: editData.website_url || '',
          department: editData.department || '',
          designation: editData.designation || '',
          opening_balance: editData.opening_balance || '',
          twitter: editData.twitter || '',
          skype: editData.skype || '',
          facebook: editData.facebook || '',
          client_ref_id: editData.client_ref_id || '',
          company_id: editData.company_id || '',
        },
        addresses: editData?.addresses?.map((addr, index) => ({
          type: index === 0 ? 'Billing' : 'Shipping',
          attention: addr.attention || '',
          country: addr.country || '',
          street1: addr.street1 || '',
          street2: addr.street2 || '',
          city: addr.city || '',
          state: addr.state || null,
          pinCode: addr.pinCode || '',
          phone: addr.phone || '',
        })),
      }

      reset(initialFormValues)
      originalDataRef.current = initialFormValues
    }
  }, [editData, reset])
  const watchedValues = watch()
  useEffect(() => {
    if (!originalDataRef.current) return

    const changes = []

    // Compare clientData
    for (const key in watchedValues.clientData) {
      const current = watchedValues.clientData[key]
      const original = originalDataRef.current.clientData[key]

      const isArray = Array.isArray(current) && Array.isArray(original)
      const isEqual = isArray
        ? JSON.stringify(current) === JSON.stringify(original)
        : current === original

      if (!isEqual) {
        changes.push({
          field: `clientData.${key}`,
          oldValue: original,
          newValue: current,
        })
      }
    }

    // Compare addresses
    watchedValues.addresses?.forEach((addr, index) => {
      const originalAddr = originalDataRef.current.addresses?.[index] || {}
      for (const key in addr) {
        if (addr[key] !== originalAddr[key]) {
          changes.push({
            field: `addresses[${index}].${key}`,
            oldValue: originalAddr[key],
            newValue: addr[key],
          })
        }
      }
    })
    setChangesCount(changes.length)
  }, [watchedValues])
  const gstStatus = watch('clientData.gst_status')

  useEffect(() => {
    if (resetForm) {
      reset()
    }
  }, [resetForm, reset])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  })

  const [expandedIndices, setExpandedIndices] = useState({})

  const addShippingAddress = () => {
    append({
      type: 'Shipping',
      attention: '',
      country: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      pinCode: '',
      phone: '',
    })
    setExpandedIndices((prev) => ({ ...prev, [fields.length]: false }))
  }

  const toggleExpand = (index) => {
    setExpandedIndices((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const handleGstStatusChange = (e) => {
    setValue('clientData.gst_status', e.target.value)
    if (e.target.value === 'true') {
      setIsGstModalOpen(true)
    }
  }

  const closeGstModal = () => {
    setIsGstModalOpen(false)
    // If no GST data was fetched, set status back to false
    if (!gstData) {
      setValue('clientData.gst_status', 'false')
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await apiMethods.getGst(gstNumber)
      setGstData(response)

      const tradeName = response?.gstDetails?.data?.tradeNam || ''
      const legalName = response?.gstDetails?.data?.lgnm || ''
      const addressData = response?.gstDetails?.data?.pradr?.addr || {}

      const stateCode = addressData.stcd || ''
      let stateName = stateCode

      const stateMapping = {
        TN: 'Tamil Nadu',
        AP: 'Andhra Pradesh',
        KL: 'Kerala',
      }

      if (stateMapping[stateCode]) {
        stateName = stateMapping[stateCode]
      }

      setValue('clientData.company_name', tradeName || legalName)
      setValue('clientData.gst_number', gstNumber)

      setValue('addresses.0.attention', legalName)
      setValue('addresses.0.country', 'India')
      setValue(
        'addresses.0.street1',
        addressData.bno ? `${addressData.bno}, ${addressData.bnm || ''}` : addressData.bnm || '',
      )
      setValue('addresses.0.street2', addressData.st || '')
      setValue('addresses.0.city', addressData.dst || addressData.loc || '')
      setValue('addresses.0.state', stateName)
      setValue('addresses.0.pinCode', addressData.pncd || '')

      const alerts = [
        { severity: 'success', message: response?.message || 'GST details fetched successfully' },
      ]
      if (response?.gstDetails?.flag === false && response?.gstDetails?.message) {
        alerts.push({ severity: 'warning', message: response.gstDetails.message })
      }
      setAlerts(alerts)
    } catch (error) {
      console.error('Error fetching client data:', error)
      setAlerts([
        {
          severity: 'error',
          message: error.response?.data?.message || 'Failed to fetch GST details',
        },
      ])
      setTimeout(() => {
        setAlerts([])
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Check for form errors first
      const formErrors = Object.keys(errors)
      if (formErrors.length > 0) {
        setAlerts([
          { severity: 'error', message: 'Please fix all validation errors before submitting' },
        ])
        return
      }

      const filteredData = {
        ...data,
        addresses: data.addresses.map(({ type, ...rest }) => rest),
      }

      // Address validation
      const addressErrors = []
      filteredData.addresses.forEach((address, index) => {
        const requiredFields = ['attention', 'city', 'phone', 'pinCode', 'state']
        const hasEmptyFields = requiredFields.some((field) => {
          const value = address[field]
          // Handle different field types
          if (field === 'state') {
            return value === null || value === undefined
          }
          return !value || (typeof value === 'string' && value.trim() === '')
        })

        if (hasEmptyFields) {
          addressErrors.push(
            `Please fill all required fields in ${index === 0 ? 'Billing' : 'Shipping'} Address`,
          )
        }

        // Validate phone number format if provided
        if (address.phone && !/^\d{10}$/.test(address.phone.toString())) {
          addressErrors.push(
            `Phone number must be 10 digits in ${index === 0 ? 'Billing' : 'Shipping'} Address`,
          )
        }
      })

      if (addressErrors.length > 0) {
        setAlerts(addressErrors.map((message) => ({ severity: 'error', message })))
        setLoading(false)
        return
      }

      // PAN validation
      if (data.clientData.PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.clientData.PAN)) {
        setAlerts([{ severity: 'error', message: 'Invalid PAN format' }])
        return
      }

      let response
      let successMessage

      if (editData) {
        const clientId = editData.client_id
        const filteredData1 = {
          ...data,
          addresses: data.addresses.map(({ type, ...rest }, index) => ({
            ...rest,
            id: editData.addresses?.[index]?.id,
          })),
        }

        response = await apiMethods.editClient(clientId, filteredData1)
        successMessage = 'Client Edited successfully!'
        if (response.status === 200 || response.status === 201) {
          setReloadData((prev) => !prev)
        }
      } else {
        response = await apiMethods.postClient(filteredData)
        if (response.status === 200 || response.status === 201) {
          setReloadData((prev) => !prev)
        }
        successMessage = 'Client added successfully!'
      }

      setAlerts([{ severity: 'success', message: response?.message }])

      if (editData) {
        setTimeout(() => {
          setAlerts([])
          reset()
          navigate('/clients')
        }, 3000)
      }
      setTimeout(() => {
        setAlerts([])
        reset()
        navigate('/clients')
      }, 3000)
    } catch (error) {
      console.error('Error processing client:', error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || 'An unknown error occurred.'
      setAlerts([{ severity: 'error', message: errorMessage }])
      setTimeout(() => {
        setAlerts([])
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    navigate('/clients')
  }

  // Helper function to apply red border style
  const getInputStyle = (hasError) => ({
    border: hasError && isSubmitted ? '1px solid #EF4444' : '1px solid #D1D5DB',
  })
  const checkValdation = () => {
    console.log('Client data:', methods.getValues('clientData'))
    console.log('Form validation errors:', methods.formState.errors)
  }

  return (
    <>
      <Loader isLoading={loading} />
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className="w-full relative">
        <GSTModal
          isOpen={isGstModalOpen}
          setIsGstModalOpen={setIsGstModalOpen}
          onFetch={handleSearch}
          loading={loading}
          gstNumber={gstNumber}
          setGstNumber={setGstNumber}
          gstData={gstData}
          setValue={setValue}
        />
      </div>
      <FormProvider {...methods}>
        <div className="pr-2 pl-2 relative border-b border-gray-200 bg-white">
          <h5 className="px-4 capitalize">
            {editData ? `Edit ${editData.entity_type}` : `Add ${entityType}`}
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto">
            <div className=" px-4">
              {/* Reference ID */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm  w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Reference Id
                  </label>
                  <input
                    type="text"
                    placeholder="Reference Id"
                    {...register('clientData.client_ref_id', { required: true })}
                    style={getInputStyle(errors.clientData?.client_ref_id)}
                    className="p-1.5 text-sm rounded flex-1"
                  />
                </div>
              </div>

              {/* Customer Type */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm  w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Customer Type
                  </label>
                  <div className="flex items-center space-x-4 h-8">
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        {...register('clientData.customer_type', { required: 'Required' })}
                        value="Business"
                      />
                      <span>Business</span>
                    </label>
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        {...register('clientData.customer_type', { required: 'Required' })}
                        value="Individual"
                      />
                      <span>Individual</span>
                    </label>

                    {errors.clientData?.customer_type && (
                      <span className="text-red-500 text-xs">
                        {errors.clientData.customer_type.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm  w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Full Name
                  </label>
                  <div className="flex gap-2">
                    <select
                      {...register('clientData.salutation', { required: true })}
                      style={getInputStyle(errors.clientData?.salutation)}
                      className="p-1.5 text-sm rounded w-28"
                    >
                      <option value="" disabled>
                        Salutation
                      </option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                    <input
                      type="text"
                      placeholder="First Name"
                      {...register('clientData.first_name', { required: true })}
                      style={getInputStyle(errors.clientData?.first_name)}
                      className="p-1.5 text-sm rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      {...register('clientData.last_name', { required: true })}
                      style={getInputStyle(errors.clientData?.last_name)}
                      className="p-1.5 text-sm rounded w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm  w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    {...register('clientData.company_name', { required: true })}
                    style={getInputStyle(errors.clientData?.company_name)}
                    className="p-1.5 text-sm rounded flex-1"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm  w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter display name"
                    {...register('clientData.display_name', {
                      required: 'Please fill the display name',
                    })}
                    style={getInputStyle(errors.clientData?.display_name)}
                    className="p-1.5 text-sm rounded flex-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm  w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Email
                  </label>
                  <input
                    disabled={editData}
                    type="text"
                    placeholder="Email Address"
                    {...register('clientData.email', {
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    style={getInputStyle(errors.clientData?.email)}
                    className="p-1.5 text-sm rounded flex-1"
                  />
                </div>
                {errors.clientData?.email && (
                  <p className="text-red-500 text-xs ml-32">{errors.clientData.email.message}</p>
                )}
              </div>

              {/* Phone Numbers */}
              <div className="mb-2">
                <div className="flex items-center">
                  <label className="text-sm w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    Phone
                  </label>
                  <div>
                    <div className="flex gap-5">
                      {/* Work Phone Input */}
                      <div
                        className="flex items-center p-1.5 rounded w-1/2"
                        style={getInputStyle(errors.clientData?.work_phone)}
                      >
                        <img src={Phone} alt="Work Phone" className="mr-1 h-4 w-4" />
                        <input
                          type="tel"
                          placeholder="Work"
                          maxLength={10}
                          {...register('clientData.work_phone', {
                            required: true,
                            pattern: {
                              value: /^\d{10}$/,
                              message: 'Invalid phone number',
                            },
                          })}
                          onKeyDown={(e) => {
                            if (
                              !(
                                /[0-9]/.test(e.key) ||
                                ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
                                  e.key,
                                ) ||
                                e.ctrlKey ||
                                e.metaKey // Allow Ctrl/Cmd + key (e.g., Ctrl+V)
                              )
                            ) {
                              e.preventDefault()
                            }
                          }}
                          onPaste={(e) => {
                            const pasteData = e.clipboardData.getData('text')
                            if (!/^\d*$/.test(pasteData)) {
                              e.preventDefault()
                            }
                          }}
                          className="outline-none w-full text-sm bg-transparent"
                        />
                      </div>

                      {/* Mobile Input */}
                      <div
                        className="flex items-center p-1.5 rounded w-1/2"
                        style={getInputStyle(errors.clientData?.mobile)}
                      >
                        <img src={Cell} alt="Mobile" className="mr-1 h-4 w-4" />
                        <input
                          type="tel"
                          placeholder="Mobile"
                          maxLength={10}
                          {...register('clientData.mobile', {
                            // required: true,
                            pattern: {
                              value: /^\d{10}$/,
                              message: 'Invalid phone number',
                            },
                          })}
                          onKeyDown={(e) => {
                            if (
                              !(
                                /[0-9]/.test(e.key) ||
                                ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
                                  e.key,
                                ) ||
                                e.ctrlKey ||
                                e.metaKey // Allow Ctrl/Cmd + key (e.g., Ctrl+V)
                              )
                            ) {
                              e.preventDefault()
                            }
                          }}
                          onPaste={(e) => {
                            const pasteData = e.clipboardData.getData('text')
                            if (!/^\d*$/.test(pasteData)) {
                              e.preventDefault()
                            }
                          }}
                          className="outline-none w-full text-sm bg-transparent"
                        />
                      </div>

                      
                    </div>
                    {(errors.clientData?.work_phone || errors.clientData?.mobile) && (
                      <p className="text-red-500 text-xs">
                        {errors.clientData?.work_phone?.message ||
                          errors.clientData?.mobile?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* GST Status */}
              <div className="flex items-start space-x-8 mb-4">
                <div className="mb-2">
                  <div className="flex items-center">
                    <label className="text-sm w-32 after:content-['*'] after:text-red-500 after:ml-1">
                      Do you have GST?
                    </label>
                    <div className="flex items-center space-x-4 h-8">
                      <label className="flex items-center space-x-1 text-sm">
                        <input
                          type="radio"
                          {...register('clientData.gst_status', { required: 'Required' })}
                          value="true"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setIsGstModalOpen(true)
                            }
                          }}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-1 text-sm">
                        <input
                          type="radio"
                          {...register('clientData.gst_status', { required: 'Required' })}
                          value="false"
                        />
                        <span>No</span>
                      </label>
                      {errors.clientData?.gst_status && (
                        <span className="text-red-500 text-xs">
                          {errors.clientData.gst_status.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {gstStatus === 'true' && (
                  <div className="mb-4 h-10">
                    {/*<label className="text-sm w-32 after:content-['*'] after:text-red-500 after:ml-1">
                    GST Number
                  </label>*/}
                    <input
                      type="text"
                      placeholder="Enter GST Number"
                      {...register('clientData.gst_number', {
                        required: gstStatus === 'true' ? 'GST number is required' : false,
                      })}
                      className="border p-1 rounded w-[295px]"
                      readOnly={!!gstData} // Make read-only only after data is fetched
                    />
                    {errors.clientData?.gst_number && (
                      <div className="flex">
                        <div className="w-40" /> {/* empty space to align with label */}
                        <p className="text-red-500 text-xs">
                          ⊛ {errors.clientData.gst_number.message}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <CCol xs={12}>
            <div className="d-flex align-items-center">
              <CNav variant="tabs" className="mb-2 flex-grow-1">
                {tabs.map((tab) => (
                  <CNavItem key={tab}>
                    <CNavLink
                      active={activeTab === tab}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveTab(tab)
                      }}
                      style={{
                        backgroundColor: activeTab === tab ? '#8761e5' : 'transparent',
                        color: activeTab === tab ? '#ffffff' : '#8761e5',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {tab}
                    </CNavLink>
                  </CNavItem>
                ))}
              </CNav>

              {/* Add button positioned on the same line as tabs */}
              {activeTab === 'Address' && (
                <div style={{ marginBottom: '8px' }}>
                  <ActionButton
                    label="+ Add"
                    onClick={addShippingAddress}
                    variant="minimal"
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Content for active tab would go here */}
          </CCol>
          <CRow className="mb-5">
            {activeTab === 'Other Details' && <OtherDetailForm />}
            {activeTab === 'Address' && (
              <AddressForm
                fields={fields}
                remove={remove}
                expandedIndices={expandedIndices}
                toggleExpand={toggleExpand}
              />
            )}
          </CRow>
          {activeTab === 'contactPersons' && <ContactPersonsForm></ContactPersonsForm>}
          {activeTab === 'remarks' && (
            <div>
              <h3>Remarks</h3>
              <p>Enter remarks about the customer here...</p>
            </div>
          )}
        </div>
      </FormProvider>

      <div className="flex justify-between items-center w-full pt-2 bottom-0 bg-white fixed border-t-2 border-gray-100">
        <div className="text-left my-1">
          <button
            className="p-1.5 rounded w-20 mr-3 text-white bg-purple-600 hover:bg-purple-700 text-sm disabled:bg-gray-400"
            disabled={!!editData && changesCount === 0}
            onClick={() => {
              checkValdation()
              handleSubmit(onSubmit)()
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button
            className="p-1.5 border border-gray-300 rounded w-20 text-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default ClientForm
