import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import { CiSettings, CiCircleAlert } from 'react-icons/ci'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPen, cilTrash } from '@coreui/icons'
import ActionButton from '../../components/New/ActionButton'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import MachineValues from './MachineValues'
import AddMachineField from './AddMachineField'

function FieldValues({
  openFieldValuesModal,
  setOpenMachineFieldModal,
  setOpenMachineValuesModal,
  openMachineValuesModal,
  handleEditProcess,
}) {
  const [assignProcess, setAssignProcess] = useState([])
  const [machineProcess, setMachineProcess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteProcess, setDeleteProcess] = useState({ open: false, id: null })
  const [showMachineFields, setShowMachineFields] = useState(false)
  const [selectedMachineValue, setSelectedMachineValue] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [allMachineValue, setAllMachineValue] = useState([])
  const [processFields, setProcessFields] = useState({})

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiMethods.getAllAssign()
      setAssignProcess(response.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  
  const fetchProcessFields = async (processId) => {
    if (!processId) return

    try {
      const response = await apiMethods.getProcessFields(processId)
      setProcessFields((prev) => ({
        ...prev,
        [processId]: response?.data?.data,
      }))
    } catch (error) {
      console.error('Error fetching process fields:', error)
    }
  }
  console.log('assignProcess', processFields);

  useEffect(() => {
    fetchData()
  }, [refresh])

  useEffect(() => {
    if (openFieldValuesModal && openFieldValuesModal.id && assignProcess.length > 0) {
      const machineId = openFieldValuesModal.id

      const filteredData = Object.values(assignProcess).filter(
        (item) => item && item.machine_id === machineId,
      )

      if (filteredData.length > 0) {
        const machine = {
          machine: filteredData[0].Machine,
          processes: filteredData.map((item) => ({
            id: item.id,
            process_id: item.process_id,
            process_name: item.process_name,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })),
        }

        setMachineProcess(machine)

        // Fetch fields for all processes
        filteredData.forEach((item) => {
          fetchProcessFields(item.process_id)
        })
      } else {
        setMachineProcess(null)
      }
    }
  }, [assignProcess, openFieldValuesModal])

  const handleProcessEdit = (processId) => {
    if (handleEditProcess) {
      handleEditProcess(processId)
    }
  }

  const handleAddField = (id) => {
    setShowMachineFields(true)
    
    // Normalize the process data structure
    let processDataToEdit;
    
    if (typeof id === 'object' && id !== null) {
      processDataToEdit = {
        processId: id.processId || id.process_id || id,
        process_value: id.machine_value || id.process_value || {}
      }
    } else {
      processDataToEdit = {
        processId: id
      }
    }
    
    setSelectedMachineValue(processDataToEdit)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!machineProcess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border py-12 border-gray-200 rounded-lg border-dashed">
        <CiCircleAlert className="w-12 h-12 text-yellow-500 mb-4" />
        <p className="text-gray-600 text-lg">No processes found for this machine</p>
      </div>
    )
  }

  const handleDeleteProcess = async () => {
    await apiMethods.deleteProcess(deleteProcess.id)
    setDeleteProcess({ open: false, id: null })
    fetchData()
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-[500px] overflow-y-scroll">
      {/* Machine Header */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {machineProcess.machine.machine_name}
            </h2>
            <p className="text-gray-500 flex items-center mt-1">
              <CiSettings className="w-4 h-4 mr-1" />
              <span>Type: {machineProcess.machine.machine_type}</span>
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            ID: {machineProcess.machine.id}
          </div>
        </div>
      </div>

      {/* Process Cards - Minimal Version */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Associated Processes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machineProcess.processes.map((process) => (
          <div
            key={process.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2 items-center">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  ID: {process.process_id}
                </span>
                <h4 className="text-base font-medium text-gray-800">{process.process_name}</h4>
              </div>
              <ThreeDotMenu
                value={[
                  {
                    label: 'Edit Process',
                    icon: cilPen,
                    onClick: () => {
                      handleProcessEdit(process.process_id)
                    },
                  },
                  {
                    label: 'Delete Process',
                    icon: cilTrash,
                    onClick: () => {
                      setDeleteProcess({ show: true, id: process.process_id })
                    },
                  },
                ]}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <ActionButton
                label={'Fields'}
                variant="minimal"
                className="w-1/2"
                onClick={() => setOpenMachineFieldModal({ open: true, id: process.process_id })}
              />
              <ActionButton
                label={'Values'}
                variant="minimal"
                className="w-1/2"
                onClick={() => {setOpenMachineValuesModal({ open: true, id: process.process_id })}}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Machine Values Modal */}
      {openMachineValuesModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Machine Values</h3>
              <button
                onClick={() => {setOpenMachineValuesModal({ open: false, id: null }), setShowMachineFields(false)}}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {showMachineFields ? (
              <AddMachineField
                fieldData={machineProcess.processes}
                setShowMachineFields={setShowMachineFields}
                isEditing={isEdit}
                selectedMachineValue={selectedMachineValue}
                setSelectedMachineValue={setSelectedMachineValue}
                setRefresh={setRefresh}
                setAllMachineValue={setAllMachineValue}
              />
            ) : (
              <MachineValues
                handleAddField={handleAddField}
                openMachineValuesModal={openMachineValuesModal}
                allMachineValue={allMachineValue}
                setIsEdit={setIsEdit}
                refresh={refresh}
                setAllMachineValue={setAllMachineValue}
              />
            )}
          </div>
        </div>
      )}

      <ConfirmationModale
        isOpen={deleteProcess.show}
        onClose={() => setDeleteProcess({ show: false, id: null })}
        onConfirm={handleDeleteProcess}
      />
    </div>
  )
}

export default FieldValues