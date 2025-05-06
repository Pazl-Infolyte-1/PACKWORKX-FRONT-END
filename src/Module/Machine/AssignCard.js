import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import { useState } from 'react'
import apiMethods from '../../api/config'
import CIcon from '@coreui/icons-react'

const AssignCard = ({
  machine,
  processes,
  isExpanded,
  onToggle,
  setAlerts,
  setRefresh,
  handleAssignEdit,
}) => {
  const [deleteAssgined, setDeleteAssgined] = useState({ show: false, id: null })

  if (!machine) {
    return null
  }
  
  const handleDelete = async () => {
    try {
      const response = await apiMethods.deleteAssignMachine(deleteAssgined.id)
      setRefresh((prev) => !prev)
      setDeleteAssgined({ show: false, id: null })
      setAlerts([
        {
          severity: 'success',
          message: response.data.message || 'Machine deleted successfully!',
        },
      ])
    } catch (error) {
      setDeleteAssgined({ show: false, id: null })
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete machine',
        },
      ])
      console.error('Error deleting machine:', error)
    }
  }
  return (
    <>
      <div className="mb-4 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={onToggle}>
          <div className="flex items-center">
            <h3 className="ml-2 font-medium text-lg">{machine?.machine_name}</h3>
            <span className="ml-2 text-sm text-gray-500">({machine?.machine_type})</span>
          </div>
          <div className="flex gap-2 items-center">
            <CIcon
              icon={cilTrash}
              onClick={(e) => {
                e.stopPropagation()
                setDeleteAssgined({ show: true, id: machine?.id })
              }}
            />

            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 pt-1 border-t">
            <h4 className="mb-2 text-sm font-medium text-gray-600">Assigned Processes:</h4>
            {processes.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {processes.map((process, index) => (
                  <div key={index} className="items-center p-2 bg-gray-100 rounded">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm font-medium">{process?.process_name}</span>
                      <CIcon
                        icon={cilPencil}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => handleAssignEdit(machine.id, process?.process_id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No processes assigned to this machine.
              </p>
            )}
          </div>
        )}
      </div>
      <ConfirmationModale
        isOpen={deleteAssgined.show}
        onClose={() => setDeleteAssgined({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Delete"
      />
    </>
  )
}

export default AssignCard
