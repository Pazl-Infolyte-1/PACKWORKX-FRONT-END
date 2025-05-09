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
  const location = useLocation()
  const { Id, isEdit } = location.state || {}
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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

  return (
    <div className="max-w-6xl mx-auto my-3">
      <div className="text-xl font-semibold mb-4">{isEdit ? 'Edit Machine' : 'Add Machine'}</div>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 p-6 rounded-lg shadow-sm gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Machine Name" isRequired={true} />
                {errors.machine_name && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.machine_name.message}
                  </span>
                )}
              </div>
              <input
                {...register('machine_name', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Machine Type" isRequired={true} />
                {errors.machine_type && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.machine_type.message}
                  </span>
                )}
              </div>
              <input
                {...register('machine_type', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Model Number" isRequired={true} />
                {errors.model_number && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.model_number.message}
                  </span>
                )}
              </div>
              <input
                {...register('model_number', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Serial Number" isRequired={true} />
                {errors.serial_number && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.serial_number.message}
                  </span>
                )}
              </div>
              <input
                {...register('serial_number', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Manufacturer" isRequired={true} />
                {errors.manufacturer && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.manufacturer.message}
                  </span>
                )}
              </div>
              <input
                {...register('manufacturer', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Location" isRequired={true} />
                {errors.location && (
                  <span className="text-red-500 text-xs text-start">{errors.location.message}</span>
                )}
              </div>
              <input
                {...register('location', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Power Rating" isRequired={true} />
                {errors.power_rating && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.power_rating.message}
                  </span>
                )}
              </div>
              <input
                {...register('power_rating', { required: 'required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="IP Address" />
                {errors.ip_address && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.ip_address.message}
                  </span>
                )}
              </div>
              <input
                {...register('ip_address')}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            {/* Status toggles centered vertically */}
            <div className='py-9'>
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
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Purchase Date" />
                {errors.purchase_date && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.purchase_date.message}
                  </span>
                )}
              </div>
              <input
                {...register('purchase_date')}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Installation Date"/>
                {errors.installation_date && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.installation_date.message}
                  </span>
                )}
              </div>
              <input
                {...register('installation_date')}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Last Maintenance"/>
                {errors.last_maintenance && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.last_maintenance.message}
                  </span>
                )}
              </div>
              <input
                {...register('last_maintenance')}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Next Maintenance Due"/>
                {errors.next_maintenance_due && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.next_maintenance_due.message}
                  </span>
                )}
              </div>
              <input
                {...register('next_maintenance_due')}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <RequiredFieldLabel label="Warranty Expiry"/>
                {errors.warranty_expiry && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.warranty_expiry.message}
                  </span>
                )}
              </div>
              <input
                {...register('warranty_expiry')}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>
          </div>
        </div>
        {/* Remarks - Full Width, moved outside the grid */}
        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-sm">
          <RequiredFieldLabel label="Notes & Remarks" isRequired={true} />
          <textarea
            {...register('remarks_notes', { required: 'required' })}
            rows="3"
            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mt-6">
          <ActionButton type="button" label="Cancel" variant="cancel" onClick={handleCancel} />
          <ActionButton
            type="submit"
            label={
              isEdit ? (isLoading ? 'Updating...' : 'Update') : isLoading ? 'Saving...' : 'Save'
            }
            variant="add"
          />
        </div>
      </form>
    </div>
  )
}

export default AddEditMachine
