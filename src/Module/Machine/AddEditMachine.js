import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'

function AddEditMachine({
  setdrawopen,
  isOpen,
  isEdit,
  setIsEdit,
  setRefresh,
  isLoading,
  setIsLoading,
}) {
  useEffect(() => {
    if (!isOpen.id) return
    const fetchData = async () => {
      try {
        const response = await apiMethods.getMachineById(isOpen.id)
        reset(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [isOpen])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      machine_name: '',
      machine_type: '',
      model_number: '',
      serial_number: '',
      manufacturer: '',
      purchase_date: '',
      installation_date: '',
      machine_status: true,
      location: '',
      last_maintenance: '',
      next_maintenance_due: '',
      assigned_operator: '',
      power_rating: '',
      connectivity_status: true,
      ip_address: '',
      warranty_expiry: '',
      remarks_notes: '',
    },
  })

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen.show) {
      reset()
    }
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const apiCall = isEdit ? apiMethods.editMachine(isOpen.id, data) : apiMethods.AddMachine(data)

      const response = await apiCall

      if (response.status === 200 || response.status === 201) {
        reset()
        setdrawopen({ show: false, id: null })
        setRefresh((prev) => !prev)
        setIsEdit(false)
      }
    } catch (error) {
      console.error('Submit Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setdrawopen({ show: false })
  }

  const machineStatus = watch('machine_status')
  const toggleMachineStatus = () => {
    setValue('machine_status', !machineStatus)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-xl font-semibold mb-4">{isEdit ? 'Edit Machine' : 'Add Machine'}</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 p-6 rounded-lg shadow-sm gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Machine Name</label>
                {errors.machine_name && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.machine_name.message}
                  </span>
                )}
              </div>
              <input
                {...register('machine_name', { required: 'Machine name is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Machine Type</label>
                {errors.machine_type && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.machine_type.message}
                  </span>
                )}
              </div>
              <input
                {...register('machine_type', { required: 'Machine type is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Model Number</label>
                {errors.model_number && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.model_number.message}
                  </span>
                )}
              </div>
              <input
                {...register('model_number', { required: 'Model number is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Serial Number</label>
                {errors.serial_number && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.serial_number.message}
                  </span>
                )}
              </div>
              <input
                {...register('serial_number', { required: 'Serial number is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Manufacturer</label>
                {errors.manufacturer && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.manufacturer.message}
                  </span>
                )}
              </div>
              <input
                {...register('manufacturer', { required: 'Manufacturer is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Location</label>
                {errors.location && (
                  <span className="text-red-500 text-xs text-start">{errors.location.message}</span>
                )}
              </div>
              <input
                {...register('location', { required: 'Location is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Power Rating</label>
                {errors.power_rating && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.power_rating.message}
                  </span>
                )}
              </div>
              <input
                {...register('power_rating', { required: 'Power rating is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">IP Address</label>
                {errors.ip_address && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.ip_address.message}
                  </span>
                )}
              </div>
              <input
                {...register('ip_address', { required: 'IP address is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>

            {/* Status toggles centered vertically */}
            <div className="flex items-center justify-between pt-8 pb-2.5">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-600 mr-2">
                  Connectivity Status
                </label>
                <input
                  {...register('connectivity_status')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  id="connectivity"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Machine Status</label>
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

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Assigned Operator</label>
                {errors.assigned_operator && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.assigned_operator.message}
                  </span>
                )}
              </div>
              <input
                {...register('assigned_operator', { required: 'Assigned operator is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="text"
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Purchase Date</label>
                {errors.purchase_date && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.purchase_date.message}
                  </span>
                )}
              </div>
              <input
                {...register('purchase_date', { required: 'Purchase date is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Installation Date</label>
                {errors.installation_date && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.installation_date.message}
                  </span>
                )}
              </div>
              <input
                {...register('installation_date', { required: 'Installation date is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Last Maintenance</label>
                {errors.last_maintenance && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.last_maintenance.message}
                  </span>
                )}
              </div>
              <input
                {...register('last_maintenance', { required: 'Last maintenance date is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">
                  Next Maintenance Due
                </label>
                {errors.next_maintenance_due && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.next_maintenance_due.message}
                  </span>
                )}
              </div>
              <input
                {...register('next_maintenance_due', {
                  required: 'Next maintenance date is required',
                })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1 mr-2">
                <label className="text-sm font-medium text-gray-600 mr-2">Warranty Expiry</label>
                {errors.warranty_expiry && (
                  <span className="text-red-500 text-xs text-start">
                    {errors.warranty_expiry.message}
                  </span>
                )}
              </div>
              <input
                {...register('warranty_expiry', { required: 'Warranty expiry date is required' })}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="date"
              />
            </div>
          </div>
        </div>
        {/* Remarks - Full Width, moved outside the grid */}
        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-600 mb-1">Notes & Remarks</label>
          <textarea
            {...register('remarks_notes')}
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
