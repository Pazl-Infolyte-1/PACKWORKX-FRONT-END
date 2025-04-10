import React, { useState } from 'react'
import ProcessDropDown from '../Machine/ProcessDropDown'
import AddButton from '../../components/New/AddButton'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'

function AddProcessField({ fieldData, setShowProcessFields }) {
  const [selectedProcess, setSelectedProcess] = useState([])
  const [processInputs, setProcessInputs] = useState({})
  const [selectedProcessId, setSelectedProcessId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleProcessChange = (process) => {
    // Reset inputs when process changes
    setProcessInputs({})
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
      const response = await apiMethods.getProcessFields(id)
      setSelectedProcess(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const payload = {
        process_name_id: selectedProcessId,
        process_value: { ...processInputs }
      }
      await apiMethods.saveProcessValues(payload)
      setShowProcessFields(false)
    } catch (error) {
      console.error("Error saving process values:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row p-3 rounded-lg w-full item-center gap-5 relative border-gray-50 border h-[90%]">
        <div className="w-full flex flex-col">
          <ProcessDropDown
            options={fieldData}
            onChange={handleProcessChange}
            dropdownHeight={'[200px]'}
            overflowX={'none'}
            overflowY={'none'}
            handleSelect={handleSelect}
          />

          {selectedProcess && selectedProcess?.data?.length > 0 && (
            <>
              <h6 className="font-semibold col-span-2 mb-2">Labels</h6>
              <div className="grid grid-cols-2 gap-4">
                {selectedProcess?.data?.map((item) => (
                  <div key={item.id}>
                    <label htmlFor={item?.label}>{item?.label}</label>
                    <input
                      type={item.field_type}
                      placeholder={item?.label}
                      value={processInputs[item?.label] || ''}
                      onChange={(e) => handleInputChange(e, item?.label)}
                      className="w-full p-2 rounded border border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end my-2 gap-3">
        <ActionButton 
          label="Cancel" 
          variant='minimal' 
          onClick={() => setShowProcessFields(false)}
        />
        <ActionButton 
          label={isLoading ? "Saving..." : "Save"}
          onClick={handleSave}
          disabled={isLoading || !selectedProcessId || Object.keys(processInputs).length === 0}
        />
      </div>
    </>
  )
}

export default AddProcessField