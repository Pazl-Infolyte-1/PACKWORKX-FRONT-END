import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'
import Select from 'react-select'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

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
  // New fields for process assignment
  processValues: {},
  selectedProcesses: [],
  machine_process: [],
}

function AddEditMachine({}) {
  const [isLoading, setIsLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [processes, setProcesses] = useState([])
  const [processFieldsMap, setProcessFieldsMap] = useState({})
  const [completedProcesses, setCompletedProcesses] = useState([])
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
    control,
  } = useForm({
    defaultValues,
  })

  // Fetch all processes when component mounts
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await apiMethods.getProcess({ limit: 20000 })
        setProcesses(response.data.data)
      } catch (error) {
        console.error('Error fetching processes:', error)
      }
    }
    fetchProcesses()
  }, [])

  // Fetch machine data when in edit mode
  useEffect(() => {
    if (!isEdit) {
      reset(defaultValues)
    }

    if (isEdit && Id) {
      const fetchData = async () => {
        try {
          const response = await apiMethods.getMachineById(Id)
          reset(response.data.data)

          // If editing, fetch all assigned processes and their values
          const assignedResponse = await apiMethods.getByMachineId(Id)
          if (assignedResponse.data.data.length > 0) {
            const selectedProcesses = assignedResponse.data.data.map((process) => ({
              value: process.process_id,
              label: process.process_name,
            }))

            setValue('selectedProcesses', selectedProcesses)

            // Fetch process fields and values for all assigned processes
            await Promise.all(
              selectedProcesses.map(async (process) => {
                await fetchProcessFieldsAndValues(process.value)
              }),
            )
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [isEdit, reset])

  // Fetch process fields and values when process is selected
  const fetchProcessFieldsAndValues = async (processId) => {
    try {
      // Fetch fields for the process
      const fieldsResponse = await apiMethods.getProcessFields(processId)
      const fields = fieldsResponse.data.data || []

      // Store fields in the map
      setProcessFieldsMap((prev) => ({
        ...prev,
        [processId]: fields,
      }))

      // Fetch existing values if any
      const valuesResponse = await apiMethods.getProcessValues()
      const processValues = valuesResponse.data.data.find((p) => p.process_name_id === processId)

      const currentProcessValues = watch('processValues') || {}

      if (processValues) {
        setValue('processValues', {
          ...currentProcessValues,
          [processId]: processValues.process_value || {},
        })
      } else {
        // Initialize empty values for each field
        const initialValues = {}
        fields.forEach((field) => {
          initialValues[field.label] = ''
        })
        setValue('processValues', {
          ...currentProcessValues,
          [processId]: initialValues,
        })
      }
    } catch (error) {
      console.error('Error fetching process fields/values:', error)
      setAlerts([{ severity: 'error', message: 'Failed to fetch process data' }])
    }
  }

  const handleProcessChange = (selectedOptions) => {
    const selectedProcesses = selectedOptions || []
    setValue('selectedProcesses', selectedProcesses)

    // Fetch fields for newly selected processes
    selectedProcesses.forEach((option) => {
      if (!processFieldsMap[option.value]) {
        fetchProcessFieldsAndValues(option.value)
      }
    })

    // Clean up process values for removed processes
    const currentProcessValues = watch('processValues') || {}
    const newProcessValues = {}
    selectedProcesses.forEach((process) => {
      if (currentProcessValues[process.value]) {
        newProcessValues[process.value] = currentProcessValues[process.value]
      }
    })
    setValue('processValues', newProcessValues)
  }

  const handleValueChange = (processId, fieldName, value) => {
    const currentValues = watch('processValues') || {}
    setValue('processValues', {
      ...currentValues,
      [processId]: {
        ...currentValues[processId],
        [fieldName]: value,
      },
    })
  }

  // Check if a process has all required values filled
  const isProcessComplete = (processId) => {
    const processValues = watch(`processValues.${processId}`) || {}
    const fields = processFieldsMap[processId] || []

    if (fields.length === 0) return false

    return fields.every((field) => {
      const value = processValues[field.label]
      return value && value.toString().trim() !== ''
    })
  }

  // Move completed process to the top
  const moveToCompleted = (processId) => {
    const selectedProcesses = watch('selectedProcesses') || []
    const processToMove = selectedProcesses.find((p) => p.value === processId)

    if (processToMove && isProcessComplete(processId)) {
      // Remove from selected processes
      const updatedSelected = selectedProcesses.filter((p) => p.value !== processId)
      setValue('selectedProcesses', updatedSelected)

      // Add to completed processes if not already there
      if (!completedProcesses.find((p) => p.value === processId)) {
        setCompletedProcesses((prev) => [...prev, processToMove])
      }
    }
  }

  // Remove from completed processes
  const removeFromCompleted = (processId) => {
    setCompletedProcesses((prev) => prev.filter((p) => p.value !== processId))

    // Clear values for this process
    const currentValues = watch('processValues') || {}
    const newValues = { ...currentValues }
    delete newValues[processId]
    setValue('processValues', newValues)
  }

  // Edit completed process
  const editCompletedProcess = (processId) => {
    const processToEdit = completedProcesses.find((p) => p.value === processId)
    if (processToEdit) {
      // Move back to selected processes
      const currentSelected = watch('selectedProcesses') || []
      setValue('selectedProcesses', [...currentSelected, processToEdit])

      // Remove from completed
      setCompletedProcesses((prev) => prev.filter((p) => p.value !== processId))
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitted(true)
    try {
      setIsLoading(true)

      // Prepare the machine data
      const machineData = { ...data }
      delete machineData.selectedProcesses
      delete machineData.processValues

      // Combine selected processes and completed processes
      const allProcesses = [...(data.selectedProcesses || []), ...completedProcesses]

      // Add machine_process array with all processes
      if (allProcesses.length > 0) {
        machineData.machine_process = allProcesses.map((process) => ({
          process_id: process.value,
          process_name: process.label,
          process_values: data.processValues[process.value] || {},
        }))
      } else {
        machineData.machine_process = []
      }

      const apiCall = isEdit
        ? apiMethods.editMachine(Id, machineData)
        : apiMethods.AddMachine(machineData)

      const response = await apiCall
      setAlerts([{ severity: 'success', message: response.data.message }])
      setTimeout(() => {
        navigate('/machinedashboard')
        reset(defaultValues)
      }, 1000)
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

  const processOptions = processes
    .filter(
      (process) =>
        // Filter out processes that are already completed
        !completedProcesses.find((completed) => completed.value === process.id),
    )
    .map((process) => ({
      value: process.id,
      label: process.process_name,
    }))

  return (
    <div className="mx-auto mt-3 relative flex flex-col">
      <div className="text-xl font-semibold p-2 fixed bg-white w-full -my-4">
        {isEdit ? 'Edit Machine' : 'Add Machine'}
      </div>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 rounded-lg gap-6">
            {/* Column 1 - Machine Details */}
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

            {/* Column 2 - Machine Status */}
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

            {/* Column 3 - Dates */}
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

          {/* Remarks */}
          <div className="w-full px-4 rounded-lg">
            <RequiredFieldLabel label="Notes & Remarks" />
            <textarea
              {...register('remarks_notes')}
              rows="3"
              className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={getInputStyle('remarks_notes')}
            ></textarea>
          </div>

          {/* Completed Processes Cards */}
          {completedProcesses.length > 0 && (
            <div className="px-4 mb-6">
              <h3 className="text-base font-medium text-green-600">Configured Processes</h3>
              <div className="space-y-4">
                {completedProcesses.map((process) => {
                  const processValues = watch(`processValues.${process.value}`) || {}
                  const fields = processFieldsMap[process.value] || []

                  return (
                    <div
                      key={process.value}
                      className="border border-green-200 rounded-lg p-2 px-4 "
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-green-800">{process.label}</h4>
                        <div className="flex gap-2">
                          <CIcon
                            icon={cilPencil}
                            onClick={() => editCompletedProcess(process.value)}
                            className="!text-blue-600 hover:text-blue-800"
                          />
                          <CIcon
                            icon={cilTrash}
                            onClick={() => removeFromCompleted(process.value)}
                            className="!text-red-600 hover:text-red-800"
                          />

                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {fields.map((field) => (
                          <div key={field.id} className="bg-white p-2 rounded border">
                            <div className="text-xs font-medium text-gray-600 mb-1">
                              {field.label.replace(/_/g, ' ')}
                            </div>
                            <div className="text-sm text-gray-800">
                              {processValues[field.label] || 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Process Assignment */}
          <div className="px-4 rounded-lg mb-5 w-1/3">
            <RequiredFieldLabel label="Assign Process" />
            <Select
              options={processOptions}
              value={watch('selectedProcesses')}
              onChange={handleProcessChange}
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              isMulti
              placeholder="Select processes..."
              closeMenuOnSelect={false}
            />
          </div>

          {/* Process Values Section - Only for currently selected processes */}
          {watch('selectedProcesses')?.length > 0 && (
            <div className="w-full px-4 rounded-lg mb-5 border-t pt-4 z-[9999]">
              {watch('selectedProcesses').map((process) => {
                const fields = processFieldsMap[process.value] || []
                const processValues = watch(`processValues.${process.value}`) || {}

                return (
                  <div
                    key={process.value}
                    className="border mb-3 border-gray-200 rounded-lg p-2 px-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">{process.label}</h4>
                      {fields.length > 0 && (
                        <button
                          type="button"
                          onClick={() => moveToCompleted(process.value)}
                          disabled={!isProcessComplete(process.value)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            isProcessComplete(process.value)
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isProcessComplete(process.value) ? 'Add' : 'Fill all fields'}
                        </button>
                      )}
                    </div>

                    {fields.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 ">
                        {fields.map((field) => (
                          <div key={`${process.value}-${field.id}`} className="space-y-1">
                            <label className="text-sm capitalize text-gray-600">
                              {field.label.replace(/_/g, ' ')}
                            </label>
                            <input
                              type="text"
                              value={processValues[field.label] || ''}
                              onChange={(e) =>
                                handleValueChange(process.value, field.label, e.target.value)
                              }
                              className="w-full p-1 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              style={getInputStyle('machine_process')}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No fields available for this process</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
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
