import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomAlert from '../../components/New/CustomAlert'
import Select from 'react-select'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilArrowBottom, cilArrowTop } from '@coreui/icons'
import { GripVertical } from 'lucide-react'

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
  // Process assignment fields
  processValues: {},
  selectedProcesses: [],
  machine_process: [],
  // Process route fields
  machine_route: [],
}

function AddEditMachine({}) {
  const [isLoading, setIsLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [processes, setProcesses] = useState([])
  const [processFieldsMap, setProcessFieldsMap] = useState({})
  const [draggingItem, setDraggingItem] = useState(null)
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

  // Get available processes for route (selected processes not already in route)
  const getAvailableRouteProcesses = () => {
    const selected = watch('selectedProcesses') || []
    const route = watch('machine_route') || []

    // Get unique processes from selected that aren't in the route
    const uniqueProcesses = selected.reduce((acc, process) => {
      if (!route.includes(process.value)) {
        acc.push(process)
      }
      return acc
    }, [])

    return uniqueProcesses
  }

  // Drag and drop handlers
const handleDragStart = (e, process, source) => {
  setDraggingItem({ process, source });
  e.dataTransfer.setData('text/plain', process.id);
  e.dataTransfer.effectAllowed = 'move';
};

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

 const handleDrop = (e, target) => {
  e.preventDefault();
  if (!draggingItem) return;

  if (target === 'route' && draggingItem.source === 'available') {
    // Add to route
    const currentRoute = watch('machine_route') || [];
    if (!currentRoute.includes(draggingItem.process.value)) {
      setValue('machine_route', [...currentRoute, draggingItem.process.value]);
    }
  } else if (target === 'available' && draggingItem.source === 'route') {
    // Remove from route
    const currentRoute = watch('machine_route') || [];
    setValue(
      'machine_route',
      currentRoute.filter((id) => id !== draggingItem.process.value),
    );
  }
  setDraggingItem(null);
};

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

  // Fetch process fields and values
  const fetchProcessFieldsAndValues = async (processId) => {
    try {
      const fieldsResponse = await apiMethods.getProcessFields(processId)
      const fields = fieldsResponse.data.data || []

      setProcessFieldsMap((prev) => ({
        ...prev,
        [processId]: fields,
      }))

      const valuesResponse = await apiMethods.getProcessValues()
      const processValues = valuesResponse.data.data.find((p) => p.process_name_id === processId)

      const currentProcessValues = watch('processValues') || {}

      if (processValues) {
        setValue('processValues', {
          ...currentProcessValues,
          [processId]: processValues.process_value || {},
        })
      } else {
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

  // Handle process selection change
  const handleProcessChange = (selectedOptions) => {
    const selectedProcesses = selectedOptions || []
    setValue('selectedProcesses', selectedProcesses)

    selectedProcesses.forEach((option) => {
      if (!processFieldsMap[option.value]) {
        fetchProcessFieldsAndValues(option.value)
      }
    })

    const currentProcessValues = watch('processValues') || {}
    const newProcessValues = {}
    selectedProcesses.forEach((process) => {
      if (currentProcessValues[process.value]) {
        newProcessValues[process.value] = currentProcessValues[process.value]
      }
    })
    setValue('processValues', newProcessValues)
  }

  // Handle value change for process fields
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

  // Fetch machine data when in edit mode
  useEffect(() => {
    if (!isEdit) {
      reset(defaultValues)
    }

    if (isEdit && Id) {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          const response = await apiMethods.getMachineById(Id)
          const machineData = response.data.data

          // Set basic machine data
          const formattedData = {
            ...machineData,
            machine_status: machineData.machine_status === 'Active',
            purchase_date: machineData.purchase_date
              ? machineData.purchase_date.split('T')[0]
              : null,
            installation_date: machineData.installation_date
              ? machineData.installation_date.split('T')[0]
              : null,
            last_maintenance: machineData.last_maintenance
              ? machineData.last_maintenance.split('T')[0]
              : null,
            next_maintenance_due: machineData.next_maintenance_due
              ? machineData.next_maintenance_due.split('T')[0]
              : null,
            warranty_expiry: machineData.warranty_expiry
              ? machineData.warranty_expiry.split('T')[0]
              : null,
          }
          reset(formattedData)

          // Handle machine_process
          if (machineData.machine_process && machineData.machine_process.length > 0) {
            const selectedProcesses = machineData.machine_process.map((process) => ({
              value: process.process_id,
              label: process.process_name,
            }))

            setValue('selectedProcesses', selectedProcesses)

            // Set process values
            const processValues = {}
            machineData.machine_process.forEach((process) => {
              processValues[process.process_id] = process.process_values
            })
            setValue('processValues', processValues)

            // Fetch process fields for all assigned processes
            await Promise.all(
              machineData.machine_process.map(async (process) => {
                const fieldsResponse = await apiMethods.getProcessFields(process.process_id)
                setProcessFieldsMap((prev) => ({
                  ...prev,
                  [process.process_id]: fieldsResponse.data.data || [],
                }))
              }),
            )
          }

          // Handle machine_route
          if (machineData.machine_route && machineData.machine_route.length > 0) {
            setValue(
              'machine_route',
              machineData.machine_route.map((process) => process.process_id),
            )
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          setAlerts([{ severity: 'error', message: 'Failed to fetch machine data' }])
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [isEdit, reset, processes])

  const onSubmit = async (data) => {
    setIsSubmitted(true)
    try {
      setIsLoading(true)

      const machineData = {
        ...data,
        machine_status: data.machine_status ? 'Active' : 'Inactive',
      }
      delete machineData.selectedProcesses
      delete machineData.processValues

      // Prepare machine_process data
      machineData.machine_process = (data.selectedProcesses || []).map((process) => ({
        process_id: process.value,
        process_name: process.label,
        process_values: data.processValues[process.value] || {},
      }))

      machineData.machine_route = data.machine_route || []

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

  const processOptions = processes.map((process) => ({
    value: process.id,
    label: process.process_name,
  }))

  const handleDropOnItem = (e, dropIndex) => {
  e.preventDefault();
  if (!draggingItem) return;

  if (draggingItem.source === 'route') {
    const currentRoute = [...watch('machine_route')];
    const draggedIndex = currentRoute.findIndex(id => id === draggingItem.process.value);

    if (draggedIndex !== dropIndex) {
      const [removed] = currentRoute.splice(draggedIndex, 1);
      currentRoute.splice(dropIndex, 0, removed);
      setValue('machine_route', currentRoute);
    }
  }
};

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

          {/* Process Values Section */}
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

          {/* Process Route Configuration */}
          {watch('selectedProcesses')?.length > 0 && (
            <div className="px-4 mt-6 mb-20">
              <h3 className="text-lg font-medium mb-4">Process Route Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Processes for Route */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <h4 className="text-sm font-medium">Available Processes</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getAvailableRouteProcesses().length}
                    </span>
                  </div>
                  <div
                    className="space-y-2 max-h-60 overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'available')}
                  >
                    {getAvailableRouteProcesses().map((process) => (
                      <div
                        key={process.value}
                        draggable
                        onDragStart={(e) => handleDragStart(e, process, 'available')}
                        className="group flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                      >
                        <CIcon
                          icon={GripVertical}
                          className="text-gray-400 group-hover:text-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                          {process.label}
                        </span>
                      </div>
                    ))}
                    {getAvailableRouteProcesses().length === 0 && (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">No processes available</p>
                        <p className="text-xs text-gray-400">Select processes above first</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Route */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <h4 className="text-sm font-medium">Process Route Sequence</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {watch('machine_route')?.length || 0}
                    </span>
                  </div>
                  <div
                    className="space-y-3 max-h-60 overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'route')}
                  >
                    {watch('machine_route')?.map((processId, index) => {
                      // First try to find from the selected processes (which have correct labels)
                      const selectedProcess = watch('selectedProcesses')?.find((p) => p.value === processId);
                      
                      // If not found in selected, try to find from all processes
                      const allProcess = processes.find((p) => p.id === processId);
                      
                      // Use the selected process first (preferred), then fallback to all processes
                      const process = selectedProcess || {
                        label: allProcess?.process_name || `Process ${processId}`,
                        value: processId,
                        process_name: allProcess?.process_name || `Process ${processId}`
                      };

                      return (
                       <div
  key={`route-${processId}-${index}`}
>
  <div
    draggable
    onDragStart={(e) => handleDragStart(e, process, 'route')}
    onDragOver={handleDragOver}
    onDrop={(e) => handleDropOnItem(e, index)}
    className="group flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-all duration-200"
    data-index={index}
  >
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-semibold rounded-full mr-3">
                                {index + 1}
                              </div>
                              <CIcon icon={GripVertical} className="text-blue-400 mr-2" />
                              <span className="text-sm font-medium text-blue-800">
                                {process.label || process.process_name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const currentRoute = watch('machine_route') || [];
                                setValue(
                                  'machine_route',
                                  currentRoute.filter((id) => id !== processId)
                                );
                              }}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <CIcon icon={cilTrash} className="w-4 h-4" />
                            </button>
                          </div>
                          {index !== watch('machine_route').length - 1 && (
                            <div className="flex justify-center">
                              <CIcon icon={cilArrowBottom} className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {(!watch('machine_route') || watch('machine_route').length === 0) && (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Drop processes here</p>
                        <p className="text-xs text-gray-400">Create your process sequence</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
