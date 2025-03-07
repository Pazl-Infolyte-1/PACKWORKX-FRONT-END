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
  CModal,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableHead,
  CTableBody,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useDrag, useDrop } from 'react-dnd'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAngleDown, FaAngleUp, FaEllipsisV, FaRedoAlt, FaEye } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilMinus,
  cilClipboard,
  cilCut,
  cilOptions,
  cilReload,
  cilTrash,
  cilQrCode,
  cilLink,
} from '@coreui/icons'
import './styles.css'
import ProgressBar from './ProgressBar'
import PopUp from '../../components/New/PopUp'

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

function LayerDragble({ lg }) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: { lg },
  }))
  return (
    <CCard
      ref={drag}
      style={{
        padding: '10px',
        marginTop: '10px',
        backgroundColor: '#f5f4f7',
        borderRadius: '10px',
      }}
    >
      {lg.layer_name}
      <br />
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span>Board Size (L x W) : {lg.dimensions}</span>
        <span>{lg.color}</span>
        <span>{lg.gsm} GSM</span>
        <span>{lg.bf} BF</span>
      </div>
    </CCard>
  )
}

function WorkOrderCard({
  order,
  index,
  visibleIndex,
  setVisibleIndex,
  removeWOFromPlan,
  setModalWorkOrder,
  modalWorkOrder,
  setVisible,
  setVisibleSplit,
}) {
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
          <span
            onClick={toggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
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
                  icon={cilTrash}
                  className="me-2"
                  style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
                Remove from Plan
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setVisibleSplit(true)}>
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

        <CCollapse className="custom-collapse" visible={visibleIndex === index}>
          <hr />

          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span>{order.sku_name}</span>
            <span>{order.dimension}</span>
            <span>{order.layers} PLY</span>
            <span>{order.print}</span>

            <span>Quantity :{order.quantity}</span>
            <span>{order.route}</span>
          </div>
          {order.layer_group.map((lg) => (
            <LayerDragble key={lg.id} lg={lg} />
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '10px',
              marginBottom: '10px',
              marginRight: '10px',
            }}
          >
            <FaEye
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setModalWorkOrder(order)
                setVisible(true)
              }}
            />
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
  setModalWorkOrder,
  setGroupOrders,
  modalWorkOrder,
  setVisible,
  setVisibleSplit,
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => addWorkOrderToGroup(item, groupIndex),
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
          console.log('item', item)
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
                    width: '100%',
                  }}
                >
                  <span
                    onClick={() => toggleCollapse(itemIndex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.order_id ? item.order_id : `${item.layer_name}, ${item.wo}`}

                    {groupVisibleIndex === uniqueIndex ? <FaAngleUp /> : <FaAngleDown />}
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '16px',
                      lineHeight: '21px',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.quantity ? `${item.finished_goods} / ${item.quantity}` : ''}
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
                          icon={cilTrash}
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
                      <Dropdown.Item onClick={() => setVisibleSplit(true)}>
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

                <CCollapse className="custom-collapse" visible={groupVisibleIndex === uniqueIndex}>
                  <div className="mt-1">
                    {item.sku_name ? (
                      <>
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
                              lineHeight: '21.6px',
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
                                  order.id === item.id
                                    ? { ...order, finished_goods: newValue }
                                    : order,
                                ),
                              )
                            }}
                          />
                        </div>
                        <span>Available - {item.quantity}</span> <br />
                      </>
                    ) : (
                      <>
                        GSM - {item.gsm} <br />
                        BF - {item.bf} <br />
                        Dimensions - {item.dimensions} <br />
                        Color - {item.color} <br />
                      </>
                    )}
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
                    <FaEye
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setModalWorkOrder(item)
                        setVisible(true)
                      }}
                    />
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

