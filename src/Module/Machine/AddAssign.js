import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machine = await apiMethods.getMachine({
          limit: 20000,
        })
        const process = await apiMethods.getProcess({
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
          const response = await apiMethods.getByMachineId(isAddModalOpen.id)
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
          const response = await apiMethods.getByMachineId(selectedMachine.value)
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

      // Find the specific process if processId is provided
      if (isAddModalOpen.processId) {
        const specificProcess = assignedProcesses.find(
          (item) => item.process_id === isAddModalOpen.processId,
        )

        if (specificProcess) {
          setSelectedProcess({
            label: specificProcess.process_name,
            value: specificProcess.process_id,
          })
        }
      } else {
        // Default behavior (first process)
        const firstProcess = assignedProcesses[0]
        if (firstProcess) {
          setSelectedProcess({
            label: firstProcess.process_name,
            value: firstProcess.process_id,
          })
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

  // Handle machine selection change to clear process selection
  const handleMachineChange = (selected) => {
    setSelectedMachine(selected)
    setSelectedProcess(null)
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

    let payload = {}

    if (isEdit) {
      // For edit, use the simplified payload structure
      payload = {
        machine_id: selectedMachine.value,
        process_id: selectedProcess.value,
      }
    } else {
      // For new assignments
      payload = {
        assignments: [
          {
            machine_id: selectedMachine.value,
            process_id: selectedProcess.value,
          },
        ],
      }
    }

    try {
      const response = isEdit
        ? await apiMethods.updateAssignMachine(payload, isAddModalOpen.id)
        : await apiMethods.assignMachineProcess(payload)
      setIsAddModalOpen({ show: false })
      setRefresh((prev) => !prev)
      setAlerts([
        {
          severity: 'success',
          message: response.data.message || 'Assigned successfully',
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

  return (
    <>
      <div className="flex justify-between gap-3 p-2">
        <div className="w-1/2">
          <label className="my-2 font-semibold">Machine</label>
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
          <label className="my-2 font-semibold">Process</label>
          <Select
            options={processOptions}
            value={selectedProcess}
            onChange={setSelectedProcess}
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
    </>
  )
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

export default AddAssign
