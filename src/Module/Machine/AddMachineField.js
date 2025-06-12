import React, { useState, useEffect } from 'react'
import ProcessDropDown from './ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'
import { machineApi } from '../../api/machine'

function AddMachineField({
  fieldData,
  setShowMachineFields,
  isEditing,
  editData,
  selectedMachineValue,
  setSelectedMachineValue,
  setRefresh,
  setAllMachineValue,
}) {
  const [selectedProcess, setSelectedProcess] = useState([])
  const [machineInputs, setMachineInputs] = useState({})
  const [selectedProcessId, setSelectedProcessId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [valesId, setValuesId] = useState(null)

  useEffect(() => {
    if (!isEditing) {
      setMachineInputs({})
    }

    return () => {
      setMachineInputs({})
    }
  }, [])

  useEffect(() => {
    if (isEditing && (editData || selectedMachineValue)) {
      const dataToUse = editData || selectedMachineValue
      if (typeof dataToUse === 'object' && dataToUse !== null) {
        if (dataToUse.processId) {
          setSelectedProcessId(dataToUse.processId)
          if (dataToUse.machine_value) {
            setMachineInputs({ ...dataToUse.machine_value })
          } else if (dataToUse.process_value) {
            setMachineInputs({ ...dataToUse.process_value })
          }

          fetchProcessFields(dataToUse.processId)
        }
        else if (dataToUse.id) {
          setSelectedProcessId(dataToUse.id)

          if (dataToUse.machine_value) {
            setMachineInputs({ ...dataToUse.machine_value })
          } else if (dataToUse.process_value) {
            setMachineInputs({ ...dataToUse.process_value })
          }

          fetchProcessFields(dataToUse.id)
        }
      }
      else if (typeof dataToUse === 'number' || typeof dataToUse === 'string') {
        setSelectedProcessId(dataToUse)
        fetchProcessFields(dataToUse)
      }
    } else if (selectedMachineValue && !selectedProcessId) {
      if (typeof selectedMachineValue === 'object' && selectedMachineValue !== null) {
        if (selectedMachineValue.processId) {
          setSelectedProcessId(selectedMachineValue.processId)

          if (selectedMachineValue.machine_value) {
            setMachineInputs({ ...selectedMachineValue.machine_value })
          } else if (selectedMachineValue.process_value) {
            setMachineInputs({ ...selectedMachineValue.process_value })
          }

          fetchProcessFields(selectedMachineValue.processId)
        }
      } else if (
        typeof selectedMachineValue === 'number' ||
        typeof selectedMachineValue === 'string'
      ) {
        setSelectedProcessId(selectedMachineValue)
        fetchProcessFields(selectedMachineValue)
      }
    }
  }, [isEditing, editData, selectedMachineValue])

  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        try {
          const response = await apiMethods.getProcessValues();
          const data = response.data.data;
          
          if (selectedProcessId) {
            const selectedObject = data.find((item) => item.process_name_id === selectedProcessId);
            setValuesId(selectedObject);
            
            if (selectedObject && selectedObject.process_value) {
              setMachineInputs({ ...selectedObject.process_value });
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [isEditing, selectedProcessId]); 

  const fetchProcessFields = async (processId) => {
    if (!processId) return
    
    const actualProcessId = processId.processId || processId;
    
    try {
      const response = await apiMethods.getProcessFields(actualProcessId)
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setSelectedProcess(response.data.data)
      } else {
        console.error('Process fields data is not in expected format:', response?.data)
        setSelectedProcess([])
      }
    } catch (error) {
      console.error('Error fetching process fields:', error)
      setSelectedProcess([])
    }
  }

  const handleProcessChange = (selected) => {
    if (!selected) return

    setSelectedMachineValue(selected)

    if (typeof selected === 'object' && selected !== null) {
      if (selected.processId) {
        setSelectedProcessId(selected.processId)
        fetchProcessFields(selected.processId)
      } else if (selected.id) {
        setSelectedProcessId(selected.id)
        fetchProcessFields(selected.id)
      } else if (selected.process_id) {
        setSelectedProcessId(selected.process_id)
        fetchProcessFields(selected.process_id)
      }
    } else {
      setSelectedProcessId(selected)
      fetchProcessFields(selected)
    }

    if (!isEditing) {
      setMachineInputs({})
    }
  }

  const handleInputChange = (e, param) => {
    setMachineInputs({
      ...machineInputs,
      [param]: e.target.value,
    })
  }

  const handleSelect = async (id) => {
    try {
      const actualId = id?.processId || id?.id || id?.process_id || id
      
      setSelectedProcessId(actualId)
      await fetchProcessFields(actualId)
    } catch (error) {
      console.error("Error in handleSelect:", error)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      
      const actualProcessId = 
        selectedProcessId?.processId || 
        selectedProcessId?.process_id || 
        selectedProcessId

      const payload = {
        id: valesId?.id,
        machine_id: selectedMachineValue?.id,
        process_name_id: actualProcessId,
        process_value: { ...machineInputs },
      }

      if (isEditing) {
        const response = await apiMethods.updateProcessValues(payload)
        const refreshResult = await apiMethods.getProcessValues()
        setAllMachineValue && setAllMachineValue(refreshResult.data.data)
      } else {
        await machineApi.saveProcessValues(payload)
      }

      setRefresh && setRefresh((prev) => !prev)
      setShowMachineFields(false)
    } catch (error) {
      console.error('Error saving machine values:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setMachineInputs({})
    setSelectedProcessId(null)
    setSelectedProcess([])
    setShowMachineFields(false)
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row p-3 rounded-lg w-full item-center gap-5 relative border-gray-50 border">
        <div className="w-full flex flex-col">
          <ProcessDropDown
            options={fieldData}
            onChange={handleProcessChange}
            onSelect={handleSelect}
            placeholder="Select Process"
            value={selectedMachineValue}
            readOnly={isEditing}
            isEdit={isEditing}
          />
          {selectedProcess?.length > 0 ? (
            <>
              <h6 className="font-semibold col-span-2 mb-2">
                Labels <span className="text-red-500">*</span>
              </h6>
              <div className="grid grid-cols-2 gap-4">
                {selectedProcess.map((item) => (
                  <div key={item.id}>
                    <label htmlFor={item?.label} className="block mb-1 text-sm font-medium">
                      {item?.label}
                    </label>

                    <input
                      type={item.field_type || 'text'}
                      placeholder={item?.label}
                      value={machineInputs[item?.label] || ''}
                      onChange={(e) => handleInputChange(e, item?.label)}
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : isEditing && Object.keys(machineInputs).length > 0 ? (
            <>
              <h6 className="font-semibold col-span-2 mb-2">Values</h6>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(machineInputs).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block mb-1 text-sm font-medium">
                      {key}
                    </label>
                    <input
                      type="text"
                      placeholder={key}
                      value={value || ''}
                      onChange={(e) => handleInputChange(e, key)}
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No Fields available for the selected process
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end my-2 gap-3">
        <ActionButton label="Cancel" variant="minimal" onClick={handleCancel} />
        <ActionButton
          label={isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          onClick={handleSave}
          disabled={
            isLoading ||
            (!isEditing && (!selectedProcessId || Object.keys(machineInputs).length === 0))
          }
        />
      </div>
    </>
  )
}

export default AddMachineField