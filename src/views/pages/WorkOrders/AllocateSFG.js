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
  CFormSelect,
  CCardHeader,
  CTable,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAngleDown, FaAngleUp, FaEllipsisV, FaRedoAlt, FaEye } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilBriefcase, cilMinus, cilClipboard, cilCut, cilOptions, cilReload } from '@coreui/icons'

const AllocateSFG = ({ workOrders, groupOrders }) => {
  const [visibleGroupIndex, setVisibleGroupIndex] = useState(null)
  const [visibleItemIndex, setVisibleItemIndex] = useState(null)
  const [advanced, setAdvanced] = useState(false)
  const [openSFG, setOpenSFG] = useState(false)
  const [sfgData, setSfgData] = useState([
    {
      id: 1,
      name: 'Top',
      gsm: 180,
      bf: 18,
      print: 'flex',
      lw: '20 X 15',
      flute: 'NA',
      color: 'Natural',
    },
    {
      id: 1,
      name: 'C1',
      gsm: 180,
      bf: 18,
      print: 'flex',
      lw: '20 X 15',
      flute: 'A',
      color: 'NA',
    },
    {
      id: 1,
      name: 'L1',
      gsm: 180,
      bf: 18,
      print: 'flex',
      lw: '20 X 15',
      flute: 'NA',
      color: 'NA',
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

  const toggleGroupCollapse = (index) => {
    setVisibleGroupIndex(visibleGroupIndex === index ? null : index)
  }

  const toggleItemCollapse = (index) => {
    setVisibleItemIndex(visibleItemIndex === index ? null : index)
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
                    }}
                  >
                    <span onClick={() => toggleGroupCollapse(groupIndex)}>
                      {group.name}{' '}
                      {visibleGroupIndex === groupIndex ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                    {group.items.reduce((sum, g) => sum + g.finished_goods, 0)} /
                    {group.items.reduce((sum, g) => sum + g.quantity, 0)}
                  </div>

                  <CCollapse visible={visibleGroupIndex === groupIndex}>
                    {group.items.map((i, itemIndex) => (
                      <CCard
                        key={itemIndex}
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
                            }}
                          >
                            <span onClick={() => toggleItemCollapse(itemIndex)}>
                              {i.order_id}{' '}
                              {visibleItemIndex === itemIndex ? <FaAngleUp /> : <FaAngleDown />}
                            </span>
                            <span
                              style={{
                                fontSize: '16px',
                                lineHeight: '21px',
                              }}
                            >
                              {i.finished_goods} / {i.quantity}
                            </span>
                          </div>

                          <CCollapse visible={visibleItemIndex === itemIndex}>
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

                {/* Advanced Toggle Button */}
                <CCol md="2" className="d-flex justify-content-end">
                  <CButton
                    color="light"
                    onClick={() => setAdvanced(!advanced)}
                    className="d-flex align-items-center"
                  >
                    Advanced {advanced ? <cilArrowTop size={20} /> : <cilArrowBottom size={20} />}
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

              <div
                style={{
                  height: '6px',
                  marginTop: '10px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>
              <CCard className="mt-3">
                <CCardBody>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <span onClick={() => setOpenSFG(!openSFG)}>
                      SFG - 102 {openSFG === true ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        lineHeight: '21px',
                      }}
                    >
                      <CIcon
                        icon={cilOptions}
                        className="me-2 hover-pointer"
                        style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                      />
                    </span>
                  </div>

                  <CCollapse visible={openSFG}>
                    <CRow className="align-items-center mt-3 mb-2">
                      <CCol md="3">
                        <span>60 ml - Top</span>
                      </CCol>
                      <CCol md="3">
                        <span> 20 x 20</span>
                      </CCol>
                      <CCol md="3">
                        <span>Available Qty : 250</span>
                      </CCol>
                      <CCol md="3">
                        <span>Blocked Qty : 200</span>
                      </CCol>
                    </CRow>
                    <hr />
                    <CRow className="mt-3">
                      <CCol xs={9}>
                        <CTable>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell scope="col"></CTableHeaderCell>
                              <CTableHeaderCell scope="col">GSM</CTableHeaderCell>
                              <CTableHeaderCell scope="col">BF</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Print</CTableHeaderCell>
                              <CTableHeaderCell scope="col">L x W</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Flute</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {sfgData.map((sfg, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{sfg.name}</CTableDataCell>
                                <CTableDataCell>{sfg.gsm}</CTableDataCell>
                                <CTableDataCell>{sfg.bf}</CTableDataCell>
                                <CTableDataCell>{sfg.print}</CTableDataCell>
                                <CTableDataCell>{sfg.lw}</CTableDataCell>
                                <CTableDataCell>{sfg.flute}</CTableDataCell>
                                <CTableDataCell>{sfg.color}</CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </CCol>
                      <CCol xs={3}>
                        <CCard
                          style={{
                            height: '63px',
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.16)',
                          }}
                        >
                          <CRow>
                            <CCol xs={6}>
                              <span>Work Order</span>
                              <div>WO - 1005</div>
                            </CCol>
                            <CCol xs={6}>
                              <span>Quantity</span>
                              <div>200</div>
                            </CCol>
                          </CRow>
                        </CCard>
                      </CCol>
                    </CRow>

                    {/* {i.layer_group.map((lg) => (
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
                    ))} */}
                  </CCollapse>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </>
  )
}

export default AllocateSFG
