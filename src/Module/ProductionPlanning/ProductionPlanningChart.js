import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-react-schedule/styles/material.css'

import * as dataSource from './datasource.json'
import './index.css'
import React, { useEffect, useRef } from 'react'
import {
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  Inject,
  TimelineViews,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule'
import { extend } from '@syncfusion/ej2-base'

const ProductionPlanningChart = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const resourceHeader = document.querySelector('.e-resource-left-td .e-resource-text')
      if (resourceHeader && resourceHeader.children.length === 0) {
        resourceHeader.innerHTML = `
          <div style="display:flex; font-weight:bold;">
            <div style="width:80px;">Rooms</div>
            <div style="width:80px;">Type</div>
            <div style="width:80px;">Capacity</div>
          </div>
        `
        clearInterval(interval) // stop checking once inserted
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])
  const scheduleObj = useRef(null)
  const data = extend([], dataSource.roomData, null, true)

  const ownerData = [
    { text: 'Jammy', id: 1, color: '#ea7a57', capacity: 20, type: 'Conference' },
    { text: 'Tweety', id: 2, color: '#7fa900', capacity: 7, type: 'Cabin' },
    { text: 'Nestle', id: 3, color: '#5978ee', capacity: 5, type: 'Cabin' },
    { text: 'Phoenix', id: 4, color: '#fec200', capacity: 15, type: 'Conference' },
    { text: 'Mission', id: 5, color: '#df5286', capacity: 25, type: 'Conference' },
    { text: 'Hangout', id: 6, color: '#00bdae', capacity: 10, type: 'Cabin' },
    { text: 'Rick Roll', id: 7, color: '#865fcf', capacity: 20, type: 'Conference' },
    { text: 'Rainbow', id: 8, color: '#1aaa55', capacity: 8, type: 'Cabin' },
    { text: 'Swarm', id: 9, color: '#df5286', capacity: 30, type: 'Conference' },
    { text: 'Photogenic', id: 10, color: '#710193', capacity: 25, type: 'Conference' },
  ]

  const onDragStart = (e, label, value) => {
    e.dataTransfer.setData('label', label)
    e.dataTransfer.setData('value', value)
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const droppedItemsMap = useRef({})

  const onDrop = (e) => {
    e.preventDefault()
    const label = e.dataTransfer.getData('label')
    const value = e.dataTransfer.getData('value')

    let target = e.target.closest('.e-work-cells') || e.target
    const cellData = scheduleObj.current.getCellDetails(target)

    if (cellData && cellData.startTime) {
      const roomId = cellData.groupIndex + 1 || 1
      const key = `${cellData.startTime.toISOString()}_${roomId}` // ✅ Unique key per resource + time

      if (!droppedItemsMap.current[key]) {
        droppedItemsMap.current[key] = []
      }
      droppedItemsMap.current[key].push({ label, value })

      const existingEvent = scheduleObj.current
        .getEvents()
        .find(
          (ev) => ev.StartTime.getTime() === cellData.startTime.getTime() && ev.RoomId === roomId,
        )

      const newSubject = droppedItemsMap.current[key]
        .map((item) => `${item.label}: ${item.value}`)
        .join(' ')

      if (existingEvent) {
        existingEvent.Subject = newSubject
        scheduleObj.current.saveEvent(existingEvent, 'Save')
      } else {
        const newEvent = {
          Id: new Date().getTime(),
          Subject: newSubject, // <- No <br> here, use SPACE
          StartTime: cellData.startTime,
          EndTime: new Date(cellData.startTime.getTime() + 60 * 60 * 1000),
          RoomId: cellData.groupIndex + 1 || 1,
        }
        scheduleObj.current.addEvent(newEvent)
      }
    }
  }

  const onPopupOpen = (args) => {
    if (args.type === 'QuickInfo' && args.data) {
      const key = new Date(args.data.StartTime).toISOString()
      if (droppedItemsMap.current[key]) {
        // Show <br> ONLY in the popup
        args.element.querySelector('.e-subject').innerHTML = droppedItemsMap.current[key]
          .map((item) => `${item.label}: ${item.value}`)
          .join('<br/>')
      }
    }
  }

  const onEventRendered = (args) => {
    const key = args.data.StartTime.toISOString()
    if (droppedItemsMap.current[key]) {
      const subjectEle = args.element.querySelector('.e-subject')
      if (subjectEle) {
        // Use spaces between items for data cell view
        subjectEle.textContent = droppedItemsMap.current[key]
          .map((item) => `${item.label}: ${item.value}`)
          .join(' ')
      }
    }
  }

  const resourceHeaderTemplate = (props) => (
    <div className="template-wrap" style={{ display: 'flex', gap: '5px' }}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'Text', props.resourceData.text)}
        style={{ cursor: 'grab', padding: '2px 4px' }}
      >
        {props.resourceData.text}
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'Type', props.resourceData.type)}
        style={{ cursor: 'grab', padding: '2px 4px' }}
      >
        {props.resourceData.type}
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'Capacity', props.resourceData.capacity)}
        style={{ cursor: 'grab', padding: '2px 4px' }}
      >
        {props.resourceData.capacity}
      </div>
    </div>
  )

  return (
    <ScheduleComponent
      ref={scheduleObj}
      popupOpen={onPopupOpen}
      eventRendered={onEventRendered}
      // dragStart={onDragStart}
      cssClass="timeline-resource"
      width="100%"
      height="850px"
      selectedDate={new Date()}
      workHours={{ start: '08:00', end: '18:00' }}
      timeScale={{ interval: 60, slotCount: 1 }}
      resourceHeaderTemplate={resourceHeaderTemplate}
      group={{ enableCompactView: false, resources: ['MeetingRoom'] }}
      eventSettings={{
        dataSource: data,
        fields: {
          id: 'Id',
          subject: { title: 'Summary', name: 'Subject' },
          startTime: { title: 'From', name: 'StartTime' },
          endTime: { title: 'To', name: 'EndTime' },
        },
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ResourcesDirective>
        <ResourceDirective
          field="RoomId"
          title="Room Type"
          name="MeetingRoom"
          allowMultiple={true}
          dataSource={ownerData}
          textField="text"
          idField="id"
          colorField="color"
        />
      </ResourcesDirective>
      <ViewsDirective>
        <ViewDirective option="TimelineDay" />
        <ViewDirective option="TimelineWeek" />
      </ViewsDirective>
      <Inject services={[TimelineViews, Resize, DragAndDrop]} />
    </ScheduleComponent>
  )
}

export default ProductionPlanningChart
