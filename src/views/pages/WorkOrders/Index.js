import React, { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'

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

  const [dropdownOpen, setDropdownOpen] = useState(false)

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

  const [dropdownOpen, setDropdownOpen] = useState(false)

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

const Index = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [visibleIndex, setVisibleIndex] = useState(null)
  const [groupVisibleIndex, setGroupVisibleIndex] = useState(null)

  const [workOrders, setWorkOrders] = useState([
    {
      id: 1,
      order_id: 'WO - 1001',
      sku_name: '60 ml',
      layers: 1,
      print: 'Flexo',
      dimension: '20x20x10',
      planned_start: '08/03/25',
      planned_end: '18/03/25',
      quantity: 100,
      route: 'Std Corr Box',
      finished_goods: 0,
    },
    {
      id: 2,
      order_id: 'WO - 1002',
      sku_name: '100 ml',
      layers: 2,
      print: 'Digital',
      dimension: '25x25x15',
      planned_start: '10/03/25',
      planned_end: '20/03/25',
      quantity: 150,
      route: 'Custom Corr Box',
      finished_goods: 0,
    },
    {
      id: 3,
      order_id: 'WO - 1003',
      sku_name: '250 ml',
      layers: 3,
      print: 'Offset',
      dimension: '30x30x20',
      planned_start: '12/03/25',
      planned_end: '22/03/25',
      quantity: 200,
      route: 'Econo Pack',
      finished_goods: 0,
    },
    {
      id: 4,
      order_id: 'WO - 1004',
      sku_name: '500 ml',
      layers: 1,
      print: 'Flexo',
      dimension: '35x35x25',
      planned_start: '14/03/25',
      planned_end: '24/03/25',
      quantity: 250,
      route: 'Std Corr Box',
      finished_goods: 0,
    },
    {
      id: 5,
      order_id: 'WO - 1005',
      sku_name: '750 ml',
      layers: 2,
      print: 'Digital',
      dimension: '40x40x30',
      planned_start: '16/03/25',
      planned_end: '26/03/25',
      quantity: 300,
      route: 'Custom Corr Box',
      finished_goods: 0,
    },
    {
      id: 6,
      order_id: 'WO - 1006',
      sku_name: '1 L',
      layers: 3,
      print: 'Offset',
      dimension: '45x45x35',
      planned_start: '18/03/25',
      planned_end: '28/03/25',
      quantity: 350,
      route: 'Econo Pack',
      finished_goods: 0,
    },
    {
      id: 7,
      order_id: 'WO - 1007',
      sku_name: '1.5 L',
      layers: 1,
      print: 'Flexo',
      dimension: '50x50x40',
      planned_start: '20/03/25',
      planned_end: '30/03/25',
      quantity: 400,
      route: 'Std Corr Box',
      finished_goods: 0,
    },
    {
      id: 8,
      order_id: 'WO - 1008',
      sku_name: '2 L',
      layers: 2,
      print: 'Digital',
      dimension: '55x55x45',
      planned_start: '22/03/25',
      planned_end: '01/04/25',
      quantity: 450,
      route: 'Custom Corr Box',
      finished_goods: 0,
    },
  ])

  const [autoSyncOrder, setAutoSyncOrder] = useState({
    name: 'Auto Sync',
    items: [
      {
        id: 3,
        order_id: 'WO - 1003',
        sku_name: '250 ml',
        layers: 3,
        print: 'Offset',
        dimension: '30x30x20',
        planned_start: '12/03/25',
        planned_end: '22/03/25',
        quantity: 200,
        route: 'Econo Pack',
        finished_goods: 0,
      },
      {
        id: 4,
        order_id: 'WO - 1004',
        sku_name: '500 ml',
        layers: 1,
        print: 'Flexo',
        dimension: '35x35x25',
        planned_start: '14/03/25',
        planned_end: '24/03/25',
        quantity: 250,
        route: 'Std Corr Box',
        finished_goods: 0,
      },
    ],
  })

  const [groupOrders, setGroupOrders] = useState([])
  const [activeTab, setActiveTab] = useState('group')
  const tabs = ['group', 'sfg', 'rm', 'returnables']

  const handleNextStep = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

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
      setWorkOrders(
        workOrders.filter(
          (order) => !autoSyncOrder.items.some((a_order) => order.id === a_order.id),
        ),
      )

      return [autoSyncOrder, ...prevGroups]
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

  const handleAddGroup = () => {
    setGroupOrders((prevGroups) => [
      ...prevGroups,
      { name: `Group ${prevGroups.length + 1}`, items: [] },
    ])
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Order Grouping</h3>
        <div className="ms-auto d-flex">
          <CButton
            color="white border-black hover-text-white background-black"
            className="text-black me-2"
            onClick={handleAddGroup}
          >
            + Add Group
          </CButton>
          <CButton color="danger" className="text-white" onClick={handleNextStep}>
            Next Step
          </CButton>
        </div>
      </div>

      <CCol xs={12}>
        <CNav variant="tabs">
          {tabs.map((tab) => (
            <CNavItem key={tab}>
              <CNavLink
                active={activeTab === tab}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab(tab)
                }}
                style={{
                  backgroundColor: activeTab === tab ? '#8761e5' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#8761e5',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, ' ')}
              </CNavLink>
            </CNavItem>
          ))}
        </CNav>
      </CCol>

      <CRow>
        <CCol xs={12} className="mt-4">
          {activeTab === 'group' && (
            <div>
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
                    {workOrders.map((order) => (
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
                  {groupOrders.map((groupOrder, groupIndex) => (
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
            </div>
          )}
          {activeTab === 'sfg' && <div>Allocate SFG Content</div>}
          {activeTab === 'rm' && <div>Allocate RM Content</div>}
          {activeTab === 'returnables' && <div>Returnables Content</div>}
        </CCol>
      </CRow>
    </div>
  )
}

export default Index
