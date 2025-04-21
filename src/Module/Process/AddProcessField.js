import React, { useState, useEffect } from 'react'
import ProcessDropDown from '../Machine/ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'

function AddProcessField({ fieldData, setShowProcessFields, isEditing, editData = null, selectedProcessValue, setSelectedProcessValue }) {
  const [selectedProcess, setSelectedProcess] = useState([])
  const [processInputs, setProcessInputs] = useState({})
  const [selectedProcessId, setSelectedProcessId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [selectedProcessValue, setSelectedProcessValue] = useState(null)

  useEffect(() => {
    // Run this effect only once when component mounts with edit data
    if (isEditing && editData && !selectedProcessId) {
      setSelectedProcessId(editData.processId || editData.id)
      
      // Set process inputs from editData only once
      if (editData.process_value) {
        setProcessInputs({...editData.process_value})
      }
      
      // Fetch fields for this process
      fetchProcessFields(editData.processId || editData.id)
    } else if (selectedProcessValue && selectedProcessValue.processId && !selectedProcessId) {
      // Handle case when adding new field for a specific process
      setSelectedProcessId(selectedProcessValue.processId)
      fetchProcessFields(selectedProcessValue.processId)
    }
  }, [])

const fetchProcessFields = async (processId) => {
  if (!processId) return
  
  try {
    const response = await apiMethods.getProcessFields(processId)
    setSelectedProcess(response.data.data)
  } catch (error) {
    console.error('Error fetching process fields:', error)
  }
}

const handleProcessChange = (selected) => {
  if (!selected) return
  
  setSelectedProcessValue(selected)
  setSelectedProcessId(selected.processId)
  
  // Clear inputs and fetch fields for the selected process
  if (!isEditing) {
    setProcessInputs({})
    fetchProcessFields(selected.processId)
  }
}

  const handleInputChange = (e, param) => {
    setProcessInputs({
      ...processInputs,
      [param]: e.target.value,
    })
  }

  const handleSelect = async (id) => {
    try {
      setSelectedProcessId(id)
      await fetchProcessFields(id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      if (isEditing) {
        // Update existing process values
        const payload = {
          id: editData.id,
          process_name_id: selectedProcessId,
          process_value: { ...processInputs },
        }
        await apiMethods.updateProcessValues(payload)
      } else {
        // Create new process values
        const payload = {
          process_name_id: selectedProcessId,
          process_value: { ...processInputs },
        }
        await apiMethods.saveProcessValues(payload)
      }
      setShowProcessFields(false)
    } catch (error) {
      console.error('Error saving process values:', error)
    } finally {
      setIsLoading(false)
    }
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
            value={selectedProcessValue}
            readOnly={isEditing} // Make it read-only in edit mode
            isEdit={isEditing}
          />

          {selectedProcess?.length > 0 ? (
            <>
              <h6 className="font-semibold col-span-2 mb-2">Labels</h6>
              <div className="grid grid-cols-2 gap-4">
                {selectedProcess.map((item) => (
                  <div key={item.id}>
                    <label htmlFor={item?.label} className="block mb-1 text-sm font-medium">
                      {item?.label}
                    </label>
                    <input
                      type={item.field_type || 'text'}
                      placeholder={item?.label}
                      value={processInputs[item?.label] || ''}
                      onChange={(e) => handleInputChange(e, item?.label)}
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : isEditing && editData?.process_value ? (
            <>
              <h6 className="font-semibold col-span-2 mb-2">Values</h6>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editData.process_value).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block mb-1 text-sm font-medium">
                      {key}
                    </label>
                    <input
                      type="text"
                      placeholder={key}
                      value={processInputs[key] || ''}
                      onChange={(e) => handleInputChange(e, key)}
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end my-2 gap-3">
        <ActionButton
          label="Cancel"
          variant="minimal"
          onClick={() => setShowProcessFields(false)}
        />
        <ActionButton
          label={isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          onClick={handleSave}
          disabled={
            isLoading ||
            (!isEditing && (!selectedProcessId || Object.keys(processInputs).length === 0))
          }
        />
      </div>
    </>
  )
}

export default AddProcessField