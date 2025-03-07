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
import { cilOptions, cilBriefcase, cilCut, cilClipboard, cilTrash } from '@coreui/icons'
import { useDrag, useDrop } from 'react-dnd'
import './styles.css'
import ProgressBar from './ProgressBar'
import Dropdown from 'react-bootstrap/Dropdown'

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

function SFGDragableCard({ sfg, openSFG, setOpenSFG, setVisibleSplit }) {
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
            width: '100%',
          }}
        >
          <span
            onClick={() => toggleCollapse(sfg.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            {sfg.id} {openSFG === sfg.id ? <FaAngleUp /> : <FaAngleDown />}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('View Work Order')}>
                  <CIcon
                    icon={cilBriefcase}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                  View Work Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('View Sales Order')}>
                  <CIcon
                    icon={cilClipboard}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                  View Sales Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Remove from Plan')}>
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
              <CTable striped hover className="border-none">
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
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.16)',
                    marginTop: '10px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <CRow className="w-100 text-center p-1">
                    <CCol xs={6} className="flex flex-col items-center">
                      <span className="font-semibold text-xs">Work Order</span>
                      <div className="mt-1 text-xs">{wo.wo_id}</div>
                    </CCol>
                    <CCol xs={6} className="flex flex-col items-center">
                      <span className="font-semibold text-xs">Quantity</span>
                      <div className="mt-1 text-xs">{wo.quantity}</div>
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
  setVisibleSplit,
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
            width: '100%',
          }}
        >
          <span
            onClick={() => toggleItemCollapse(itemIndex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            {i.order_id ? i.order_id : i.layer_name}{' '}
            {visibleItemIndex === itemIndex ? <FaAngleUp /> : <FaAngleDown />}
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
            {i.quantity ? (
              <>
                {`${i.finished_goods} / ${i.quantity}`}
                <div
                  style={{ marginLeft: '10px', marginRight: '10px', width: '45px', height: '40px' }}
                >
                  <ProgressBar
                    value={Math.min(
                      Math.max(parseFloat(((i.finished_goods / i.quantity) * 100).toFixed(1)), 0),
                      100,
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                {`80 / 100`}
                <div
                  style={{ marginLeft: '10px', marginRight: '10px', width: '45px', height: '40px' }}
                >
                  <ProgressBar value={80} />
                </div>
              </>
            )}
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('View Work Order')}>
                  <CIcon
                    icon={cilBriefcase}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                  View Work Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('View Sales Order')}>
                  <CIcon
                    icon={cilClipboard}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                  View Sales Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Remove from Plan')}>
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

const AllocateSFG = ({
  workOrders,
  setWorkOrders,
  groupOrders,
  setGroupOrders,
  autoSyncOrders,
  setVisibleSplit,
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
                    <span
                      onClick={() => toggleGroupCollapse(groupIndex)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px', // Ensures spacing between text and icon
                        whiteSpace: 'nowrap', // Prevents wrapping
                      }}
                    >
                      {group.name}{' '}
                      {visibleGroupIndex === groupIndex ? <FaAngleUp /> : <FaAngleDown />}
                    </span>

                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px', // Ensures proper spacing
                        whiteSpace: 'nowrap', // Prevents breaking into a new line
                      }}
                    >
                      {group.items.reduce(
                        (sum, g) => (g.finished_goods ? sum + g.finished_goods : sum + 0),
                        0,
                      )}{' '}
                      /
                      {group.items.reduce((sum, g) => (g.quantity ? sum + g.quantity : sum + 0), 0)}
                      <div style={{ marginLeft: '10px', width: '45px', height: '40px' }}>
                        <ProgressBar
                          value={Math.min(
                            Math.max(
                              (() => {
                                const totalFinishedGoods = group.items.reduce(
                                  (sum, g) => sum + (g.finished_goods || 0),
                                  0,
                                )
                                const totalQuantity = group.items.reduce(
                                  (sum, g) => sum + (g.quantity || 0),
                                  0,
                                )

                                if (totalQuantity < 1) return 0

                                const percentage = (totalFinishedGoods / totalQuantity) * 100

                                return parseFloat(percentage.toFixed(1)) // Ensure only one decimal place
                              })(),
                              0,
                            ),
                            100,
                          )}
                        />
                      </div>
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
                        setVisibleSplit={setVisibleSplit}
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
                Semi Finished Goods
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
                  <label>SKU</label>
                  <CFormSelect style={selectStyles}>
                    <option>60 ml</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Client</label>
                  <CFormSelect style={selectStyles}>
                    <option>MERK</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Ply</label>
                  <CFormSelect style={selectStyles}>
                    <option>3</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>GSM</label>
                  <CFormSelect style={selectStyles}>
                    <option>180</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>BF</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Flute</label>
                  <CFormSelect style={selectStyles}>
                    <option>A</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <div className="mt-3 d-flex justify-content-end">
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
              )}

              <div
                style={{
                  height: '6px',
                  marginTop: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>
              {sfgData.map((sfg) => (
                <SFGDragableCard
                  sfg={sfg}
                  openSFG={openSFG}
                  setOpenSFG={setOpenSFG}
                  setVisibleSplit={setVisibleSplit}
                />
              ))}
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </>
  )
}

export default AllocateSFG
