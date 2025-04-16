import React, { useState, useEffect } from 'react'
import ProcessDropDown from '../Machine/ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'

function AddProcessField({ fieldData, setShowProcessFields, isEditing = false, editData = null }) {
  const [selectedProcess, setSelectedProcess] = useState([])
  const [processInputs, setProcessInputs] = useState({})
  const [selectedProcessId, setSelectedProcessId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isEditing && editData?.process_value) {
      setProcessInputs({...editData.process_value});
    }
  }, [isEditing, editData]);

  const fetchProcessFields = async (processId) => {
    try {
      const response = await apiMethods.getProcessFields(processId)
      setSelectedProcess(response.data.data)
    } catch (error) {
      console.error('Error fetching process fields:', error)
    }
  }
  console.log(selectedProcess, 'sp')
  console.log(processInputs, 'piii')

  const handleProcessChange = (selected) => {
    if (!isEditing) {
      setProcessInputs({})
    }
    setSelectedProcessId(selected.processId)
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
        setShowProcessFields(false)
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
          {!isEditing && (
            <ProcessDropDown
              options={fieldData}
              onChange={handleProcessChange}
              onSelect={handleSelect}
              dropdownHeight={'[200px]'}
              overflowX={'none'}
              overflowY={'none'}
              defaultValue={isEditing ? editData?.ProcessName?.process_name : null}
            />
          )}

          {isEditing && (
            <div className="mb-4">
              <h3 className="font-medium">
                Process: <span className="font-bold">{editData?.ProcessName?.process_name}</span>
              </h3>
            </div>
          )}

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
            // Fallback if no selectedProcess but we have process_value data in edit mode
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
