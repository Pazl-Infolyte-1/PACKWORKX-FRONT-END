import { useEffect, useMemo, useState } from 'react'
import apiMethods from '../../api/config'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import {
  ArrowRight,
  ChevronDown,
  Edit3,
  GripVertical,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'

function ProcessRoutes({ openRoutes, setOpenRoutes, setAlerts }) {
  const [routeProcessDetails, setRouteProcessDetails] = useState([])
  const [allProcess, setAllProcess] = useState([])
  const [selectedProcesses, setSelectedProcesses] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [draggingItem, setDraggingItem] = useState(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await apiMethods.getRouteList()
        setRouteProcessDetails(response?.data?.machineRouteProcesses || [])
      } catch (error) {
        console.error('Failed to fetch route data:', error)
      }
    }

    fetchRoutes()
  }, [])

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await apiMethods.getByMachineId(openRoutes?.id)
        setAllProcess(
          response?.data?.data?.map((p) => ({
            id: p.process_id || p.id,
            process_name: p.process_name,
          })) || [],
        )
      } catch (error) {
        console.error('Failed to fetch route data:', error)
      }
    }
    fetchProcess()
  }, [openRoutes?.id])

  const processRoute = useMemo(() => {
    return routeProcessDetails.find((route) => route.machine_id === openRoutes?.id)
  }, [routeProcessDetails, openRoutes?.id])

  useEffect(() => {
    if (processRoute) {
      setSelectedProcesses(processRoute.machine_route_process || [])
    } else {
      setSelectedProcesses([])
    }
  }, [processRoute])

  const availableProcesses = useMemo(() => {
    return allProcess.filter((p) => {
      if (isEdit || !processRoute) {
        return !selectedProcesses.some((sp) => sp.id === p.id)
      }
      return !processRoute.machine_route_process.some((rp) => rp.id === p.id)
    })
  }, [allProcess, selectedProcesses, processRoute, isEdit])

  const handleDragStart = (e, process, source) => {
    setDraggingItem({ process, source })
    e.dataTransfer.setData('text/plain', process.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, target, dropIndex = null) => {
    e.preventDefault()
    if (!draggingItem) return

    if (target === 'selected' && draggingItem.source === 'available') {
      setSelectedProcesses([...selectedProcesses, draggingItem.process])
    } else if (target === 'available' && draggingItem.source === 'selected') {
      setSelectedProcesses(selectedProcesses.filter((p) => p.id !== draggingItem.process.id))
    } else if (target === 'selected' && draggingItem.source === 'selected') {
      const draggedIndex = selectedProcesses.findIndex((p) => p.id === draggingItem.process.id)
      const targetDropIndex =
        dropIndex !== null ? dropIndex : Number(e.currentTarget?.dataset?.index || 0)

      if (draggedIndex !== targetDropIndex) {
        const newSelected = [...selectedProcesses]
        const [removed] = newSelected.splice(draggedIndex, 1)
        newSelected.splice(targetDropIndex, 0, removed)
        setSelectedProcesses(newSelected)
      }
    }

    setDraggingItem(null)
  }

  const saveProcesses = async () => {
    try {
      const payload = {
        machine_id: openRoutes?.id,
        machine_route_process: selectedProcesses.map((process) => {
          const fullProcess = allProcess.find((p) => p.id === process.id)
          return fullProcess?.process_id || process.id
        }),
      }

      let response
      if (isEdit) {
        response = await apiMethods.updateRouteProcesses(processRoute?.id, payload)
      } else {
        response = await apiMethods.saveRouteProcesses(payload)
      }

      setIsEdit(false)
      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'Saved successfully',
        },
      ])
      // Refresh the data
      const routes = await apiMethods.getRouteList()
      setRouteProcessDetails(routes?.data?.machineRouteProcesses || [])
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Something went wrong',
        },
      ])
      console.error('Failed to save processes:', error)
    }
  }

  const handleDelete = async () => {
    const deleteProcessRoute = await apiMethods.deleteRoute(processRoute?.id)
     setAlerts([
        {
          severity: 'success',
          message: deleteProcessRoute?.data?.message || 'Something went wrong',
        },
      ])
    setOpenDeleteModal(false)
    const response = await apiMethods.getRouteList()
    setRouteProcessDetails(response?.data?.machineRouteProcesses || [])
    setSelectedProcesses([])
  }

  const handleCancel = () => {
    setIsEdit(false)
    if (processRoute) {
      setSelectedProcesses(processRoute.machine_route_process || [])
    } else {
      setSelectedProcesses([])
      setOpenRoutes({ show: false, id: null })
    }
  }

  // Show edit UI when in edit mode or when there's no process route
  if (isEdit || !processRoute) {
    return (
      <div className="max-h-[70vh] bg-gray-50 overflow-y-scroll">
        <div className="max-w-7xl mx-auto p-3">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-base  text-gray-900 ">Configure Process Route</h1>
            <p className="text-xs text-gray-600">Drag and drop processes to create your route</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Available Processes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-600" />
                  <h2 className="text-sm font-medium text-gray-900">Available Processes</h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {availableProcesses.length}
                  </span>
                </div>
              </div>
              <div
                className="p-2 min-h-[300px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'available')}
              >
                {availableProcesses.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No processes available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableProcesses.map((process) => (
                      <div
                        key={process.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, process, 'available')}
                        className="group flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                          {process.process_name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Processes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                  <h2 className="text-sm font-medium text-gray-900">Process Route</h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {selectedProcesses.length}
                  </span>
                </div>
              </div>
              <div
                className="p-2 min-h-[300px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'selected')}
              >
                {selectedProcesses.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                    <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-1">Drop processes here</p>
                    <p className="text-xs text-gray-400">Create your process sequence</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProcesses.map((process, index) => (
                      <div key={process.id}>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, process, 'selected')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'selected', index)}
                          className="group flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-all duration-200"
                          data-index={index}
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-semibold rounded-full">
                            {index + 1}
                          </div>
                          <GripVertical className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 flex-1">
                            {process.process_name}
                          </span>
                        </div>
                        {index !== selectedProcesses.length - 1 && (
                          <div className="flex justify-center">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-2 space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={saveProcesses}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Route</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show display UI when not in edit mode and process route exists
  return (
    <>
      <div className="max-h-[70vh] overflow-y-scroll bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">Process Route</h1>
              <p className="text-sm text-gray-600">{openRoutes?.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEdit(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setOpenDeleteModal(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Process Flow */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-3">
              {selectedProcesses.length > 0 ? (
                <div className="space-y-2">
                  {selectedProcesses.map((process, index) => (
                    <div key={process.id}>
                      <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-semibold rounded-full flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {process.process_name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Step {index + 1} of {selectedProcesses.length}
                          </p>
                        </div>
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      {index !== selectedProcesses.length - 1 && (
                        <div className="flex justify-center">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    No processes configured
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Get started by adding processes to this route
                  </p>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Processes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ConfirmationModale
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </div>
    </>
  )
}

export default ProcessRoutes
