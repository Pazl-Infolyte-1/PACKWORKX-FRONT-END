import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import { CiSettings, CiCircleCheck, CiCircleAlert } from 'react-icons/ci'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPen } from '@coreui/icons'
import ActionButton from '../../components/New/ActionButton'

function MachineValues({ id }) {
  const [values, setValues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddValueModal, setShowAddValueModal] = useState(false)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const fetchValues = async () => {
      setLoading(true)
      try {
        const response = await apiMethods.getMachineValues(id)
        setValues(response.data.data || [])
      } catch (error) {
        console.error('Error fetching values:', error)
        setAlerts([{ severity: 'error', message: 'Failed to fetch values' }])
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchValues()
    }
  }, [id])

  const handleAddValue = async (valueData) => {
    try {
      const response = await apiMethods.addMachineValue(id, valueData)
      setValues((prev) => [...prev, response.data.data])
      setShowAddValueModal(false)
      setAlerts([{ severity: 'success', message: 'Value added successfully' }])
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to add value' }])
    }
  }

  const handleEditValue = async (valueId, valueData) => {
    try {
      const response = await apiMethods.updateMachineValue(id, valueId, valueData)
      setValues((prev) => prev.map((value) => (value.id === valueId ? response.data.data : value)))
      setAlerts([{ severity: 'success', message: 'Value updated successfully' }])
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to update value' }])
    }
  }

  const handleDeleteValue = async (valueId) => {
    try {
      await apiMethods.deleteMachineValue(id, valueId)
      setValues((prev) => prev.filter((value) => value.id !== valueId))
      setAlerts([{ severity: 'success', message: 'Value deleted successfully' }])
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to delete value' }])
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Machine Values</h2>
        <ActionButton label="Add Value" onClick={() => setShowAddValueModal(true)} />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {values.map((value) => (
            <div key={value.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{value.field_name}</h3>
                  <p className="text-sm text-gray-600">{value.value}</p>
                </div>
                <ThreeDotMenu
                  value={[
                    {
                      label: 'Edit',
                      icon: cilPen,
                      onClick: () => handleEditValue(value.id, value),
                    },
                    {
                      label: 'Delete',
                      icon: CiCircleAlert,
                      onClick: () => handleDeleteValue(value.id),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddValueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Value</h3>
            {/* Add your value form here */}
            <div className="flex justify-end gap-2 mt-4">
              <ActionButton
                label="Cancel"
                variant="minimal"
                onClick={() => setShowAddValueModal(false)}
              />
              <ActionButton label="Save" onClick={() => handleAddValue({})} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MachineValues
