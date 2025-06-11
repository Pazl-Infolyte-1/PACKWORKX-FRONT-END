import React, { useState, useEffect } from 'react'
import ProcessDropDown from '../Machine/ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'
import { machineApi } from '../../api/machine'

function AddProcessField({
  fieldData,
  setShowProcessFields,
  isEditing,
  editData,
  selectedProcessValue,
  setSelectedProcessValue,
  setRefresh,
  setAllprocessValue,
}) {
  const [selectedProcess, setSelectedProcess] = useState([])
  const [processInputs, setProcessInputs] = useState({})
  const [selectedProcessId, setSelectedProcessId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setProcessInputs({})
    }

    // Clean up function
    return () => {
      setProcessInputs({})
    }
  }, [])

  useEffect(() => {
    if (isEditing && (editData || selectedProcessValue)) {
      const dataToUse = editData || selectedProcessValue
      setSelectedProcessId(dataToUse.processId || dataToUse.id)
      if (dataToUse.process_value) {
        setProcessInputs({ ...dataToUse.process_value })
      } else {
        setProcessInputs({})
      }

      fetchProcessFields(dataToUse.processId || dataToUse.id)
    } else if (selectedProcessValue && selectedProcessValue.processId && !selectedProcessId) {
      setSelectedProcessId(selectedProcessValue.processId)

      if (selectedProcessValue.process_value) {
        setProcessInputs({ ...selectedProcessValue.process_value })
      } else {
        setProcessInputs({})
      }

      fetchProcessFields(selectedProcessValue.processId)
    }
  }, [isEditing, editData, selectedProcessValue])

  const fetchProcessFields = async (processId) => {
    if (!processId) return

    try {
      const response = await machineApi.getProcessFields(processId)
      setSelectedProcess(response.data.data)
    } catch (error) {
      console.error('Error fetching process fields:', error)
    }
  }

  const handleProcessChange = (selected) => {
    if (!selected) return

    setSelectedProcessValue(selected)
    setSelectedProcessId(selected.processId)

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
        const payload = {
          id: editData?.id || selectedProcessValue?.id,
          machine_id: editData?.machine_id || selectedProcessValue?.machine_id,
          process_name_id: selectedProcessId,
          process_value: { ...processInputs },
        }
        const response = await machineApi.updateProcessValues(payload)

        const refreshResult = await machineApi.getProcessValues()
        setAllprocessValue(refreshResult.data.data)
      } else {
        const payload = {
          process_name_id: selectedProcessId,
          process_value: { ...processInputs },
        }
        await machineApi.saveProcessValues(payload)
      }

      // Trigger parent refresh
      setRefresh && setRefresh((prev) => !prev)
      setShowProcessFields(false)
    } catch (error) {
      console.error('Error saving process values:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleCancel = () => {
    // Reset all state when canceling
    setProcessInputs({})
    setSelectedProcessId(null)
    setSelectedProcess([])
    setShowProcessFields(false)
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
            (!isEditing && (!selectedProcessId || Object.keys(processInputs).length === 0))
          }
        />
      </div>
    </>
  )
}

export default AddProcessField
