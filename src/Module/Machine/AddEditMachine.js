import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'

const RequiredFieldLabel = ({ label, isRequired }) => (
  <label className="text-sm font-medium text-gray-600 mr-2">
    {label}
    {isRequired && <span className="text-red-500">*</span>}
  </label>
)

const defaultValues = {
  machine_name: '',
  machine_type: '',
  model_number: '',
  serial_number: '',
  manufacturer: '',
  purchase_date: null,
  installation_date: null,
  machine_status: true,
  location: '',
  last_maintenance: null,
  next_maintenance_due: null,
  assigned_operator: '',
  power_rating: '',
  connectivity_status: true,
  ip_address: '',
  warranty_expiry: null,
  remarks_notes: '',
}

function AddEditMachine({}) {
  const [isLoading, setIsLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false) // Track if form was submitted
  const location = useLocation()
  const { Id, isEdit } = location.state || {}
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
  })

  useEffect(() => {
    if (!isEdit) {
      reset(defaultValues)
    }

    if (isEdit && Id) {
      const fetchData = async () => {
        try {
          const response = await apiMethods.getMachineById(Id)
          reset(response.data.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [isEdit, reset])

  // Reset form when drawer closes
  useEffect(() => {
    reset(defaultValues)
  }, [reset])

  const onSubmit = async (data) => {
    setIsSubmitted(true) // Set submitted to true when form is submitted
    try {
      setIsLoading(true)
      const apiCall = isEdit ? apiMethods.editMachine(Id, data) : apiMethods.AddMachine(data)
      const response = await apiCall

      if (response.status === 200 || response.status === 201) {
        reset(defaultValues)
        setAlerts([
          {
            severity: 'success',
            message: response.data.message,
          },
        ])
        navigate('/machinedashboard')
      }
    } catch (error) {
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Something went wrong' },
      ])
      console.error('Submit Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset(defaultValues)
    navigate('/machinedashboard')
  }

  const machineStatus = watch('machine_status')
  const toggleMachineStatus = () => {
    setValue('machine_status', !machineStatus)
  }

  const getInputStyle = (fieldName) => {
    const hasError = errors[fieldName] || (isSubmitted && !watch(fieldName))
    return {
      border: hasError ? '1px solid #EF4444' : '1px solid #D1D5DB',
    }
  }

  return (
    <div className="mx-auto mt-3 relative flex flex-col">
      <div className="text-xl font-semibold p-2 fixed bg-white w-full -my-4">{isEdit ? 'Edit Machine' : 'Add Machine'}</div>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />

      {/* Form container with scroll */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 rounded-lg gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <RequiredFieldLabel label="Machine Name" isRequired={true} />
                <input
                  {...register('machine_name', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('machine_name')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Machine Type" isRequired={true} />
                <input
                  {...register('machine_type', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('machine_type')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Model Number" isRequired={true} />
                <input
                  {...register('model_number', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('model_number')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Serial Number" isRequired={true} />
                <input
                  {...register('serial_number', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('serial_number')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Manufacturer" isRequired={true} />
                <input
                  {...register('manufacturer', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('manufacturer')}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <RequiredFieldLabel label="Location" isRequired={true} />
                <input
                  {...register('location', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('location')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Power Rating" isRequired={true} />
                <input
                  {...register('power_rating', { required: 'required' })}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('power_rating')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="IP Address" />
                <input
                  {...register('ip_address')}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  style={getInputStyle('ip_address')}
                />
              </div>

              {/* Status toggles centered vertically */}
              <div className="py-9">
                <div className="flex items-center space-x-2">
                  <RequiredFieldLabel label="Connectivity Status" isRequired={true} />
                  <input
                    {...register('connectivity_status')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    id="connectivity"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RequiredFieldLabel label="Machine Status" isRequired={true} />
                <div
                  onClick={toggleMachineStatus}
                  className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${machineStatus ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <input type="checkbox" className="sr-only" {...register('machine_status')} />
                  <span
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${machineStatus ? 'transform translate-x-6' : ''}`}
                  ></span>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <RequiredFieldLabel label="Purchase Date" />
                <input
                  {...register('purchase_date')}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="date"
                  style={getInputStyle('purchase_date')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Installation Date" />
                <input
                  {...register('installation_date')}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="date"
                  style={getInputStyle('installation_date')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Last Maintenance" />
                <input
                  {...register('last_maintenance')}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="date"
                  style={getInputStyle('last_maintenance')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Next Maintenance Due" />
                <input
                  {...register('next_maintenance_due')}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="date"
                  style={getInputStyle('next_maintenance_due')}
                />
              </div>

              <div>
                <RequiredFieldLabel label="Warranty Expiry" />
                <input
                  {...register('warranty_expiry')}
                  className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="date"
                  style={getInputStyle('warranty_expiry')}
                />
              </div>
            </div>
          </div>
          {/* Remarks - Full Width, moved outside the grid */}
          <div className="w-full px-4 rounded-lg mb-5">
            <RequiredFieldLabel label="Notes & Remarks"  />
            <textarea
              {...register('remarks_notes')}
              rows="3"
              className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={getInputStyle('remarks_notes')}
            ></textarea>
          </div>
        </form>
      </div>

      {/* Fixed action buttons at the bottom */}
      <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-end gap-3">
        <ActionButton type="button" label="Cancel" variant="cancel" onClick={handleCancel} />
        <ActionButton
          type="submit"
          label={isEdit ? (isLoading ? 'Updating...' : 'Update') : isLoading ? 'Saving...' : 'Save'}
          variant="add"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  )
}

export default AddEditMachine