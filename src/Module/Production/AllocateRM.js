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
          }}
        >
          <span
            onClick={() => toggleCollapse(sfg.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Creates space between the text and icon
              whiteSpace: 'nowrap', // Prevents text from wrapping
            }}
          >
            {sfg.id} {openSFG === sfg.id ? <FaAngleUp /> : <FaAngleDown />}
          </span>
          <span
            style={{
              fontSize: '16px',
              lineHeight: '21px',
              display: 'flex', // Ensures CIcon stays aligned properly
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
            <CCol md="2">
              <span>{sfg.gsm} GSM</span>
            </CCol>
            <CCol md="2">
              <span>{sfg.bf} BF</span>
            </CCol>
            <CCol md="2">
              <span>Deckle : {sfg.deckle}</span>
            </CCol>
            <CCol md="3">
              <span>Available Qty (KG) : {sfg.available_qty}</span>
            </CCol>
            <CCol md="3">
              <span>Blocked Qty (KG) : {sfg.blocked_qty}</span>
            </CCol>
          </CRow>
          <hr />
          <CRow className="mt-3">
            <CCol xs={6}>
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
            width: '100%', // Ensures proper space allocation
          }}
        >
          {/* Keep order_id and icon in the same row */}
          <span
            onClick={() => toggleItemCollapse(itemIndex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Adds space between text and icon
              whiteSpace: 'nowrap', // Prevents text wrapping
            }}
          >
            {i.order_id ? i.order_id : i.layer_name}{' '}
            {visibleItemIndex === itemIndex ? <FaAngleUp /> : <FaAngleDown />}
          </span>

          {/* Ensure finished_goods / quantity stay aligned */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              lineHeight: '21px',
              whiteSpace: 'nowrap',
            }}
          >
            {i.quantity ? `${i.finished_goods} / ${i.quantity}` : ''}
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
            {i.sku_name ? (
              <>
                <span>{i.sku_name}</span>
                <span>{i.dimension}</span>
                <span>{i.layers} PLY</span>
                <span>{i.print}</span>

                <span>Quantity :{i.quantity}</span>
                <span>{i.route}</span>
              </>
            ) : (
              <>
                <span>GSM - {i.gsm}</span>
                <span>BF - {i.bf}</span>
                <span>{i.dimensions} PLY</span>
                <span>{i.color}</span>
              </>
            )}
          </div>
          {i.layer_group
            ? i.layer_group.map((lg) => (
                <CCard
                  key={lg.layer_name} // Added a unique key
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
              ))
            : null}
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

const AllocateRM = ({ workOrders, setWorkOrders, groupOrders, setGroupOrders, autoSyncOrders }) => {
  const [visibleGroupIndex, setVisibleGroupIndex] = useState(null)
  const [visibleItemIndex, setVisibleItemIndex] = useState(null)
  const [advanced, setAdvanced] = useState(false)
  const [sfgData, setSfgData] = useState([
    {
      id: 'Reel 02',
      gsm: 90,
      bf: 10,
      deckle: 150,
      available_qty: 300,
      blocked_qty: 150,
      work_orders: [
        {
          wo_id: 'WO-1004',
          quantity: 200,
        },
      ],
    },
    {
      id: 'Reel 03',
      gsm: 180,
      bf: 20,
      deckle: 120,
      available_qty: 300,
      blocked_qty: 150,
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
                      width: '100%', // Ensures elements use available space
                    }}
                  >
                    {/* Ensures group.name and the icon stay on the same line */}
                    <span
                      onClick={() => toggleGroupCollapse(groupIndex)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px', // Adds space between text and icon
                        whiteSpace: 'nowrap', // Prevents text wrapping
                      }}
                    >
                      {group.name}{' '}
                      {visibleGroupIndex === groupIndex ? <FaAngleUp /> : <FaAngleDown />}
                    </span>

                    {/* Ensures numbers stay aligned */}
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {group.items.reduce(
                        (sum, g) => (g.finished_goods ? sum + g.finished_goods : sum + 0),
                        0,
                      )}{' '}
                      /
                      {group.items.reduce((sum, g) => (g.quantity ? sum + g.quantity : sum + 0), 0)}
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
                Raw Material
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
                <CCol md="2">
                  <label>GSM</label>
                  <CFormSelect style={selectStyles}>
                    <option>180</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>BF</label>
                  <CFormSelect style={selectStyles}>
                    <option>24</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Color</label>
                  <CFormSelect style={selectStyles}>
                    <option>90</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Deckle</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>

                <CCol md="2" className="d-flex justify-content-end">
                  <CButton
                    color="light"
                    onClick={() => setAdvanced(!advanced)}
                    className="d-flex align-items-center"
                  >
                    Advanced {advanced ? <FaAngleUp /> : <FaAngleDown />}
                  </CButton>
                </CCol>
              </CRow>
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
              )}
              <CRow className="align-items-center mt-3">
                <CCol md="2">
                  <label>Die</label>
                  <CFormSelect style={selectStyles}>
                    <option>180</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Ink</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Stero</label>
                  <CFormSelect style={selectStyles}>
                    <option>90</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Glue</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
                <CCol md="4">
                  <label>Stiching Wires</label>
                  <CFormSelect className="w-50" style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <div
                style={{
                  height: '6px',
                  marginTop: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>
              {sfgData.map((sfg) => (
                <SFGDragableCard sfg={sfg} openSFG={openSFG} setOpenSFG={setOpenSFG} />
              ))}
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </>
  )
}

export default AllocateRM
