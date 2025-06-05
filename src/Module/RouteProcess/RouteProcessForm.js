import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FaArrowDown, FaTimes, FaCrosshairs, FaGripVertical } from 'react-icons/fa'

export const RouteProcessForm = ({
  isEdit,
  onSubmit,
  initialData,
  onCancel,
  processData,
  setProcessData,
  processOrder,
  setProcessOrder,
}) => {
  const ItemType = 'CARD'
  const ReorderType = 'REORDER'
  const [formData, setFormData] = useState(
    initialData || {
      route_name: '',
      route_process: [],
    },
  )
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.route_name) {
      alert('Route process name cannot be empty!')
      return
    }
    onSubmit(formData)
    setFormData({
      route_name: '',
      route_process: [],
    })
    setProcessOrder([])
  }

  const handleRouteRemove = (process) => () => {
    setProcessOrder((prev) => prev.filter((item) => item.id !== process.id))
    setProcessData((prev) => {
      const updated = [...prev, process]
      return updated.sort((a, b) => a.id - b.id)
    })
    setFormData((prev) => ({
      ...prev,
      route_process: prev.route_process.filter((item) => item !== process.id),
    }))
  }

  function ProcessDraggable({ process }) {
    const [, drag] = useDrag(() => ({
      type: ItemType,
      item: { process },
    }))

    return (
      <div className="card mt-2 cursor-move" style={{ height: '40px' }} ref={drag}>
        <div
          className="card-body d-flex justify-content-between align-items-center"
          style={{ height: '100%' }}
        >
          <span>{process.process_name}</span>
          <FaGripVertical className="text-muted" />
        </div>
      </div>
    )
  }
  function DraggableDropItem({ process, index, moveCard, isLast }) {
    const ref = useRef(null)

    const [, drop] = useDrop({
      accept: ReorderType,
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveCard(draggedItem.index, index)
          draggedItem.index = index
        }
      },
    })

    const [, drag] = useDrag({
      type: ReorderType,
      item: { index },
    })

    drag(drop(ref))

    return (
      <>
        <div ref={ref} className="card mt-2" style={{ width: '100%', height: '40px' }}>
          <div className="card-body flex justify-between items-center" style={{ height: '100%' }}>
            <span className="text-gray-800">{process.process_name}</span>
            <FaTimes
              className="text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={handleRouteRemove(process)}
            />
          </div>
        </div>
        {!isLast && <FaArrowDown className="text-muted my-1" />}
      </>
    )
  }

  function ProcessDrop({ processOrder, setProcessOrder, setProcessData, setFormData }) {
    const [, drop] = useDrop(() => ({
      accept: ItemType,
      drop: (process) => {
        if (!processOrder.find((p) => p.id === process.process.id)) {
          setProcessOrder((prev) => [...prev, process.process])
          setProcessData((prev) => prev.filter((item) => item.id !== process.process.id))
          setFormData((prev) => ({
            ...prev,
            route_process: [...prev.route_process, process.process.id],
          }))
        }
      },
    }))

    const moveCard = (fromIndex, toIndex) => {
      const updated = [...processOrder]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      setProcessOrder(updated)
      const updatedOrderIds = updated.map((item) => item.id)
      setFormData((prev) => ({
        ...prev,
        route_process: updatedOrderIds,
      }))
    }

    return (
      <div className="card mt-2 cursor-move"  style={{ minHeight: '320px',minWidth:"300px" }} ref={drop}>
        {processOrder.length > 0 ? (
          <div className="card-body d-flex flex-column align-items-center">
            {processOrder.map((process, index) => (
              <DraggableDropItem
                key={process.id}
                process={process}
                index={index}
                moveCard={moveCard}
                isLast={index === processOrder.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="card-body d-flex justify-content-center align-items-center">
            Drop here
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="processName" className="block text-sm font-medium text-gray-700">
              Route Process Name
            </label>
            <input
              type="text"
              id="route_name"
              name="route_name"
              value={formData.route_name}
              placeholder=""
              onChange={handleChange}
              className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
              required
            />
          </div>
        </div>
      <div className="space-y-4 my-3 border border-gray-50 rounded-md p-3" style={{ height: '400px' }}>
  <div className="row h-full">
    {/* Process Column */}
    <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12 flex flex-col h-full">
      <h5 className="text-center mb-2 bg-white sticky top-0 z-10">Process</h5>
      <div className="overflow-y-auto flex-1 pr-2">
        {processData.map((process) => (
          <ProcessDraggable key={process.id} process={process} />
        ))}
      </div>
    </div>

    {/* Divider */}
    <div className="d-none d-md-flex justify-content-center align-items-start col-md-1">
      <div style={{ borderLeft: '1px solid #ccc', height: '100%' }}></div>
    </div>

    {/* Route Process Column */}
    <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12 flex flex-col h-full">
      <h5 className="text-center mb-2 bg-white sticky top-0 z-10">Route Process</h5>
      <div className="overflow-y-auto flex-1 pl-2">
        <ProcessDrop
          processOrder={processOrder}
          setProcessOrder={setProcessOrder}
          setProcessData={setProcessData}
          setFormData={setFormData}
        />
      </div>
    </div>
  </div>
</div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-black bg-white w-20 rounded p-1 shadow-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md hover:bg-[#6b4fd1]"
          >
            Save
          </button>
        </div>
      </form>
    </>
  )
}