const Group = ({
  workOrders,
  setWorkOrders,
  groupOrders,
  setGroupOrders,
  autoSyncOrders,
  setVisibleSplit,
}) => {
  const [visibleIndex, setVisibleIndex] = useState(null)
  const [groupVisibleIndex, setGroupVisibleIndex] = useState(null)
  const [modalWorkOrder, setModalWorkOrder] = useState(null)
  const [visible, setVisible] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [splitVisible, setSplitVisible] = useState(false)
  const removeWorkOrderFromGroup = (order, groupIndex) => {
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

    setGroupOrders((prevGroups) => {
      if (prevGroups[groupIndex]?.name === 'Auto Sync') {
        alert('Cannot manually add work orders to the Auto Sync group.')
        return prevGroups
      }

      if (order.order) {
        setWorkOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.order.id))
      } else if (order.lg) {
        setWorkOrders((prevOrders) =>
          prevOrders.map((wo) => ({
            ...wo,
            layer_group: wo.layer_group.filter((layer) => layer.id !== order.lg.id),
          })),
        )
      }

      return prevGroups.map((group, index) =>
        index === groupIndex
          ? { ...group, items: [...group.items, order.order ? order.order : order.lg] }
          : group,
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
                  <CCardText className="mx-auto text-bold mb-0">Work Orders</CCardText>
                  <CIcon
                    icon={cilReload}
                    onClick={handleAutoSync}
                    className="me-2 hover-pointer"
                    style={{ fontSize: '1.4rem', fontWeight: 'bold', verticalAlign: 'middle' }}
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
                  setModalWorkOrder={setModalWorkOrder}
                  modalWorkOrder={modalWorkOrder}
                  setVisible={setVisible}
                  setVisibleSplit={setVisibleSplit}
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
                setModalWorkOrder={setModalWorkOrder}
                setGroupOrders={setGroupOrders}
                modalWorkOrder={modalWorkOrder}
                setVisible={setVisible}
                setVisibleSplit={setVisibleSplit}
              />
            ))}
        </CRow>
      </CCol>

      <CModal
        alignment="center"
        scrollable
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
      >
        <CModalBody className="d-block">
          <div className="mt-3">
            {modalWorkOrder && (
              <>
                <span className="mt-5 fw-bold flex items-center gap-2">
                  {modalWorkOrder.order_id}{' '}
                  <div style={{ width: '45px', height: '40px' }}>
                    <ProgressBar
                      value={Math.min(
                        Math.max(
                          parseFloat(
                            (
                              (modalWorkOrder.finished_goods / modalWorkOrder.quantity) *
                              100
                            ).toFixed(1),
                          ),
                          0,
                        ),
                        100,
                      )}
                    />
                  </div>
                  <span className="ml-20 fw-light">
                    Planned
                    <span className="font-medium text-green-700">
                      {' '}
                      {modalWorkOrder.finished_goods}{' '}
                    </span>
                    out of
                    <span className="font-medium text-blue-700">
                      {' '}
                      {modalWorkOrder.quantity}
                    </span>{' '}
                    Quantity.
                  </span>
                </span>

                <CRow className="mt-3">
                  <CCol xs={4} md={4} lg={4}>
                    <CRow>
                      <CCol xs={6} md={6}>
                        <div className="mt-3 text-bold">
                          SKU Name <br />
                          Print <br />
                          Route <br />
                          Planned Start
                        </div>
                      </CCol>
                      <CCol xs={6} md={6}>
                        <div className="mt-3">
                          {modalWorkOrder.sku_name} <br />
                          {modalWorkOrder.print} <br />
                          {modalWorkOrder.route} <br />
                          {modalWorkOrder.planned_start}
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol xs={4} md={4} lg={4}>
                    <CRow>
                      <CCol xs={6} md={6}>
                        <div className="mt-3 text-bold">
                          Layers <br />
                          Dimensions <br />
                          Qty <br />
                          Planned End
                        </div>
                      </CCol>
                      <CCol xs={6} md={6}>
                        <div className="mt-3">
                          {modalWorkOrder.layers} <br />
                          {modalWorkOrder.dimension} <br />
                          {modalWorkOrder.quantity} <br />
                          {modalWorkOrder.planned_end}
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol xs={4} md={4} lg={4} className="relative">
                    <CRow>
                      <CIcon
                        icon={cilQrCode}
                        className="absolute right-0"
                        style={{
                          marginRight: '20px',
                          marginTop: '-90px',
                          height: '110px',
                          width: '150px',
                        }}
                      />
                    </CRow>

                    <CRow className="mt-5">
                      <div>ETD (Estimated Delivery Date) : 12/12/2025</div>
                      <div className="flex items-center gap-1">
                        <span>Linked to Sales</span>
                        <CIcon
                          icon={cilLink}
                          className="me-1 cursor-pointer"
                          style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        <span>S0 - 001</span>
                      </div>
                      <div>Client MERK</div>
                    </CRow>
                  </CCol>
                </CRow>
                <hr />
                <CTable striped hover>
                  <CTableHead>
                    <CTableHeaderCell></CTableHeaderCell>
                    <CTableHeaderCell>GSM</CTableHeaderCell>
                    <CTableHeaderCell>Board Size</CTableHeaderCell>
                    <CTableHeaderCell>BF</CTableHeaderCell>
                    <CTableHeaderCell>Color</CTableHeaderCell>
                    <CTableHeaderCell>Print</CTableHeaderCell>
                    <CTableHeaderCell>Allocation Details</CTableHeaderCell>
                    <CTableHeaderCell>Flute Ratio</CTableHeaderCell>
                    <CTableHeaderCell>Allocated Material</CTableHeaderCell>
                  </CTableHead>
                  <CTableBody>
                    {modalWorkOrder.layer_group &&
                      modalWorkOrder.layer_group.map((lg) => (
                        <CTableRow key={lg.id}>
                          {' '}
                          <CTableDataCell>{lg.layer_name}</CTableDataCell>
                          <CTableDataCell>{lg.gsm}</CTableDataCell>
                          <CTableDataCell>{lg.dimensions}</CTableDataCell>
                          <CTableDataCell>{lg.bf}</CTableDataCell>
                          <CTableDataCell>{lg.colors}</CTableDataCell>
                          <CTableDataCell>{modalWorkOrder.print}</CTableDataCell>
                          <CTableDataCell>FG</CTableDataCell>
                          <CTableDataCell>NA</CTableDataCell>
                          <CTableDataCell>
                            <div style={{ width: '45px', height: '40px' }}>
                              <ProgressBar value={80} />
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
              </>
            )}
          </div>
        </CModalBody>

        {/* <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter> */}
      </CModal>

      <PopUp
        visible={splitVisible}
        setVisible={setSplitVisible}
        width="800px"
        height="500px"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle className="text-[#030303]">Split Work Order</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3 text-[#023f81] text-[16px] flex float-right">
            <strong>WO - #50015</strong> | <strong>Qty - 150</strong> | <strong>FG - 100</strong>
          </div>
          <h5 className="mb-1 text-[#023f81]">Balance Qty from Work Order:</h5>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label mb-0 ">Balance Qty</label>
            <CFormInput
              value="50"
              disabled
              style={{ width: '80px', height: '35px', marginLeft: '150px' }}
            />
          </div>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label mb-0 ">Allocate To</label>
            <CFormSelect
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: '150px', marginLeft: '150px' }}
            >
              <option value="">Select type</option>
              <option value="Outsource">Outsource</option>
              <option value="Purchase Order">Purchase Order</option>
            </CFormSelect>
            <CFormInput value="50" disabled style={{ width: '80px', height: '35px' }} />
          </div>
          <h5 className="text-[#023f81]">Allocated Finished Goods:</h5>
          <div className="d-flex gap-2 mb-3">
            <CFormSelect style={{ width: '220px', height: '35px', color: '#023f81' }}>
              <option value="WO-50015">WO - 50015</option>
            </CFormSelect>
            <CFormInput style={{ width: '80px', height: '35px' }} value="50" disabled />
            <CButton
              style={{
                width: '80px',
                height: '35px',
                backgroundColor: '#8761e5',
                color: '#ffffff',
              }}
              color="success"
            >
              {' '}
              Add
            </CButton>
          </div>
          {/* <CListGroup style={{ maxWidth: "300px" }}>
        <CListGroupItem className="d-flex justify-content-between">
            <span>WO - 50015</span>
            <span>Qty. 50</span>
        </CListGroupItem>
    </CListGroup> */}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton style={{ backgroundColor: '#023f81', color: '#ffffff' }} color="primary">
            Submit
          </CButton>
        </CModalFooter>
      </PopUp>
    </>
  )
}

export default Group
