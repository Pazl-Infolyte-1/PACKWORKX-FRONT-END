import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ProductionPlanningChart.css'
import { productionPlanningApi } from '../../api/productionPlanning'
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa'

const ProductionPlanningChart = ({ employeesData, machinesData, groupsData, setAlerts }) => {
  const unifiedRows = useMemo(() => {
    const maxLength = Math.max(employeesData.length, machinesData.length, groupsData.length)
    return Array.from({ length: maxLength }, (_, i) => ({
      employeeGroup: employeesData[i] || '',
      machine: machinesData[i] || '',
      groupQty: groupsData[i] || '',
      id: i,
    }))
  }, [employeesData, machinesData, groupsData])

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  console.log('unifiedRows', unifiedRows)
  useEffect(() => {
    if (employeesData.length && machinesData.length && groupsData.length) {
      fetchEvents()
    }
  }, [selectedDate, employeesData, machinesData, groupsData])

  const convertToHour = (timeStr) => {
    const [time, meridian] = timeStr.split(' ')
    let [hours] = time.split(':').map(Number)
    if (meridian === 'AM' && hours === 12) hours = 0
    if (meridian === 'PM' && hours !== 12) hours += 12
    return hours
  }

  const fetchEvents = async () => {
    try {
      const response = await productionPlanningApi.getProductionPlanningByDate(selectedDate)
      const apiEvents = response.data?.data || []

      const transformed = apiEvents.map((item) => {
        const rowId = unifiedRows.findIndex((r) => r.employeeGroup?.id === item.employee_id)

        const labels = []
        if (item.employee_id) labels.push({ employeeGroup: item.employee_id })
        if (item.machine_id) labels.push({ machine: item.machine_id })
        if (item.group_id) labels.push({ groupQty: item.group_id })

        return {
          id: item.id,
          rowId,
          hour: convertToHour(item.start_time), // ✅ Corrected
          endHour: convertToHour(item.end_time), // ✅ Corrected
          employee_id: item.employee_id,
          machine_id: item.machine_id,
          group_id: item.group_id,
          task_name: item.task_name,
          production_schedule_generate_id: item.production_schedule_generate_id,
          date: item.date,
          start_time: item.start_time,
          end_time: item.end_time,
          status: item.status,
          notes: item.notes,
          color: getRandomColor(),
          labels,
        }
      })

      console.log('transformed', transformed)

      setEvents(transformed)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const hourOptions = Array.from({ length: 25 }, (_, i) => {
    const suffix = i === 24 || i < 12 ? 'AM' : 'PM'
    const hour12 = i % 12 === 0 ? 12 : i % 12
    return {
      value: i === 24 ? 0 : i,
      label: `${hour12}:00 ${suffix}`,
    }
  })

  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draggingEvent, setDraggingEvent] = useState(null)
  const [resizeData, setResizeData] = useState(null)
  const [justResized, setJustResized] = useState(false)
  const [dragSourceRowId, setDragSourceRowId] = useState(null)

  const startResize = (e, event, direction) => {
    e.preventDefault()
    e.stopPropagation()
    const cellWidth = document.querySelector('.time-slot')?.offsetWidth || 40
    try {
      e.target.setPointerCapture(e.pointerId)
    } catch (err) {
      console.warn('Pointer capture failed', err)
    }
    setResizeData({
      event,
      direction,
      startX: e.clientX,
      originalHour: event.hour,
      originalEndHour: event.endHour ?? event.hour + 1,
      cellWidth,
    })
    document.body.style.cursor = 'ew-resize'
  }

  const formatHour = (hour) => {
    const normalizedHour = hour % 24
    const suffix = normalizedHour >= 12 ? 'PM' : 'AM'
    const hour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12
    return `${hour12}:00 ${suffix}`
  }

  const updatedResizeEventRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!resizeData) return

    const deltaX = e.clientX - resizeData.startX
    const hourDelta = deltaX / resizeData.cellWidth

    const originalStart = resizeData.originalHour
    const originalEnd = resizeData.originalEndHour

    let newStart = originalStart
    let newEnd = originalEnd

    if (resizeData.direction === 'left') {
      newStart = Math.max(0, originalStart + Math.round(hourDelta))
      if (originalEnd - newStart < 1) return
    } else if (resizeData.direction === 'right') {
      newEnd = Math.min(24, originalEnd + Math.round(hourDelta))
      if (newEnd - originalStart < 1) return
    }

    const currentEv = events.find((ev) => ev.id === resizeData.event.id) || resizeData.event
    const updatedEvent = {
      ...currentEv,
      hour: newStart,
      endHour: newEnd,
    }

    updatedResizeEventRef.current = updatedEvent

    setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)))
  }

  const handleMouseUp = () => {
    if (updatedResizeEventRef.current) {
      handleEdit(updatedResizeEventRef.current)
      updatedResizeEventRef.current = null
    }
    setResizeData(null)
    setJustResized(true)
    document.body.style.cursor = ''
  }

  useEffect(() => {
    if (justResized) {
      const timeout = setTimeout(() => {
        setJustResized(false)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [justResized])

  useEffect(() => {
    if (!resizeData) return
    const handlePointerMove = (e) => handleMouseMove(e)
    const handlePointerUp = (e) => {
      handleMouseUp(e)
    }
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [resizeData])

  const handleDragStart = (e, itemType, value) => {
    const source = unifiedRows.find((r) => {
      if (itemType === 'employeeGroup') return r.employeeGroup.employee_name === value
      if (itemType === 'machine') return r.machine.machine_name === value
      if (itemType === 'groupQty') return r.groupQty.group_name === value
      return false
    })
    if (source) {
      setDragSourceRowId(source.id)
    }
    e.dataTransfer.setData('application/json', JSON.stringify({ itemType, value }))
  }

  const handleDrop = (e, rowId, hour) => {
    const row = unifiedRows.find((r) => r.id === rowId)
    if (!row) return

    e.preventDefault()

    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return

    const { itemType, value } = JSON.parse(raw)

    // ❗ Block drop if employeeGroup does NOT match the current row’s employee
    if (itemType === 'employeeGroup' && row.employeeGroup?.id !== value) {
      setAlerts((prev) => [
        ...prev,
        { severity: 'warning', message: 'This employee does not match the current row.' },
      ])
      return
    }

    setEvents((prev) => {
      const existingEvent = prev.find((ev) => ev.rowId === rowId && ev.hour === hour)
      const newLabelObj = { [itemType]: value }

      if (existingEvent) {
        const updatedEvent = { ...existingEvent }

        const isAlreadyPresent = updatedEvent.labels?.some((label) => label[itemType] === value)

        // 🔒 Prevent multiple machine/group entries
        if (
          (itemType === 'machine' && updatedEvent.machine_id) ||
          (itemType === 'groupQty' && updatedEvent.group_id)
        ) {
          setAlerts((prev) => [
            ...prev,
            {
              severity: 'warning',
              message: `Cannot assign multiple ${itemType === 'machine' ? 'machines' : 'groups'} to a single event.`,
            },
          ])
          return prev
        }

        if (!isAlreadyPresent) {
          updatedEvent.labels = [...(updatedEvent.labels || []), newLabelObj]
        }

        if (itemType === 'employeeGroup') updatedEvent.employee_id = value
        if (itemType === 'machine') updatedEvent.machine_id = value
        if (itemType === 'groupQty') updatedEvent.group_id = value

        if (updatedEvent.employee_id && updatedEvent.machine_id && updatedEvent.group_id) {
          postProductionEvent(updatedEvent)
        }

        return prev.map((ev) => (ev.id === existingEvent.id ? updatedEvent : ev))
      } else {
        const newEvent = {
          rowId,
          hour,
          endHour: hour + 1,
          color: getRandomColor(),
          labels: [newLabelObj],
          task_name: '',
          date: selectedDate,
          start_time: formatHour(hour),
          end_time: formatHour(hour + 1),
          status: 'Scheduled',
          notes: '',
        }

        if (itemType === 'employeeGroup') newEvent.employee_id = value
        if (itemType === 'machine') newEvent.machine_id = value
        if (itemType === 'groupQty') newEvent.group_id = value

        if (newEvent.employee_id && newEvent.machine_id && newEvent.group_id) {
          postProductionEvent(newEvent)
        }

        return [...prev, newEvent]
      }
    })
  }

  const postProductionEvent = (event) => {
    const payload = {
      employee_id: event.employee_id,
      machine_id: event.machine_id,
      group_id: event.group_id,
      task_name: '',
      date: selectedDate,
      start_time: formatHour(event.hour),
      end_time: formatHour(event.endHour || event.hour + 1),
      notes: '',
    }

    productionPlanningApi
      .addProductionPlanning(payload)
      .then((res) => console.log('API success', res))
      .catch((err) => console.error('API error', err))
  }

  const handleDragOver = (e) => e.preventDefault()

  const getEventsForCell = (rowId, hour) => {
    return events.find((ev) => ev.rowId === rowId && ev.hour === hour)
  }

  const getRandomColor = () => {
    const colors = [
      '#ea7a57', // coral
      '#7fa900', // olive green
      '#5978ee', // periwinkle
      '#fec200', // gold
      '#df5286', // pink
      '#00bdae', // teal
      '#865fcf', // violet
      '#1aaa55', // green
      '#710193', // deep purple
      '#2d9cdb', // sky blue
      '#27ae60', // emerald
      '#f39c12', // orange
      '#8e44ad', // plum
      '#e74c3c', // red
      '#16a085', // dark teal
      '#3498db', // bright blue
      '#9b59b6', // light purple
      '#f1c40f', // bright yellow
      '#34495e', // navy gray
      '#e67e22', // pumpkin
      '#1abc9c', // aqua green
      '#2ecc71', // mint green
      '#95a5a6', // gray
    ]

    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getEventDuration = (event) => {
    return (event.endHour || event.hour + 1) - event.hour
  }

  const shouldSkipCell = (rowId, hour) => {
    if (
      draggingEvent &&
      draggingEvent.rowId === rowId &&
      hour >= draggingEvent.hour &&
      hour < (draggingEvent.endHour || draggingEvent.hour + 1)
    ) {
      return false
    }
    return events.some(
      (ev) => ev.rowId === rowId && ev.hour < hour && (ev.endHour || ev.hour + 1) > hour,
    )
  }

  const handleEdit = async (selectedEvent) => {
    if (selectedEvent.id) {
      const payload = {
        employee_id: selectedEvent.employee_id,
        machine_id: selectedEvent.machine_id,
        group_id: selectedEvent.group_id,
        task_name: selectedEvent.task_name || '',
        date: selectedDate,
        start_time: formatHour(selectedEvent.hour),
        end_time: formatHour(selectedEvent.endHour || selectedEvent.hour + 1),
        notes: selectedEvent.notes || '',
      }

      try {
        const res = await productionPlanningApi.updateProductionPlanning(selectedEvent.id, payload)
        console.log('API success', res)
        setEvents((prev) => prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev)))
      } catch (error) {
        console.error('API error', error)
      }

      setSelectedEvent(null)
      setIsEditing(false)
    }
  }

  const handleDeleteEvent = async (event) => {
    if (event.id) {
      try {
        const res = await productionPlanningApi.deleteProductionPlanning(event.id)
        console.log('API success', res)

        setEvents((prevEvents) => prevEvents.filter((ev) => ev.id !== event.id))
      } catch (error) {
        console.error('API error', error)
      }
    } else {
      setEvents((prevEvents) =>
        prevEvents.filter(
          (ev) =>
            !(ev.rowId === event.rowId && ev.hour === event.hour && ev.endHour === event.endHour),
        ),
      )
    }

    setSelectedEvent(null)
  }

  return (
    <div className="scheduler-container">
      <div className="scheduler-table-wrapper">
        <table className="scheduler-table">
          <thead>
            {/* Date Picker Row */}
            <tr>
              <th colSpan={hours.length + 3} className="date-header-sticky">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Date:</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </th>
            </tr>

            {/* Header Row */}
            <tr className="header-row">
              <th className="sticky-col sticky-employee header-sticky">Employee</th>
              <th className="sticky-col sticky-machine header-sticky">Machine</th>
              <th className="sticky-col sticky-quantity header-sticky">Group Qty</th>
              {hours.map((hour) => (
                <th className="header-sticky" key={hour}>
                  {hour === 0
                    ? '12 AM'
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? '12 PM'
                        : `${hour - 12} PM`}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {unifiedRows.map((row, i) => (
              <tr key={row.id || i}>
                <td
                  className="sticky-col sticky-employee draggable-cell"
                  draggable={!!row.employeeGroup?.id}
                  onDragStart={(e) => {
                    if (row.employeeGroup?.id) {
                      handleDragStart(e, 'employeeGroup', row.employeeGroup?.id)
                    }
                  }}
                >
                  {row.employeeGroup?.employee_name || ''}
                </td>

                <td
                  className="sticky-col sticky-machine draggable-cell"
                  draggable={!!row.machine?.id}
                  onDragStart={(e) => {
                    if (row.machine?.id) {
                      handleDragStart(e, 'machine', row.machine?.id)
                    }
                  }}
                >
                  {row.machine?.machine_name || ''}
                </td>

                <td
                  className="sticky-col sticky-quantity draggable-cell"
                  draggable={!!row.groupQty?.id}
                  onDragStart={(e) => {
                    if (row.groupQty?.id) {
                      handleDragStart(e, 'groupQty', row.groupQty?.id)
                    }
                  }}
                >
                  {row?.groupQty?.group_name || ''}
                </td>

                {hours.map((hour) => {
                  if (shouldSkipCell(row.id, hour)) return null

                  const event = getEventsForCell(row.id, hour)
                  const colSpan = event ? getEventDuration(event) : 1

                  return (
                    <td
                      key={hour}
                      onDrop={(e) => handleDrop(e, row.id, hour)}
                      onDragOver={handleDragOver}
                      className="time-slot"
                      colSpan={colSpan}
                    >
                      {event && (
                        <div
                          className="event"
                          style={{ backgroundColor: event.color }}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation()
                            setDraggingEvent({
                              ...event,
                              hour: event.hour,
                              endHour: event.endHour ?? event.hour + 1,
                            })
                          }}
                          onClick={(e) => {
                            if (justResized) {
                              e.preventDefault()
                              e.stopPropagation()
                              return
                            }
                            setSelectedEvent(event)
                          }}
                        >
                          <div
                            className="resize-handle left"
                            onMouseDown={(e) => startResize(e, event, 'left')}
                          />
                          <div
                            className="resize-handle right"
                            onMouseDown={(e) => startResize(e, event, 'right')}
                          />
                          <div className="event-labels">
                            {event.labels.map((labelObj, i) => {
                              const [type, id] = Object.entries(labelObj)[0]

                              let displayText = ''
                              if (type === 'employeeGroup') {
                                displayText =
                                  employeesData.find((emp) => emp.id === id)?.employee_name ||
                                  `Emp#${id}`
                              } else if (type === 'machine') {
                                displayText =
                                  machinesData.find((mac) => mac.id === id)?.machine_name ||
                                  `Mach#${id}`
                              } else if (type === 'groupQty') {
                                displayText =
                                  groupsData.find((grp) => grp.id === id)?.group_name ||
                                  `Group#${id}`
                              }

                              return (
                                <div
                                  key={i}
                                  className="event-label flex justify-start overflow-hidden text-ellipsis whitespace-nowrap block"
                                >
                                  {displayText}
                                </div>
                              )
                            })}
                          </div>

                          <div className="event-time">
                            {formatHour(event.hour)} - {formatHour(event.endHour || event.hour + 1)}
                          </div>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popups remain the same */}
      {selectedEvent && !isEditing && (
        <div
          className="popup-overlay"
          onClick={() => {
            setSelectedEvent(null)
          }}
        >
          <div className="popup-card wide-card" onClick={(e) => e.stopPropagation()}>
            {/* Header: Task + Icons */}
            <div className="popup-header">
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold">
                  {selectedEvent.task_name ? selectedEvent.task_name : 'Event'}
                </span>
                <div className="popup-icons flex gap-2 text-gray-600 text-lg">
                  <FaEdit
                    title="Edit"
                    className="cursor-pointer hover:text-blue-500 transition"
                    onClick={() => setIsEditing(true)}
                  />
                  <FaTrash
                    title="Delete"
                    className="cursor-pointer hover:text-red-500 transition"
                    onClick={() => handleDeleteEvent(selectedEvent)}
                  />
                  <FaTimes
                    title="Close"
                    className="cursor-pointer hover:text-gray-800 transition"
                    onClick={() => setSelectedEvent(null)}
                  />
                </div>
              </div>
            </div>

            {/* Separate row: ID under task name */}
            {selectedEvent.production_schedule_generate_id && (
              <div className="p-1">
                <p className="text-xs text-gray-500 mb-1">
                  ID: {selectedEvent.production_schedule_generate_id}
                </p>
              </div>
            )}

            <div
              className="popup-content p-2"
              style={{ borderLeft: `6px solid ${selectedEvent.color}` }}
            >
              {(() => {
                const employeeGroupLabels = selectedEvent.labels
                  .filter((label) => 'employeeGroup' in label)
                  .map((label) => {
                    const employee = employeesData.find((e) => e.id === label.employeeGroup)
                    return employee?.employee_name || `ID ${label.employeeGroup}`
                  })

                const machineLabels = selectedEvent.labels
                  .filter((label) => 'machine' in label)
                  .map((label) => {
                    const machine = machinesData.find((m) => m.id === label.machine)
                    return machine?.machine_name || `ID ${label.machine}`
                  })

                const qtyLabels = selectedEvent.labels
                  .filter((label) => 'groupQty' in label)
                  .map((label) => {
                    const group = groupsData.find((g) => g.id === label.groupQty)
                    return group?.group_name || `ID ${label.groupQty}`
                  })

                return (
                  <div className="space-y-1">
                    {employeeGroupLabels.length > 0 && (
                      <div className="flex">
                        <div className="w-32 font-semibold">Employee:</div>
                        <div>{employeeGroupLabels.join(', ')}</div>
                      </div>
                    )}
                    {machineLabels.length > 0 && (
                      <div className="flex">
                        <div className="w-32 font-semibold">Machine:</div>
                        <div>{machineLabels.join(', ')}</div>
                      </div>
                    )}
                    {qtyLabels.length > 0 && (
                      <div className="flex">
                        <div className="w-32 font-semibold">Grouped Qty:</div>
                        <div>{qtyLabels.join(', ')}</div>
                      </div>
                    )}
                    <div className="flex">
                      <div className="w-32 font-semibold">Notes:</div>
                      <div>{selectedEvent.notes || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-32 font-semibold">Time:</div>
                      <div>
                        {formatHour(selectedEvent.hour)} -{' '}
                        {formatHour(selectedEvent.endHour || selectedEvent.hour + 1)}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {selectedEvent && isEditing && (
        <div
          className="popup-overlay"
          onClick={() => {
            setSelectedEvent(null)
            setIsEditing(false)
          }}
        >
          <div className="edit-popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>

            <div className="popup-content">
              <div className="field-group">
                <label>Task Name:</label>
                <input
                  className="styled-input"
                  value={selectedEvent.task_name}
                  onChange={(e) =>
                    setSelectedEvent((prev) => ({
                      ...prev,
                      task_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="field-group">
                <label>Employee:</label>
                <select
                  className="styled-select"
                  disabled
                  value={
                    selectedEvent.labels.find((label) => 'employeeGroup' in label)?.employeeGroup ||
                    ''
                  }
                  onChange={(e) => {
                    const id = parseInt(e.target.value)
                    setSelectedEvent((prev) => ({
                      ...prev,
                      labels: [
                        { employeeGroup: id },
                        ...prev.labels.filter((label) => !('employeeGroup' in label)),
                      ],
                      employee_id: id,
                    }))
                  }}
                >
                  <option value="">-- Select Employee Group --</option>
                  {employeesData.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.employee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Machine:</label>
                <select
                  className="styled-select"
                  value={selectedEvent.labels.find((label) => 'machine' in label)?.machine || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value)
                    setSelectedEvent((prev) => ({
                      ...prev,
                      labels: [
                        { machine: id },
                        ...prev.labels.filter((label) => !('machine' in label)),
                      ],
                      machine_id: id,
                    }))
                  }}
                >
                  <option value="">-- Select Machine --</option>
                  {machinesData.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.machine_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Planned Qty:</label>
                <select
                  className="styled-select"
                  value={selectedEvent.labels.find((label) => 'groupQty' in label)?.groupQty || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value)
                    setSelectedEvent((prev) => ({
                      ...prev,
                      labels: [
                        { groupQty: id },
                        ...prev.labels.filter((label) => !('groupQty' in label)),
                      ],
                      group_id: id,
                    }))
                  }}
                >
                  <option value="">-- Select Planned Qty --</option>
                  {groupsData.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="time-selects">
                <div className="field-group">
                  <label>From (hour):</label>
                  <select
                    className="styled-select"
                    value={selectedEvent.hour}
                    onChange={(e) => {
                      const newFrom = parseInt(e.target.value, 10)
                      setSelectedEvent((prev) => {
                        // ensure the end is at least newFrom + 1
                        const minEnd = newFrom + 1
                        return {
                          ...prev,
                          hour: newFrom,
                          endHour: Math.max(prev.endHour ?? prev.hour + 1, minEnd),
                        }
                      })
                    }}
                  >
                    {hourOptions.slice(0, 24).map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label>To (hour):</label>
                  <select
                    className="styled-select"
                    value={selectedEvent.endHour || selectedEvent.hour + 1}
                    onChange={(e) =>
                      setSelectedEvent((prev) => ({
                        ...prev,
                        endHour: parseInt(e.target.value),
                      }))
                    }
                  >
                    {hourOptions.slice(selectedEvent.hour + 1, 25).map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label>Notes:</label>
                <textarea
                  rows={2}
                  className="styled-input"
                  value={selectedEvent.notes}
                  onChange={(e) =>
                    setSelectedEvent((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="sticky-footer">
              <button
                className="btn-save"
                onClick={() => {
                  console.log('Save clicked', selectedEvent)
                  handleEdit(selectedEvent)
                }}
              >
                Save
              </button>

              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductionPlanningChart
