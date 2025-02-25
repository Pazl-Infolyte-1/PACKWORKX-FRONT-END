import React, { useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CCollapse,
} from '@coreui/react'
import { useDrag, useDrop } from 'react-dnd'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAngleDown, FaAngleUp, FaEllipsisV, FaRedoAlt, FaEye } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilBriefcase, cilMinus, cilClipboard, cilCut, cilOptions, cilReload } from '@coreui/icons'

const ItemType = 'WORK_ORDER'

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    style={{ cursor: 'pointer' }}
  >
    <CIcon
      icon={cilOptions}
      className="me-2 hover-pointer"
      style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
    />
  </span>
))

function WorkOrderCard({ order, index, visibleIndex, setVisibleIndex, removeWOFromPlan }) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: { order, index },
  }))

  const toggleCollapse = () => {
    setVisibleIndex(visibleIndex === index ? null : index)
  }

  return (
    <CCard
      className="mb-2"
      ref={drag}
      style={{
        backgroundColor: '#f5f4f7',
        borderRadius: '10px',
      }}
    >
      <CCardBody>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span onClick={toggleCollapse}>
            {order.order_id} {visibleIndex === index ? <FaAngleUp /> : <FaAngleDown />}
          </span>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => console.log('View Work Order', order)}>
                <CIcon
                  icon={cilBriefcase}
                  className="me-2"
                  style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
                View Work Order
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log('View Sales Order', order)}>
                <CIcon
                  icon={cilClipboard}
                  className="me-2"
                  style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
                View Sales Order
              </Dropdown.Item>
              <Dropdown.Item onClick={() => removeWOFromPlan(order)}>
                <CIcon
                  icon={cilMinus}
                  className="me-2"
                  style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
                Remove from Plan
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log('Split Work Order', order)}>
                <CIcon
                  icon={cilCut}
                  className="me-2"
                  style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
                Split Work Order
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <CCollapse visible={visibleIndex === index}>
          <hr />
          <div>
            SKU Name - {order.sku_name} <br />
            Layers - {order.layers} <br />
            Print - {order.print} <br />
            Dimensions - {order.dimension} <br />
            Planned Start - {order.planned_start} <br />
            Planned End - {order.planned_end} <br />
            Quantity - {order.quantity} <br />
            Route - {order.route}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '10px',
              marginBottom: '10px',
              marginRight: '10px',
            }}
          >
            <FaEye style={{ cursor: 'pointer' }} />
          </div>
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

function GroupOrderDropZone({
  groupOrder,
  groupIndex,
  addWorkOrderToGroup,
  groupVisibleIndex,
  setGroupVisibleIndex,
  removeWorkOrderFromGroup,
  removeWorkOrderFromPlan,
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => addWorkOrderToGroup(item.order, groupIndex),
  }))

  const toggleCollapse = (itemIndex) => {
    const uniqueIndex = `${groupIndex}-${itemIndex}`
    setGroupVisibleIndex(groupVisibleIndex === uniqueIndex ? null : uniqueIndex)
  }

  return (
    <CCol xs={6} ref={drop} className="mt-3">
      <CCard className="px-2 py-2" style={{ color: '#F3F2F5', borderRadius: '10px' }}>
        <CCard
          className="text-center mb-3 px-2 p"
          style={{
            cursor: 'pointer',
            height: '37px',
            padding: '0px 8px',
            border: '0',
            boxSizing: 'border-box',
            borderRadius: '4px',
            boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
            backgroundColor: '#8167e5',
            color: '#ffffff',
            fontSize: '18px',
            fontFamily: 'Roboto',
            fontWeight: '500',
            lineHeight: '23px',
            outline: 'none',
          }}
        >
          <CCardBody className="p-2 d-flex align-items-center justify-content-center">
            <CCardText className="text-white bold">{groupOrder.name}</CCardText>
          </CCardBody>
        </CCard>

        {groupOrder.items.map((item, itemIndex) => {
          const uniqueIndex = `${groupIndex}-${itemIndex}`
          return (
            <CCard
              key={uniqueIndex}
              className="mt-2"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
              }}
            >
              <CCardBody>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span onClick={() => toggleCollapse(itemIndex)}>
                    {item.order_id}
                    {groupVisibleIndex === uniqueIndex ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                  <span
                    style={{
                      fontSize: '16px',
                      lineHeight: '21px',
                    }}
                  >
                    {item.finished_goods} / {item.quantity}
                  </span>
                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => console.log('View Work Order', item)}>
                        <CIcon
                          icon={cilBriefcase}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        View Work Order
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log('View Sales Order', item)}>
                        <CIcon
                          icon={cilClipboard}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        View Sales Order
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => removeWorkOrderFromGroup(item, groupIndex)}>
                        <CIcon
                          icon={cilMinus}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Remove from Group
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => removeWorkOrderFromPlan(item, groupIndex)}>
                        <CIcon
                          icon={cilMinus}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Remove from Plan
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log('Split Work Order', item)}>
                        <CIcon
                          icon={cilCut}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Split Work Order
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <CCollapse visible={groupVisibleIndex === uniqueIndex}>
                  <div className="mt-1">
                    SKU Name - {item.sku_name} <br />
                    Layers - {item.layers} <br />
                    Print - {item.print} <br />
                    Dimensions - {item.dimension} <br />
                    Planned Start - {item.planned_start} <br />
                    Planned End - {item.planned_end} <br />
                    Quantity - {item.quantity} <br />
                    Route - {item.route}
                    <div className="d-flex align-items-center">
                      <label>Finished Goods - </label>
                      <input
                        style={{
                          width: '74px',
                          height: '20px',
                          padding: '0px 8px',
                          border: '0.8px solid #7f7f7f',
                          boxSizing: 'border-box',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          color: '#94a3b8',
                          fontSize: '14px',
                          fontFamily: 'Roboto',
                          lineHeight: '21.600000381469727px',
                          outline: 'none',
                          justifyContent: 'end',
                        }}
                        type="number"
                        defaultValue={item.finished_goods}
                        onChange={(e) => {
                          const newValue = e.target.value
                          setGroupOrders((prevGroups) =>
                            prevGroups.map((group, index) => {
                              if (index === groupIndex) {
                                return {
                                  ...group,
                                  items: group.items.map((order) =>
                                    order.id === item.id
                                      ? { ...order, finished_goods: newValue }
                                      : order,
                                  ),
                                }
                              }
                              return group
                            }),
                          )
                          setWorkOrders((prevOrders) =>
                            prevOrders.map((order) =>
                              order.id === item.id ? { ...order, finished_goods: newValue } : order,
                            ),
                          )
                        }}
                      />
                    </div>
                    <span>Available - {item.quantity}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '10px',
                      marginBottom: '10px',
                      marginRight: '10px',
                    }}
                  >
                    <FaEye style={{ cursor: 'pointer' }} />
                  </div>
                </CCollapse>
              </CCardBody>
            </CCard>
          )
        })}
      </CCard>
    </CCol>
  )
}

