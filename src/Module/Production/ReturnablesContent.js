import React, { useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CButton,
  CCollapse,
  CFormSelect,
  CTable,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import { useDrag, useDrop } from 'react-dnd'
import './styles.css'

const ItemType = 'WORK_ORDER'

function SFGDragableCard({ sfg, openSFG, setOpenSFG }) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: { sfg },
  }))
  const toggleCollapse = (id) => {
    setOpenSFG((prevId) => (prevId === id ? null : id)) // Toggle behavior
  }
  return (
    <CCard className="mt-3" ref={drag} key={sfg.id}>
      <CCardBody>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%', // Ensures elements use available space
          }}
        >
          {/* Ensures sfg.id and the icon stay on the same line */}
          <span
            onClick={() => toggleCollapse(sfg.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Adds space between text and icon
              whiteSpace: 'nowrap', // Prevents text wrapping
            }}
          >
            {sfg.id} {openSFG === sfg.id ? <FaAngleUp /> : <FaAngleDown />}
          </span>

          {/* Ensures the CIcon stays aligned */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CIcon
              icon={cilOptions}
              className="me-2 hover-pointer"
              style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
            />
          </span>
        </div>

        <CCollapse className="custom-collapse" visible={openSFG === sfg.id}>
          <CRow className="align-items-center mt-3 mb-2">
            <CCol md="3">
              <span>{sfg.description}</span>
            </CCol>
            <CCol md="3">
              <span>{sfg.size}</span>
            </CCol>
            <CCol md="3">
              <span>Available Qty : {sfg.available_qty}</span>
            </CCol>
            <CCol md="3">
              <span>Blocked Qty : {sfg.blocked_qty}</span>
            </CCol>
          </CRow>
          <hr />
          <CRow className="mt-3">
            <CCol xs={9}>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell></CTableHeaderCell>
                    <CTableHeaderCell>GSM</CTableHeaderCell>
                    <CTableHeaderCell>BF</CTableHeaderCell>
                    <CTableHeaderCell>Print</CTableHeaderCell>
                    <CTableHeaderCell>L x W</CTableHeaderCell>
                    <CTableHeaderCell>Flute</CTableHeaderCell>
                    <CTableHeaderCell>Color</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sfg.table_data.map((s, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{s.name}</CTableDataCell>
                      <CTableDataCell>{s.gsm}</CTableDataCell>
                      <CTableDataCell>{s.bf}</CTableDataCell>
                      <CTableDataCell>{s.print}</CTableDataCell>
                      <CTableDataCell>{s.l_w}</CTableDataCell>
                      <CTableDataCell>{s.flute}</CTableDataCell>
                      <CTableDataCell>{s.color}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCol>
            <CCol xs={3}>
              {sfg.work_orders.map((wo, index) => (
                <CCard
                  key={index}
                  style={{
                    height: '63px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.16)',
                    marginTop: '10px',
                    padding: '2px',
                  }}
                >
                  <CRow>
                    <CCol xs={6}>
                      <span>{wo.wo_id}</span>
                    </CCol>
                    <CCol xs={6}>
                      <span>Q -</span>
                      <div>{wo.quantity}</div>
                    </CCol>
                  </CRow>
                </CCard>
              ))}
            </CCol>
          </CRow>
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

function GroupDropZone({
  i,
  itemIndex,
  groupIndex,
  addQuantity,
  visibleItemIndex,
  setVisibleItemIndex,
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => addQuantity(i, groupIndex, item), // Handle drop
  }))

  const toggleItemCollapse = (index) => {
    setVisibleItemIndex(visibleItemIndex === index ? null : index)
  }

  return (
    <CCard
      key={itemIndex}
      ref={drop}
      className="mb-2"
      style={{
        marginTop: '10px',
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
            width: '100%', // Ensures elements use available space
          }}
        >
          {/* Ensures order_id and the icon stay on the same line */}
          <span
            onClick={() => toggleItemCollapse(itemIndex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Adds space between text and icon
              whiteSpace: 'nowrap', // Prevents text wrapping
            }}
          >
            {i.order_id} {visibleItemIndex === itemIndex ? <FaAngleUp /> : <FaAngleDown />}
          </span>

          {/* Ensures the finished_goods / quantity stays aligned */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {i.finished_goods} / {i.quantity}
          </span>
        </div>

        <CCollapse className="custom-collapse" visible={visibleItemIndex === itemIndex}>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span>{i.sku_name}</span>
            <span>{i.dimension}</span>
            <span>{i.layers} PLY</span>
            <span>{i.print}</span>

            <span>Quantity :{i.quantity}</span>
            <span>{i.route}</span>
          </div>
          {i.layer_group.map((lg) => (
            <CCard
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
          ))}
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

const AllocateSFG = ({
  workOrders,
  setWorkOrders,
  groupOrders,
  setGroupOrders,
  autoSyncOrders,
}) => {
  const [visibleGroupIndex, setVisibleGroupIndex] = useState(null)
  const [visibleItemIndex, setVisibleItemIndex] = useState(null)
  const [advanced, setAdvanced] = useState(false)
  const [sfgData, setSfgData] = useState([
    {
      id: 'SFG-102',
      description: '60 ml - Top',
      size: '20 x 20',
      available_qty: 250,
      blocked_qty: 200,
      table_data: [
        {
          name: 'Top',
          gsm: 180,
          bf: 18,
          print: 'Flex',
          l_w: '20 x 15',
          flute: 'NA',
          color: 'Natural',
        },
        {
          name: 'C1',
          gsm: 180,
          bf: 18,
          print: 'Flex',
          l_w: '20 x 15',
          flute: 'A',
          color: 'NA',
        },
        {
          name: 'L1',
          gsm: 180,
          bf: 18,
          print: 'Flex',
          l_w: '20 x 15',
          flute: 'NA',
          color: 'NA',
        },
      ],
      work_orders: [
        {
          wo_id: 'WO-1005',
          quantity: 200,
        },
      ],
    },
    {
      id: 'SFG-103',
      description: '100 ml - Bottom',
      size: '25 x 25',
      available_qty: 300,
      blocked_qty: 150,
      table_data: [
        {
          name: 'Bottom',
          gsm: 200,
          bf: 20,
          print: 'Flex',
          l_w: '25 x 20',
          flute: 'B',
          color: 'White',
        },
        {
          name: 'C2',
          gsm: 200,
          bf: 20,
          print: 'Flex',
          l_w: '25 x 20',
          flute: 'A',
          color: 'NA',
        },
        {
          name: 'L2',
          gsm: 200,
          bf: 20,
          print: 'Flex',
          l_w: '25 x 20',
          flute: 'NA',
          color: 'NA',
        },
      ],
      work_orders: [
        {
          wo_id: 'WO-1010',
          quantity: 150,
        },
      ],
    },
  ])

  const selectStyles = {
    height: '21px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '10px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.16)',
    backgroundColor: '#ffffff',
    color: '#030303',
    fontSize: '14px',
    fontFamily: 'Roboto, sans-serif',
    lineHeight: '16px',
    outline: 'none',
  }

  const [openSFG, setOpenSFG] = useState(null)

  const addQuantity = (i, groupIndex, item) => {
    console.log('Work Order:', i)
    console.log('Group Index:', groupIndex)
    console.log('Item:', item)
    console.log('Work Orders:', workOrders)

    setGroupOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.order_id === i.wo_id) {
          console.log('Inside the if condition')
          console.log('Order:', order)

          const updatedItems = order.items.map((orderItem) =>
            orderItem.id === i.id
              ? {
                  ...orderItem,
                  finished_goods: orderItem.finished_goods + item.sfg['available_qty'],
                }
              : orderItem,
          )

          return {
            ...order,
            items: updatedItems,
          }
        }
        return order
      }),
    )
    setSfgData((prevSfgData) => prevSfgData.filter((sfg) => sfg.id !== item.sfg['id']))
  }

  const toggleGroupCollapse = (index) => {
    setVisibleGroupIndex(visibleGroupIndex === index ? null : index)
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
                  <CCardText className="mx-auto text-bold">Grouped Work Orders</CCardText>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol xs={12}>
            {groupOrders.map((group, groupIndex) => (
              <CCard
                key={groupIndex}
                className="mb-2"
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
                      width: '100%', // Ensures full width usage
                    }}
                  >
                    {/* Keeps group.name and icon on the same line */}
                    <span
                      onClick={() => toggleGroupCollapse(groupIndex)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px', // Adds spacing between text and icon
                        whiteSpace: 'nowrap', // Prevents unintended wrapping
                      }}
                    >
                      {group.name}{' '}
                      {visibleGroupIndex === groupIndex ? <FaAngleUp /> : <FaAngleDown />}
                    </span>

                    {/* Ensures the numbers stay aligned properly */}
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {group.items.reduce((sum, g) => sum + g.finished_goods, 0)} /{' '}
                      {group.items.reduce((sum, g) => sum + g.quantity, 0)}
                    </span>
                  </div>

                  <CCollapse className="custom-collapse" visible={visibleGroupIndex === groupIndex}>
                    {group.items.map((i, itemIndex) => (
                      <GroupDropZone
                        key={itemIndex}
                        i={i}
                        itemIndex={itemIndex}
                        groupIndex={groupIndex}
                        addQuantity={addQuantity}
                        visibleItemIndex={visibleItemIndex}
                        setVisibleItemIndex={setVisibleItemIndex}
                      />
                    ))}
                  </CCollapse>
                </CCardBody>
              </CCard>
            ))}
          </CCol>
        </CRow>
      </CCol>

      <CCol xs={7} className="mt-1">
        <CRow className="mt-2 px-3 py-3">
          <CCard
            className="mb-2"
            style={{
              backgroundColor: '#f5f4f7',
              borderRadius: '10px',
            }}
          >
            <CCardBody>
              <div className="d-flex fw-bold justify-content-center align-items-center">
                Returnables
              </div>
              <div
                style={{
                  height: '6px',
                  marginTop: '10px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>

              <CRow className="align-items-center mt-3">
                <CCol md="3">
                  <label>Die</label>
                  <CFormSelect style={selectStyles}>
                    <option>180</option>
                  </CFormSelect>
                </CCol>
                <CCol md="3">
                  <label>Ink</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
                <CCol md="3">
                  <label>Stereo</label>
                  <CFormSelect style={selectStyles}>
                    <option>90</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              {/* <div className="mt-3 d-flex justify-content-end">
                <CButton
                  color="light"
                  onClick={() => setAdvanced(!advanced)}
                  className="d-flex align-items-center"
                >
                  Advanced {advanced ? <FaAngleUp /> : <FaAngleDown />}
                </CButton>
              </div>

              {advanced && (
                <CRow className="mt-3">
                  <CCol md="3">
                    <label>Board Length</label>
                    <CFormSelect>
                      <option>--</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md="3">
                    <label>Board Width</label>
                    <CFormSelect>
                      <option>--</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              )} */}

              {/* <div
                style={{
                  height: '6px',
                  marginTop: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>
              {sfgData.map((sfg) => (
                <SFGDragableCard sfg={sfg} openSFG={openSFG} setOpenSFG={setOpenSFG} />
              ))} */}
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </>
  )
}

export default AllocateSFG
