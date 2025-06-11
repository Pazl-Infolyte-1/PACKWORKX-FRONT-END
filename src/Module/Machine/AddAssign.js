import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import ActionButton from '../../components/New/ActionButton'
import { FiEdit, FiPlus, FiSave, FiX } from 'react-icons/fi'
import CustomAlert from '../../components/New/CustomAlert'
import Loading from '../../components/New/Loading'
import { machineApi } from '../../api/machine'

function AddAssign({
  isAddModalOpen,
  setIsAddModalOpen,
  setRefresh,
  setAlerts,
  isEdit,
  disableMachineSelection = false,
}) {
  const [machine, setMachine] = useState([])
  const [process, setProcess] = useState([])
  const [selectedMachine, setSelectedMachine] = useState(null)
  const [selectedProcess, setSelectedProcess] = useState(null)
  const [assignedProcesses, setAssignedProcesses] = useState([])
  const [machineProcesses, setMachineProcesses] = useState([])
  const [loading, setLoading] = useState(false)

  // Values management state
  const [machineValues, setMachineValues] = useState(null)
  const [processFields, setProcessFields] = useState([])
  const [showValuesSection, setShowValuesSection] = useState(false)
  const [isEditingValues, setIsEditingValues] = useState(false)
  const [valuesFormData, setValuesFormData] = useState({})
  const [localAlerts, setLocalAlerts] = useState([])
  const [fieldsLoading, setFieldsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machine = await machineApi.getMachine({
          limit: 20000,
        })
        const process = await machineApi.getProcess({
          limit: 20000,
        })
        setProcess(process.data.data)
        setMachine(machine.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // Fetch assigned processes when in edit mode
  useEffect(() => {
    const fetchAssignedProcesses = async () => {
      if (isEdit && isAddModalOpen && isAddModalOpen.id) {
        try {
          const response = await machineApi.getByMachineId(isAddModalOpen.id)
          setAssignedProcesses(response.data.data || [])
        } catch (error) {
          console.error('Error fetching assigned processes:', error)
        }
      }
    }

    fetchAssignedProcesses()
  }, [isEdit, isAddModalOpen])

  // Fetch machine processes whenever a machine is selected
  useEffect(() => {
    const fetchMachineProcesses = async () => {
      if (selectedMachine) {
        setLoading(true)
        try {
          const response = await machineApi.getByMachineId(selectedMachine.value)
          setMachineProcesses(response.data.data || [])
        } catch (error) {
          console.error('Error fetching machine processes:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setMachineProcesses([])
      }
    }

    fetchMachineProcesses()
  }, [selectedMachine])

  // Set default values when in edit mode and after data is fetched
  useEffect(() => {
    if (isEdit && isAddModalOpen && machine.length > 0 && assignedProcesses.length > 0) {
      const machineId = assignedProcesses[0].machine_id
      const defaultMachine = machine.find((item) => item.id === machineId)

      if (defaultMachine) {
        setSelectedMachine({
          label: defaultMachine.machine_name,
          value: defaultMachine.id,
        })
      }

      if (isAddModalOpen.processId) {
        const specificProcess = assignedProcesses.find(
          (item) => item.process_id === isAddModalOpen.processId,
        )

        if (specificProcess) {
          setSelectedProcess({
            label: specificProcess.process_name,
            value: specificProcess.process_id,
          })
          // Load values when process is selected
          fetchProcessFieldsAndValues(specificProcess.process_id)
        }
      } else {
        const firstProcess = assignedProcesses[0]
        if (firstProcess) {
          setSelectedProcess({
            label: firstProcess.process_name,
            value: firstProcess.process_id,
          })
          // Load values when process is selected
          fetchProcessFieldsAndValues(firstProcess.process_id)
        }
      }
    }
  }, [isEdit, isAddModalOpen, machine, assignedProcesses])

  // Set the selected machine when a machine ID is provided for direct add
  useEffect(() => {
    if (!isEdit && isAddModalOpen && isAddModalOpen.id && machine.length > 0) {
      const defaultMachine = machine.find((item) => item.id === isAddModalOpen.id)
      if (defaultMachine) {
        setSelectedMachine({
          label: defaultMachine.machine_name,
          value: defaultMachine.id,
        })
      }
    }
  }, [isEdit, isAddModalOpen, machine])

  // Fetch process fields and values
  const fetchProcessFieldsAndValues = async (processId) => {
    if (!processId) return

    setFieldsLoading(true)
    try {
      // First fetch the fields for this process
      const fieldsResponse = await machineApi.getProcessFields(processId)
      const fields = fieldsResponse.data.data || []
      setProcessFields(fields)

      if (fields.length === 0) {
        setLocalAlerts([
          {
            severity: 'error',
            message: 'No fields defined for this process. Please define fields first.',
          },
        ])
        setShowValuesSection(false)
        return
      }

      // Then fetch the values
      const valuesResponse = await machineApi.getProcessValues()
      const allValues = valuesResponse.data.data

      const matchingProcess = allValues.find((process) => process.process_name_id === processId)

      setMachineValues(matchingProcess)

      // Initialize form data with existing values or empty object with field names
      const initialFormData = {}
      fields.forEach((field) => {
        initialFormData[field.label] = matchingProcess?.process_value?.[field.label] || ''
      })
      setValuesFormData(initialFormData)

      setShowValuesSection(true)
    } catch (error) {
      console.error('Error fetching process fields/values:', error)
      setLocalAlerts([
        {
          severity: 'error',
          message: 'Failed to fetch process data',
        },
      ])
    } finally {
      setFieldsLoading(false)
    }
  }

  // Handle machine selection change
  const handleMachineChange = (selected) => {
    setSelectedMachine(selected)
    setSelectedProcess(null)
    setMachineValues(null)
    setProcessFields([])
    setShowValuesSection(false)
    setLocalAlerts([])
  }

  // Handle process selection change
  const handleProcessChange = (selected) => {
    setSelectedProcess(selected)
    setLocalAlerts([])
    if (selected) {
      fetchProcessFieldsAndValues(selected.value)
    } else {
      setMachineValues(null)
      setProcessFields([])
      setShowValuesSection(false)
    }
  }

  // Create process options, filtering out processes already assigned to the current machine
  const processOptions = React.useMemo(() => {
    if (!process.length) return []

    // If no machine is selected, show all processes (for new assignments)
    if (!selectedMachine)
      return process.map((item) => ({
        label: item.process_name,
        value: item.id,
      }))

    // Get the IDs of processes already assigned to THIS SPECIFIC machine
    const currentMachineProcessIds = machineProcesses.map((item) => item.process_id)

    // When editing, include currently selected process in options
    const currentProcessId = selectedProcess?.value

    return process
      .filter(
        (item) =>
          !currentMachineProcessIds.includes(item.id) || (isEdit && item.id === currentProcessId),
      )
      .map((item) => ({
        label: item.process_name,
        value: item.id,
      }))
  }, [process, machineProcesses, selectedMachine, selectedProcess, isEdit])

  const machineOptions = machine.map((item) => ({
    label: item.machine_name,
    value: item.id,
  }))

  // Handle form field changes for values
  const handleValueChange = (field, value) => {
    setValuesFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Save both assignment and values
  const handleSave = async () => {
    if (!selectedMachine || !selectedProcess) {
      setAlerts([
        {
          severity: 'error',
          message: 'Please select both machine and process',
        },
      ])
      return
    }

    try {
      // First save the assignment
      let assignmentPayload = {}
      let response

      if (isEdit) {
        assignmentPayload = {
          machine_id: selectedMachine.value,
          process_id: selectedProcess.value,
        }
        response = await machineApi.updateAssignMachine(assignmentPayload, isAddModalOpen.id)
      } else {
        assignmentPayload = {
          assignments: [
            {
              machine_id: selectedMachine.value,
              process_id: selectedProcess.value,
            },
          ],
        }
        response = await machineApi.assignMachineProcess(assignmentPayload)
      }

      // Then save the values if we're editing them and fields exist
      if (isEditingValues && processFields.length > 0) {
        const valuesPayload = {
          id: machineValues?.id,
          machine_id: isAddModalOpen.id,
          process_name_id: selectedProcess.value,
          process_value: valuesFormData,
        }
        let response
        if (machineValues) {
        response = await machineApi.updateProcessValues(valuesPayload)
        } else {
          response = await machineApi.saveProcessValues(valuesPayload)
        }
      }

      setIsAddModalOpen({ show: false })
      setRefresh((prev) => !prev)
      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'Saved successfully',
        },
      ])
    } catch (err) {
      setAlerts([
        {
          severity: 'error',
          message: err?.response?.data?.message || 'Something went wrong',
        },
      ])
      console.error('Save failed:', err)
    }
  }

  const selectStyles = {
    container: (base) => ({
      ...base,
      width: '100%',
    }),
    control: (base) => ({
      ...base,
      minHeight: 40,
      borderRadius: '0.375rem',
      borderColor: '#d1d5db',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#f3f4f6',
      borderRadius: '0.25rem',
      margin: '2px 4px 2px 0',
    }),
    multiValueLabel: (base) => ({
      ...base,
      fontSize: '0.875rem',
      padding: '2px 6px',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#4b5563',
      '&:hover': {
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    valueContainer: (base, state) => ({
      ...base,
      padding: '0 8px',
      flexWrap: 'wrap',
      maxHeight: state.isMulti ? '80px' : 'none',
      overflow: state.isMulti ? 'auto' : 'hidden',
    }),
  }

  return (
    <div className="p-4 max-h-[600px] overflow-y-scroll">
      <CustomAlert alerts={localAlerts} handleClose={() => setLocalAlerts([])} />

      <div className="flex justify-between gap-3 p-2">
        <div className="w-1/2">
          <label className="my-2 font-semibold">
            Machine <span className="text-red-500">*</span>
          </label>
          <Select
            options={machineOptions}
            value={selectedMachine}
            onChange={handleMachineChange}
            menuPortalTarget={document.body}
            isClearable={!isEdit && !disableMachineSelection}
            isSearchable={!isEdit && !disableMachineSelection}
            isDisabled={isEdit || disableMachineSelection}
            styles={selectStyles}
            placeholder="Select machine..."
          />
        </div>
        <div className="w-1/2">
          <label className="my-2 font-semibold">
            Process <span className="text-red-500">*</span>
          </label>
          <Select
            options={processOptions}
            value={selectedProcess}
            onChange={handleProcessChange}
            isClearable
            isSearchable
            isLoading={loading}
            menuPortalTarget={document.body}
            styles={selectStyles}
            isMulti={false}
            placeholder={
              loading
                ? 'Loading processes...'
                : processOptions.length > 0
                  ? 'Select process...'
                  : selectedMachine
                    ? 'No available processes for this machine'
                    : 'Please select a machine first'
            }
            noOptionsMessage={() =>
              selectedMachine
                ? 'All processes already assigned to this machine'
                : 'Please select a machine first'
            }
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="p-2">
        {fieldsLoading ? (
          <div className="flex justify-center py-12">
            <Loading isLoading={true} />
          </div>
        ) : showValuesSection && processFields.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className=" px-6 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Process Values</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Monitor and adjust your process parameters
                  </p>
                </div>

                {!isEditingValues ? (
                  <button
                    onClick={() => setIsEditingValues(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    {machineValues ? (
                      <FiEdit className="mr-2 h-4 w-4" />
                    ) : (
                      <FiPlus className="mr-2 h-4 w-4" />
                    )}
                    {machineValues ? 'Edit Values' : 'Add Values'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingValues(false)}
                      className="inline-flex items-center px-3 py-2 text-black text-sm font-medium rounded-lg"
                    >
                      <FiX className="mr-1 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isEditingValues ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {processFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {field.label.replace('_', ' ')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={valuesFormData[field.label] || ''}
                          onChange={(e) => handleValueChange(field.label, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder={`Enter ${field.label.replace('_', ' ')}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processFields.map((field) => {
                    const value = machineValues?.process_value?.[field.label]
                    const hasValue = value !== null && value !== undefined

                    return (
                      <div
                        key={field.id}
                        className={`relative p-2 rounded-lg border-2 transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {field.label.replace('_', ' ')}
                          </div>
                          {hasValue && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                        </div>
                        <div
                          className={`text-sm font-semibold ${hasValue ? 'text-gray-800' : 'text-gray-400'}`}
                        >
                          {hasValue ? value : 'N/A'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 my-4">
        <ActionButton
          label={'Cancel'}
          variant="minimal"
          onClick={() => setIsAddModalOpen({ show: false })}
        />
        <ActionButton
          label={isEdit ? 'Update' : 'Save'}
          variant="save"
          onClick={handleSave}
          disabled={!selectedMachine || !selectedProcess || processOptions.length === 0}
        />
      </div>
    </div>
  )
}

export default AddAssign
