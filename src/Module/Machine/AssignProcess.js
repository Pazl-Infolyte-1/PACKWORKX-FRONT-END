import React, { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import PopUp from '../../components/New/PopUp'
import AddAssign from './AddAssign'
import AssignCard from './AssignCard'
import { machineApi } from '../../api/machine'

function AssignProcess({ refresh, setRefresh, setAlerts, isEdit, setIsEdit, preSelectedMachineId }) {
  const [assignProcess, setAssignProcess] = useState([])
  const [groupedData, setGroupedData] = useState({})
  const [expandedMachineId, setExpandedMachineId] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState({ show: false, id: null, processId: null })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await machineApi.getAllAssign()
        setAssignProcess(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [refresh])

  useEffect(() => {
    // Group processes by machine_id
    const grouped = {}
    Object.values(assignProcess).forEach((item) => {
      if (!item || !item.machine_id) return

      const machineId = item.machine_id

      if (!grouped[machineId]) {
        grouped[machineId] = {
          machine: item.Machine,
          processes: [],
        }
      }

      grouped[machineId].processes.push({
        id: item.id,
        process_id: item.process_id,
        process_name: item.process_name,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })
    })

    setGroupedData(grouped)
  }, [assignProcess])

  const handleToggle = (machineId) => {
    if (expandedMachineId === machineId) {
      setExpandedMachineId(null)
    } else {
      setExpandedMachineId(machineId)
    }
  }

  const handleAddNew = () => {
    setIsAddModalOpen({ 
      show: true, 
      id: preSelectedMachineId || null 
    });
    setIsEdit(false);
  }

  const handleAssignEdit = (machineId, processId) => {
    setIsAddModalOpen({ show: true, id: machineId, processId: processId })
    setIsEdit(true)
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center mb-6">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">No machine assignments yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first machine assignment.
        </p>
      </div>
      <ActionButton
        label="Assign Process"
        variant="add"
        onClick={handleAddNew}
      />
    </div>
  )

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-end items-center mb-6">
          {assignProcess.length > 0 && (
            <ActionButton
              label="Add New"
              variant="add"
              onClick={handleAddNew}
            />
          )}
        </div>

        {Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([machineId, group]) => (
            <AssignCard
              key={machineId}
              machine={group.machine}
              processes={group.processes}
              isExpanded={expandedMachineId === parseInt(machineId)}
              onToggle={() => handleToggle(parseInt(machineId))}
              handleAssignEdit={handleAssignEdit}
              setAlerts={setAlerts}
              setRefresh={setRefresh}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      <PopUp
        visible={isAddModalOpen.show}
        setVisible={setIsAddModalOpen}
        width={800}
        height={300}
        header={isEdit ? 'Edit Assign' : 'Assign Process'}
        showCloseButton={true}
      >
        <AddAssign
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          setRefresh={setRefresh}
          setAlerts={setAlerts}
          isEdit={isEdit}
        />
      </PopUp>
    </>
  )
}

export default AssignProcess
