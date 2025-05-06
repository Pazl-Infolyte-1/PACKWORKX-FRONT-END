import React, { useEffect, useState } from 'react'
import { FiEdit, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import ActionButton from '../../components/New/ActionButton'
import CustomAlert from '../../components/New/CustomAlert'
import apiMethods from '../../api/config'
import Loading from '../../components/New/Loading'

function MachineValues({
  handleAddField,
  openMachineValuesModal,
  allMachineValue,
  setIsEdit,
  refresh,
  setAllMachineValue,
}) {
  const [machineValue, setMachineValue] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Get the current process ID from the modal
  const currentProcessId = openMachineValuesModal?.id

  const fetchMachineValue = async () => {
    if (!currentProcessId) return

    setIsLoading(true)
    try {
      const allValuesResponse = await apiMethods.getProcessValues()
      const allValues = allValuesResponse.data.data
      
      // Save all values for future reference
      if (setAllMachineValue) {
        setAllMachineValue(allValues)
      }

      const matchingProcess = allValues.find(
        (process) => process.process_name_id === currentProcessId,
      )
      setMachineValue(matchingProcess)
    } catch (error) {
      console.error('Fetch error:', error)
      setAlerts([{ severity: 'error', message: 'Failed to fetch machine values' }])
      setMachineValue(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMachineValue()
  }, [currentProcessId, refresh])

  const toggleExpand = () => {
    setExpanded((prev) => !prev)
  }

  const handleEditClick = (item, e) => {
    e.stopPropagation()
    setIsEdit(true)

    // Ensure we use the correct process ID
    const processDataToEdit = {
      processId: item.process_name_id || currentProcessId,
      process_value: item.process_value || {},
    }
    
    handleAddField(processDataToEdit)
  }

  const handleAddNewValues = () => {
    setIsEdit(false)
    // Make sure we're passing the ID correctly
    const processData = typeof currentProcessId === 'object' 
      ? currentProcessId 
      : { processId: currentProcessId }
      
    handleAddField(processData)
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="h-[500px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loading isLoading={isLoading} />
          </div>
        ) : machineValue ? (
          <div
            className={`bg-white rounded-lg shadow-sm transition-all duration-200 ${
              expanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
          >
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={toggleExpand}
            >
              <div className="flex-1 items-center">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-lg">
                    {machineValue.ProcessName?.process_name}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                {Object.keys(machineValue?.process_value || {}).length > 0 && (
                  <button
                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                    onClick={(e) => handleEditClick(machineValue, e)}
                  >
                    <FiEdit size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out`}>
              <div className="p-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Machine Values</h4>
                {machineValue.process_value &&
                Object.keys(machineValue.process_value).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(machineValue.process_value).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-blue-500"
                      >
                        <p className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <div className="px-3 py-1 bg-gray-100 rounded-md">
                          <p className="text-sm font-semibold text-gray-800">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No machine values available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 text-lg mb-2">No Data Found</div>
              <p className="text-gray-500">No values are available for this process</p>
              <div className="flex justify-center">
                <ActionButton
                  variant="add"
                  label={'Add Values'}
                  onClick={handleAddNewValues}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MachineValues