import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ProductionPlanningChart.css'
import { productionPlanningApi } from '../../api/productionPlanning'
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ConfirmationModale from '../../components/New/ConfirmationModale'

const ProductionPlanningChart = ({
  employeesData,
  machinesData,
  groupsData,
  setAlerts,
  selectedFilter,
  setSelectedFilter,
}) => {
  const [timelineOption, setTimelineOption] = useState('today')
  const [customDays, setCustomDays] = useState(1)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draggingEvent, setDraggingEvent] = useState(null)
  const [resizeData, setResizeData] = useState(null)
  const [justResized, setJustResized] = useState(false)
  const [dragSourceRowId, setDragSourceRowId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showGroupDetails, setShowGroupDetails] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState({})
  const tableContainerRef = useRef(null)

  const updatedResizeEventRef = useRef(null)

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

  useEffect(() => {
    if (employeesData.length && machinesData.length && groupsData.length) {
      fetchEvents()
    }
  }, [selectedDate, employeesData, machinesData, groupsData, selectedFilter])

  const formatLocalDate = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000
    const localDate = new Date(date.getTime() - offsetMs)
    return localDate.toISOString().split('T')[0]
  }

  const formatHour = (hour) => {
    const normalizedHour = hour % 24
    const suffix = normalizedHour >= 12 ? 'PM' : 'AM'
    const hour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12
    return `${hour12}:00 ${suffix}`
  }

  function formatDateToCustomDisplay(isoString) {
    const date = new Date(isoString)
    const options = {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata', // Adjust if needed
    }

    const formatted = date.toLocaleString('en-US', options)
    const [monthDay, time] = formatted.split(', ')
    const [month, day] = monthDay.split(' ')

    return `${day} ${month}, ${time}`
  }

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString)
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60000)

    return localDate.toISOString().slice(0, 16)
  }

  function toLocalISOString(date) {
    const pad = (n) => (n < 10 ? '0' + n : n)
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
    )
  }

  const toLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fetchEvents = async () => {
    let params = {}

    if (timelineOption === 'today') {
      params.date = selectedDate
    } else if (timelineOption === 'thisWeek') {
      params.thisWeek = true
    } else if (timelineOption === 'thisMonth') {
      params.thisMonth = true
    } else if (timelineOption === 'custom' && startDate && endDate) {
      params.startDate = formatLocalDate(startDate)
      params.endDate = formatLocalDate(endDate)
    } else if (timelineOption === 'year') {
      params.year = new Date().getFullYear()
    }

    try {
      const response = await productionPlanningApi.getProductionPlanningByTimeline(params)
      const schedule_data = response.data?.data || []
      const apiEvents =
        selectedFilter === 'completed'
          ? schedule_data.filter((item) => item.production_status == 'completed') || []
          : selectedFilter === 'in_progress'
            ? schedule_data.filter((item) => item.production_status == 'in_progress') || []
            : schedule_data

      const transformed = apiEvents.map((item) => {
        const start = new Date(item.start_time)
        const end = new Date(item.end_time)

        let timelineStart = new Date(selectedDate)
        timelineStart.setHours(0, 0, 0, 0)

        if (timelineOption === 'thisWeek') {
          const dayOfWeek = timelineStart.getDay()
          timelineStart.setDate(timelineStart.getDate() - dayOfWeek)
          timelineStart.setHours(0, 0, 0, 0)
        } else if (timelineOption === 'custom' && startDate) {
          timelineStart = new Date(startDate)
          timelineStart.setHours(0, 0, 0, 0)
        }

        const hour = Math.floor((start - timelineStart) / (1000 * 60 * 60))
        const endHour = Math.ceil((end - timelineStart) / (1000 * 60 * 60))

        const labels = []
        if (item.employee_id) labels.push({ employeeGroup: item.employee_id })
        if (item.machine_id) labels.push({ machine: item.machine_id })
        if (item.group_id) labels.push({ groupQty: item.group_id })

        let color = '#ea7a57'
        const now = new Date()

        if (now > end) {
          if (item.production_status === 'completed') {
            color = '#DCFCE7'
          } else if (item.production_status === 'in_progress') {
            color = '#ea7a57'
          }
        } else if (start > now) {
          color = '#fec200'
        } else if (now >= start && now <= end) {
          color = '#5978ee'
        }

        const rowId = unifiedRows.findIndex((r) => r.employeeGroup?.id === item.employee_id)

        return {
          id: item.id,
          rowId,
          hour,
          endHour,
          employee_id: item.employee_id,
          machine_id: item.machine_id,
          group_id: item.group_id,
          task_name: item.task_name,
          production_schedule_generate_id: item.production_schedule_generate_id,
          date: item.date,
          start_time: item.start_time,
          end_time: item.end_time,
          status: item.production_status,
          notes: item.notes,
          total_quantity: item.group_total_quantity,
          manufactured_quantity: item.group_manufactured_quantity,
          balance_quantity: item.group_balanced_quantity,
          color,
          labels,
        }
      })

      setEvents(transformed)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    if (
      (timelineOption === 'custom' && startDate && endDate) ||
      timelineOption === 'today' ||
      timelineOption === 'thisWeek' ||
      timelineOption === 'thisMonth' ||
      timelineOption === 'year'
    ) {
      fetchEvents()
    }
  }, [timelineOption, startDate, endDate])

  const selectedDays =
    timelineOption === 'today'
      ? 1
      : timelineOption === 'thisWeek'
        ? 7
        : timelineOption === 'custom' && startDate && endDate
          ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
          : 1

  const weekStart =
    timelineOption === 'thisWeek'
      ? dayjs().startOf('week') // Sunday
      : timelineOption === 'custom' && startDate
        ? dayjs(startDate)
        : dayjs(selectedDate)

  const hours = useMemo(() => {
    let days = 1
    if (timelineOption === 'thisWeek') days = 7
    else if (timelineOption === 'custom') days = customDays

    return Array.from({ length: 24 * days }, (_, i) => i)
  }, [timelineOption, customDays])

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
      event: JSON.parse(JSON.stringify(event)),
      direction,
      startX: e.clientX,
      originalHour: event.hour,
      originalEndHour: event.endHour ?? event.hour + 1,
      cellWidth,
    })
    document.body.style.cursor = 'ew-resize'
  }

  const handleMouseMove = (e) => {
    if (!resizeData) return

    const deltaX = e.clientX - resizeData.startX
    const hourDelta = deltaX / resizeData.cellWidth

    const originalStart = resizeData.originalHour
    const originalEnd = resizeData.originalEndHour

    let newStart = originalStart
    let newEnd = originalEnd

    if (resizeData.direction === 'left') {
      newStart = Math.round(originalStart + hourDelta)
      if (originalEnd - newStart < 1) return
    } else if (resizeData.direction === 'right') {
      newEnd = Math.round(originalEnd + hourDelta)
      if (newEnd - originalStart < 1) return
    }

    let timelineStart = new Date(selectedDate)
    timelineStart.setHours(0, 0, 0, 0)

    if (timelineOption === 'thisWeek') {
      const dayOfWeek = timelineStart.getDay()
      timelineStart.setDate(timelineStart.getDate() - dayOfWeek)
      timelineStart.setHours(0, 0, 0, 0)
    } else if (timelineOption === 'custom' && startDate) {
      timelineStart = new Date(startDate)
      timelineStart.setHours(0, 0, 0, 0)
    }

    const startTime = new Date(timelineStart.getTime() + newStart * 60 * 60 * 1000)
    const endTime = new Date(timelineStart.getTime() + newEnd * 60 * 60 * 1000)

    const originalEv = resizeData.event

    // 🔒 Overlap Protection
    const overlapping = events.find(
      (ev) =>
        ev.id !== originalEv.id &&
        ev.rowId === originalEv.rowId &&
        ((newStart >= ev.hour && newStart < (ev.endHour || ev.hour + 1)) ||
          (newEnd > ev.hour && newEnd <= (ev.endHour || ev.hour + 1)) ||
          (newStart <= ev.hour && newEnd >= (ev.endHour || ev.hour + 1))),
    )

    if (overlapping) return

    const updatedEvent = {
      ...originalEv,
      hour: newStart,
      endHour: newEnd,
      start_time: toLocalISOString(startTime),
      end_time: toLocalISOString(endTime),
      date: toLocalDateString(startTime),
    }

    updatedResizeEventRef.current = updatedEvent

    setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)))
  }

  const handleMouseUp = () => {
    if (updatedResizeEventRef.current) {
      handleResizeEdit(updatedResizeEventRef.current)
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
    e.preventDefault()
    const row = unifiedRows.find((r) => r.id === rowId)
    if (!row) return

    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return

    const parsedData = JSON.parse(raw)

    let timelineStart = new Date(selectedDate)
    timelineStart.setHours(0, 0, 0, 0)

    if (timelineOption === 'thisWeek') {
      const dayOfWeek = timelineStart.getDay()
      timelineStart.setDate(timelineStart.getDate() - dayOfWeek)
      timelineStart.setHours(0, 0, 0, 0)
    } else if (timelineOption === 'custom' && startDate) {
      timelineStart = new Date(startDate)
      timelineStart.setHours(0, 0, 0, 0)
    }

    if (parsedData?.id && parsedData?.hour !== undefined) {
      const movedEvent = parsedData
      const duration = movedEvent.endHour - movedEvent.hour
      const newStart = hour
      const newEnd = newStart + duration

      const overlapping = events.find(
        (ev) =>
          ev.id !== movedEvent.id &&
          ev.rowId === rowId &&
          ((newStart >= ev.hour && newStart < (ev.endHour || ev.hour + 1)) ||
            (newEnd > ev.hour && newEnd <= (ev.endHour || ev.hour + 1)) ||
            (newStart <= ev.hour && newEnd >= (ev.endHour || ev.hour + 1))),
      )

      if (overlapping) {
        fetchEvents()
        setAlerts((prev) => [
          ...prev,
          {
            severity: 'warning',
            message: 'Cannot drop event here — time slot is already occupied.',
          },
        ])

        return
      }

      const originalRow = unifiedRows.find((r) => r.id === movedEvent.rowId)
      const targetRow = unifiedRows.find((r) => r.id === rowId)

      if (
        (originalRow?.employeeGroup?.id &&
          targetRow?.employeeGroup?.id &&
          originalRow.employeeGroup.id !== targetRow.employeeGroup.id) ||
        targetRow.employeeGroup == ''
      ) {
        setAlerts((prev) => [
          ...prev,
          {
            severity: 'warning',
            message: 'Cannot move task to a different employee row.',
          },
        ])
        return
      }

      const startTime = new Date(timelineStart.getTime() + newStart * 60 * 60 * 1000)
      const endTime = new Date(timelineStart.getTime() + newEnd * 60 * 60 * 1000)

      const updatedEvent = {
        ...movedEvent,
        rowId,
        hour: newStart,
        endHour: newEnd,
        start_time: toLocalISOString(startTime),
        end_time: toLocalISOString(endTime),
        date: toLocalDateString(startTime),
      }

      if (updatedEvent.employee_id && updatedEvent.machine_id && updatedEvent.group_id) {
        handleResizeEdit(updatedEvent)
      }
      return
    }

    const { itemType, value } = parsedData

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

        if (
          (itemType === 'machine' && updatedEvent.machine_id) ||
          (itemType === 'groupQty' && updatedEvent.group_id) ||
          (itemType === 'employeeGroup' && updatedEvent.employee_id)
        ) {
          setAlerts((prev) => [
            ...prev,
            {
              severity: 'warning',
              message: `Cannot assign multiple ${itemType === 'machine' ? 'machines' : itemType === 'groupQty' ? 'groups' : 'employees'} to a single event.`,
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
        const startTime = new Date(timelineStart.getTime() + hour * 60 * 60 * 1000)
        const endTime = new Date(timelineStart.getTime() + (hour + 1) * 60 * 60 * 1000)

        const now = new Date()

        let color = '#ea7a57'
        if (now < startTime) {
          color = '#fec200'
        } else if (now >= startTime && now <= endTime) {
          color = '#5978ee'
        } else if (now > endTime) {
          color = '#1aaa55'
        }

        const newEvent = {
          id: Date.now() + Math.random(),
          rowId,
          hour,
          endHour: hour + 1,
          color,
          labels: [newLabelObj],
          task_name: '',
          date: toLocalDateString(startTime),
          start_time: toLocalISOString(startTime),
          end_time: toLocalISOString(endTime),
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
      date: event.date,
      start_time: event.start_time,
      end_time: event.end_time,
      notes: '',
    }

    productionPlanningApi
      .addProductionPlanning(payload)
      .then((res) => {
        // setSelectedFilter('')
        fetchEvents()
        setAlerts((prev) => [
          ...prev,
          {
            severity: 'success',
            message: 'Task added successfully. Drag the edges to adjust the time.',
          },
        ])
      })
      .catch((err) => {
        console.error('API error', err)
        setAlerts((prev) => [...prev, { severity: 'error', message: 'Failed to add event.' }])
      })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const getEventsForCell = (rowId, hour) => {
    return events.find((ev) => ev.rowId === rowId && ev.hour === hour)
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

  const handleResizeEdit = async (selectedEvent) => {
    if (Number.isInteger(selectedEvent.id)) {
      const payload = {
        employee_id: selectedEvent.employee_id,
        machine_id: selectedEvent.machine_id,
        group_id: selectedEvent.group_id,
        task_name: selectedEvent.task_name || '',
        date: selectedEvent.date,
        start_time: selectedEvent.start_time,
        end_time: selectedEvent.end_time,
        notes: selectedEvent.notes || '',
      }

      try {
        const res = await productionPlanningApi.updateProductionPlanning(selectedEvent.id, payload)

        setAlerts((prev) => [
          ...prev,
          { severity: 'success', message: 'Task updated successfully.' },
        ])
        fetchEvents()
        // setEvents((prev) => prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev)))
      } catch (error) {
        console.error('API error', error)
      }

      setSelectedEvent(null)
      setIsEditing(false)
    }
  }

  const handleEditForm = async (selectedEvent) => {
    if (Number.isInteger(selectedEvent.id)) {
      const start = new Date(selectedEvent.start_time)
      const end = new Date(selectedEvent.end_time)
      const formatDateTime = (dateObj) => {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        const hours = String(dateObj.getHours()).padStart(2, '0')
        const minutes = String(dateObj.getMinutes()).padStart(2, '0')
        const seconds = String(dateObj.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      }

      const payload = {
        employee_id: selectedEvent.employee_id,
        user_id: selectedEvent.user_id || 1,
        machine_id: selectedEvent.machine_id,
        group_id: selectedEvent.group_id,
        task_name: selectedEvent.task_name || '',
        date: selectedEvent.date,
        start_time: formatDateTime(start),
        end_time: formatDateTime(end),
        notes: selectedEvent.notes || '',
      }

      try {
        const res = await productionPlanningApi.updateProductionPlanning(selectedEvent.id, payload)

        setAlerts((prev) => [
          ...prev,
          { severity: 'success', message: 'Task updated successfully.' },
        ])
        fetchEvents()
      } catch (error) {
        console.error('API error', error)
      }

      setSelectedEvent(null)
      setIsEditing(false)
    }
  }

  const handleDeleteEvent = async (event) => {
    const isSavedEvent = Number.isInteger(event.id)

    if (event.id && isSavedEvent) {
      try {
        const res = await productionPlanningApi.deleteProductionPlanning(event.id)

        setEvents((prevEvents) => prevEvents.filter((ev) => ev.id !== event.id))
      } catch (error) {
        console.error('API error', error)
      }
    } else {
      // 🧹 Local-only event delete (not saved to DB)
      setEvents((prevEvents) =>
        prevEvents.filter(
          (ev) =>
            !(ev.rowId === event.rowId && ev.hour === event.hour && ev.endHour === event.endHour),
        ),
      )
    }

    setSelectedEvent(null)
  }
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleGroupClick = async (id) => {
    const response = await productionPlanningApi.getGroupData(id)
    console.log('response', response?.data?.data)
    setSelectedGroup(response?.data?.data || {})
    setShowGroupDetails(true)
  }

  // useEffect(() => {
  //   const isTodaySelected =
  //     selectedDate && new Date(selectedDate).toDateString() === new Date().toDateString()

  //   console.log('isTodaySelected', isTodaySelected)

  //   if (timelineOption === 'today' && isTodaySelected && tableContainerRef.current) {
  //     const currentHour = new Date().getHours()
  //     const columnWidth = 100
  //     const scrollX = currentHour * columnWidth

  //     requestAnimationFrame(() => {
  //       tableContainerRef.current?.scrollTo({
  //         left: scrollX,
  //         behavior: 'smooth',
  //       })
  //     })
  //   }
  // }, [timelineOption, selectedDate])

  return (
    <div className="scheduler-container">
      <div ref={tableContainerRef} className="scheduler-table-wrapper overflow-x-auto max-w-full">
        <table className="scheduler-table">
          <thead className="sticky-col">
            <tr className=" text-xs sticky top-0 z-[60] bg-white">
              <th className="sticky-date-header" colSpan={3}>
                <div className="flex justify-between items-center w-full gap-2 pr-2">
                  {/* Left: Timeline option dropdown */}
                  <select
                    value={timelineOption}
                    onChange={(e) => {
                      setStartDate(null)
                      setEndDate(null)
                      setTimelineOption(e.target.value)
                      setSelectedDate(new Date().toISOString().split('T')[0])
                    }}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="custom">Custom</option>
                  </select>

                  {/* Right: Date input based on option */}
                  {timelineOption === 'today' && (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedDate}
                      placeholder="Select date"
                      onChange={(e) => {
                        setStartDate(null)
                        setEndDate(null)
                        setSelectedDate(e.target.value)
                        setTimelineOption('today')
                      }}
                    />
                  )}

                  {timelineOption === 'custom' && (
                    <div className="relative z-[9999]">
                      <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                          setStartDate(update[0])
                          setEndDate(update[1])
                          if (update[0] && update[1]) {
                            const daysDiff =
                              Math.ceil((update[1] - update[0]) / (1000 * 60 * 60 * 24)) + 1
                            setCustomDays(daysDiff)
                            setTimelineOption('custom')
                          }
                        }}
                        onCalendarOpen={() => console.log('Calendar opened')}
                        dateFormat="dd-MM-yyyy"
                        className="border px-2 py-1 rounded text-sm w-full"
                        placeholderText="Select date range"
                        popperPlacement="bottom-start"
                      />
                    </div>
                  )}
                </div>
              </th>

              {Array.from({ length: selectedDays }, (_, dayIndex) => {
                const date = weekStart.add(dayIndex, 'day')
                return (
                  <th
                    key={`date-${dayIndex}`}
                    colSpan={24}
                    className=" right-date text-left whitespace-nowrap border-l border-gray-300 sticky-x bg-white z-10"
                  >
                    <div className="pl-2 text-left w-max">{date.format('MMM D, dddd')}</div>
                  </th>
                )
              })}
            </tr>
            <tr className="header-row text-xs bg-gray-100 top-[40px] z-10">
              <th className="sticky-header sticky-col sticky-employee header-sticky">Employee</th>
              <th className="sticky-header sticky-col sticky-machine header-sticky">Machine</th>
              <th className="sticky-header sticky-col sticky-quantity header-sticky">Group</th>
              {hours.map((hour, i) => {
                const hourOfDay = hour % 24
                const suffix = hourOfDay < 12 ? 'AM' : 'PM'
                const hour12 = hourOfDay === 0 || hourOfDay === 12 ? 12 : hourOfDay % 12

                return (
                  <th
                    key={`hour-${i}`}
                    className="right-date text-left justify-content-left header-sticky bg-white border-x border-gray-200 date-group-cell"
                  >
                    <span className="absolute left-0 pl-1 top-1 text-xs font-semibold text-gray-800">
                      {`${hour12}:00 ${suffix}`}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {unifiedRows.map((row, i) => (
              <tr key={row.id || i}>
                <td
                  className="sticky-col sticky-employee draggable-cell  bg-white z-[10]"
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
                  className="sticky-col sticky-machine draggable-cell  bg-white z-[10]"
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
                  className="sticky-col sticky-quantity draggable-cell bg-white z-[10]"
                  draggable={!!row.groupQty?.id}
                  onClick={() => handleGroupClick(row.groupQty?.id)}
                  onDragStart={(e) => {
                    if (row.groupQty?.id) {
                      handleDragStart(e, 'groupQty', row.groupQty.id)
                    }
                  }}
                >
                  <div className="font-medium text-gray-700">{row.groupQty?.group_name || ''}</div>
                  {row.groupQty?.group_name && (
                    <div className="text-[11px] mt-1 text-gray-600">
                      {`${row.groupQty?.manufactured_qty || 0} / ${row.groupQty?.group_Qty || ''}`}
                    </div>
                  )}
                </td>

                {hours.map((hour) => {
                  if (shouldSkipCell(row.id, hour)) return null

                  const event = getEventsForCell(row.id, hour)
                  const colSpan = event ? getEventDuration(event) : 1
                  const isCompleted = event?.status === 'completed'

                  return (
                    <td
                      key={hour}
                      onDrop={(e) => !isCompleted && handleDrop(e, row.id, hour)}
                      onDragOver={(e) => !isCompleted && handleDragOver(e)}
                      className="time-slot"
                      colSpan={colSpan}
                    >
                      {event && (
                        <div
                          className={`event ${isCompleted ? 'opacity-50 cursor-default' : ''}`}
                          style={{ backgroundColor: event.color }}
                          draggable={!isCompleted}
                          onDragStart={(e) => {
                            if (isCompleted) return
                            e.stopPropagation()
                            const payload = {
                              ...event,
                              hour: event.hour,
                              endHour: event.endHour ?? event.hour + 1,
                            }
                            setDraggingEvent(payload)
                            e.dataTransfer.setData('application/json', JSON.stringify(payload))
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
                          {/* Show resize handles only if not completed */}
                          {!isCompleted && (
                            <>
                              <div
                                className="resize-handle left"
                                onMouseDown={(e) => startResize(e, event, 'left')}
                              />
                              <div
                                className="resize-handle right"
                                onMouseDown={(e) => startResize(e, event, 'right')}
                              />
                            </>
                          )}

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
                {/* Status Badge */}
                {selectedEvent.status && (
                  <div className="px-2 mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                        selectedEvent.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : selectedEvent.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {selectedEvent.status
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  </div>
                )}

                <div className="popup-icons flex gap-2 text-gray-600 text-lg">
                  {selectedEvent.status === 'in_progress' && (
                    <FaEdit
                      title="Edit"
                      className="cursor-pointer hover:text-blue-500 transition"
                      disabled={selectedEvent.status === 'in_progress'}
                      onClick={() => setIsEditing(true)}
                    />
                  )}

                  {selectedEvent.status !== 'completed' && (
                    <FaTrash
                      title="Delete"
                      className="cursor-pointer hover:text-red-500 transition"
                      onClick={() => {
                        setIsDeleteModalOpen(true)
                      }}
                    />
                  )}

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
                        <div className="w-40 font-semibold">Employee:</div>
                        <div>{employeeGroupLabels.join(', ')}</div>
                      </div>
                    )}
                    {machineLabels.length > 0 && (
                      <div className="flex">
                        <div className="w-40 font-semibold">Machine:</div>
                        <div>{machineLabels.join(', ')}</div>
                      </div>
                    )}
                    {qtyLabels.length > 0 && (
                      <div className="flex">
                        <div className="w-40 font-semibold">Group:</div>
                        <div>{qtyLabels.join(', ')}</div>
                      </div>
                    )}
                    <div className="flex">
                      <div className="w-40 font-semibold">Total Qty:</div>
                      <div>{selectedEvent.total_quantity || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-40 font-semibold">Manufactured Qty:</div>
                      <div>{selectedEvent.manufactured_quantity || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-40 font-semibold">Balance Qty:</div>
                      <div>{selectedEvent.balance_quantity || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-40 font-semibold">Time:</div>
                      {formatDateToCustomDisplay(selectedEvent.start_time)} -{' '}
                      {formatDateToCustomDisplay(selectedEvent.end_time)}
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
                <label>Group:</label>
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
                  <option value="">-- Select Group --</option>
                  {groupsData.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="time-selects">
                <div className="field-group">
                  <label>From:</label>
                  <input
                    type="datetime-local"
                    className="styled-select"
                    value={formatDateForInput(selectedEvent.start_time)}
                    onChange={(e) => {
                      const newStart = e.target.value
                      setSelectedEvent((prev) => {
                        const start = new Date(newStart)
                        const end = new Date(prev.end_time)

                        // Ensure start is not after end
                        const adjustedEnd =
                          start >= end ? new Date(start.getTime() + 60 * 60 * 1000) : end

                        return {
                          ...prev,
                          start_time: newStart,
                          end_time: adjustedEnd.toISOString().slice(0, 16),
                        }
                      })
                    }}
                  />
                </div>

                <div className="field-group">
                  <label>To:</label>
                  <input
                    type="datetime-local"
                    className="styled-select"
                    value={formatDateForInput(selectedEvent.end_time)}
                    min={formatDateForInput(selectedEvent.start_time)} // prevent selecting before start
                    onChange={(e) => {
                      setSelectedEvent((prev) => ({
                        ...prev,
                        end_time: e.target.value,
                      }))
                    }}
                  />
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
                  handleEditForm(selectedEvent)
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

      {showGroupDetails && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30,34,44,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.25s',
          }}
          onClick={() => setShowGroupDetails(false)}
        >
          <div
            style={{
              background: '#fafbfc',
              borderRadius: 20,
              minWidth: 480, // reduced
              maxWidth: 620, // reduced
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 4px 24px rgba(30,34,44,0.13), 0 1.5px 6px rgba(30,34,44,0.07)',
              padding: 0,
              position: 'relative',
              fontFamily: 'inherit',
              transform: 'scale(1)',
              animation: 'modalScaleIn 0.22s',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 28px 0 28px',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#23272f' }}>
                  {selectedGroup.production_group.group_name}
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  Total Qty: <strong>{selectedGroup.production_group.group_Qty}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    background:
                      selectedGroup.production_group.group_status === 'production_completed'
                        ? '#d1fae5'
                        : '#e0f2fe',
                    color:
                      selectedGroup.production_group.group_status === 'production_completed'
                        ? '#065f46'
                        : '#1e40af',
                    padding: '4px 10px',
                    fontSize: 13,
                    borderRadius: 20,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedGroup.production_group.group_status
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>

                <button
                  onClick={() => setShowGroupDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 6,
                    borderRadius: '50%',
                    transition: 'background 0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Close"
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f0f1f3')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 6L14 14M14 6L6 14"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ height: 1, background: '#ececec', margin: '18px 0 0 0' }} />

            <div style={{ padding: '0 28px 24px 28px' }}>
              <div style={{ marginTop: 18 }}>
                {selectedGroup.production_histories.length === 0 ? (
                  <div
                    style={{
                      background: '#fff7ed',
                      border: '1px solid #fdba74',
                      borderRadius: 12,
                      padding: '16px 20px',
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#9a3412',
                      textAlign: 'center',
                    }}
                  >
                    Group hasn't been scheduled yet.
                  </div>
                ) : (
                  selectedGroup.production_histories.map((history) => (
                    <div
                      key={history.id}
                      className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm mb-4 px-4 py-3"
                    >
                      {[
                        ['Employee', history.employee?.name || '-'],
                        ['Machine', history.machine?.name || '-'],
                        ['Manufactured Qty', history.group_manufactured_quantity],
                        [
                          'Start',
                          new Date(history.start_time).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          }),
                        ],
                        [
                          'End',
                          new Date(history.end_time).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          }),
                        ],
                      ].map(([label, value]) => (
                        <div key={label} className="flex text-sm text-gray-700 py-0.5">
                          <div className="w-36 font-medium text-gray-900">{label}:</div>
                          <div className="text-gray-700">{value}</div>
                        </div>
                      ))}
                    </div>
                  ))
                )}

                <div
                  style={{
                    marginTop: 24,
                    padding: '14px 18px',
                    background: '#fefce8',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                    color: '#92400e',
                    textAlign: 'center',
                    border: '1px solid #fde68a',
                  }}
                >
                  Balance Quantity: {selectedGroup.production_group.balance_manufacture_qty}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModale
        isOpen={isDeleteModalOpen}
        onConfirm={() => handleDeleteEvent(selectedEvent)}
        onClose={closeDeleteModal}
      />
    </div>
  )
}

export default ProductionPlanningChart