const Group = ({ workOrders, setWorkOrders, groupOrders, setGroupOrders, autoSyncOrders }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [visibleIndex, setVisibleIndex] = useState(null)
  const [groupVisibleIndex, setGroupVisibleIndex] = useState(null)
  const removeWorkOrderFromGroup = (order, groupIndex) => {
    console.log('Removing order from group', order, groupIndex)

    setGroupOrders((prevGroups) =>
      prevGroups.map((group, index) =>
        index === groupIndex
          ? { ...group, items: group.items.filter((item) => item.id !== order.id) }
          : group,
      ),
    )
    setWorkOrders((prevOrders) => {
      const updatedOrders = [...prevOrders, order]
      updatedOrders.sort((a, b) => a.id - b.id)
      return updatedOrders
    })
  }

  const removeWorkOrderFromPlan = (order, groupIndex) => {
    console.log('Removing order from group', order, groupIndex)

    setGroupOrders((prevGroups) =>
      prevGroups.map((group, index) =>
        index === groupIndex
          ? { ...group, items: group.items.filter((item) => item.id !== order.id) }
          : group,
      ),
    )
  }

  const removeWOFromPlan = (order) => {
    console.log('Removing order from plan', order)
    setWorkOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.id))
  }

  const handleAutoSync = () => {
    setGroupOrders((prevGroups) => {
      const isAutoSyncPresent = prevGroups.some((group) => group.name === 'Auto Sync')

      if (isAutoSyncPresent) {
        alert('Auto Sync is already added.')
        return prevGroups
      }
      console.log('Auto sync orders', autoSyncOrders)
      console.log('Work orders', workOrders)
      setWorkOrders(
        workOrders.filter(
          (order) => !autoSyncOrders.items.some((a_order) => order.id === a_order.id),
        ),
      )

      return [autoSyncOrders, ...prevGroups]
    })
  }

  const addWorkOrderToGroup = (order, groupIndex) => {
    console.log('Adding order to group', order)
    console.log('Adding order to index', groupIndex)

    setGroupOrders((prevGroups) => {
      if (prevGroups[groupIndex]?.name === 'Auto Sync') {
        alert('Cannot manually add work orders to the Auto Sync group.')
        return prevGroups
      }

      setWorkOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.id))

      return prevGroups.map((group, index) =>
        index === groupIndex ? { ...group, items: [...group.items, order] } : group,
      )
    })
  }

  return (
    <>
      <CCol xs={5} className="mt-4">
        <CRow>
          <CCol xs={12}>
            <CCard
              className="text-black bold"
              style={{
                cursor: 'pointer',
                height: '56px',
                padding: '0px 8px',
                border: '0',
                boxSizing: 'border-box',
                borderRadius: '4px',
                boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
                backgroundColor: '#c7c7f1',
                color: '#000000',
                fontSize: '22px',
                fontFamily: 'Roboto',
                fontWeight: '500',
                lineHeight: '31px',
                outline: 'none',
              }}
            >
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <CCardText className="mx-auto text-bold">Work Orders</CCardText>
                  <CIcon
                    icon={cilReload}
                    onClick={handleAutoSync}
                    className="me-2 hover-pointer"
                    style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol xs={12}>
            {workOrders.length > 0 &&
              workOrders.map((order) => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  index={order.id}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  removeWOFromPlan={removeWOFromPlan}
                />
              ))}
          </CCol>
        </CRow>
      </CCol>

      <CCol xs={7} className="mt-1">
        <CRow className="mt-2 px-3 py-3">
          {groupOrders.length > 0 &&
            groupOrders.map((groupOrder, groupIndex) => (
              <GroupOrderDropZone
                key={groupIndex}
                groupOrder={groupOrder}
                groupIndex={groupIndex}
                addWorkOrderToGroup={addWorkOrderToGroup}
                groupVisibleIndex={groupVisibleIndex}
                setGroupVisibleIndex={setGroupVisibleIndex}
                removeWorkOrderFromGroup={removeWorkOrderFromGroup}
                removeWorkOrderFromPlan={removeWorkOrderFromPlan}
              />
            ))}
        </CRow>
      </CCol>
    </>
  )
}

export default Group
