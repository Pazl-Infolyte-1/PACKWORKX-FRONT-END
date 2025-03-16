import {
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CFormInput,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormSelect,
  CContainer,
} from '@coreui/react'
import React, { useState } from 'react'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilBriefcase, cilClipboard, cilCut, cilTrash, cilOptions } from '@coreui/icons'
import './styles.css'

function Outsource_Preview({ workOrders, setWorkOrders, setVisibleSplit }) {
  const [groupVisibleIndex, setGroupVisibleIndex] = useState(null)

  const toggleCollapse = (id) => {
    setGroupVisibleIndex((prevIndex) => (prevIndex === id ? null : id))
  }

  const removeWOFromPlan = (item) => {
    setWorkOrders((prevOrders) => prevOrders.filter((wo) => wo.id !== item.id))
  }

  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      return (
        <div
          ref={ref}
          style={{
            ...style,
            border: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '8px 0',
          }}
          className={`${className || ''}`}
          aria-labelledby={labeledBy}
        >
          {children}
        </div>
      )
    },
  )

  return (
    <CContainer fluid className="p-0">
      <CRow className="g-0 my-2">
        <CCol md={4}>
          <div className="bg-success text-white d-flex align-items-center justify-content-center" style={{ height: '48px' }}>
            <span className="m-0">Completely Planned Orders</span>
          </div>
          <div className="mx-2">
            {workOrders.map((item) => (
              <CCard key={item.id} className="mt-2">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center cursor-pointer w-100">
                    <span
                      onClick={() => toggleCollapse(item.id)}
                      className="d-flex align-items-center"
                    >
                      {item.order_id ? item.order_id : `${item.layer_name}, ${item.wo}`}
                      {groupVisibleIndex === item.id ? (
                        <FaAngleUp className="ms-2" />
                      ) : (
                        <FaAngleDown className="ms-2" />
                      )}
                    </span>

                    <div className="d-flex justify-content-end align-items-center gap-3">
                      <span className="fs-6 text-center" style={{ width: '80px' }}>
                        {item.quantity ? `${item.finished_goods} / ${item.quantity}` : ''}
                      </span>

                      <CDropdown>
                        <CDropdownToggle
                          className="p-0 m-0 bg-transparent border-0"
                          style={{ boxShadow: 'none' }}
                          caret={false}
                        >
                          <CIcon
                            icon={cilOptions}
                            className="me-2 cursor-pointer"
                            style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                          />
                        </CDropdownToggle>
                        <CDropdownMenu as={CustomMenu}>
                          <CDropdownItem onClick={() => console.log('View Work Order', item)}>
                            <CIcon
                              icon={cilBriefcase}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            View Work Order
                          </CDropdownItem>
                          <CDropdownItem onClick={() => console.log('View Sales Order', item)}>
                            <CIcon
                              icon={cilClipboard}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            View Sales Order
                          </CDropdownItem>
                          <CDropdownItem onClick={() => removeWOFromPlan(item)}>
                            <CIcon
                              icon={cilTrash}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            Remove from Plan
                          </CDropdownItem>
                          <CDropdownItem onClick={() => setVisibleSplit(true)}>
                            <CIcon
                              icon={cilCut}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            Split Work Order
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>
                  </div>

                  <CCollapse className="custom-collapse" visible={groupVisibleIndex === item.id}>
                    <div className="d-flex justify-content-end w-100 mb-3">
                      <div style={{ width: '150px' }}>
                        <CFormSelect size="sm">
                          <option value="">Select an option</option>
                          <option value="outsource">Out Source</option>
                          <option value="purchase_rm">Purchase RM</option>
                        </CFormSelect>
                      </div>
                    </div>

                    <CRow className="ps-2 text-start">
                      <CCol>
                        <p className="mb-1">Sku name: {item.sku_name}</p>
                        <p className="mb-1">Layers: {item.layers}</p>
                        <p className="mb-1">Print: {item.print}</p>
                        <p className="mb-1">Dimensions(mm): {item.dimension}</p>
                        <p className="mb-1">Planned Start: {item.planned_start}</p>
                        <p className="mb-1">Planned End: {item.planned_end}</p>
                        <p className="mb-1">Quantity: {item.quantity}</p>
                        <p className="mb-1">Route: {item.route}</p>
                        <p className="mb-1">Quantity to manufacture:</p>

                        <div className="d-flex align-items-center">
                          <p className="m-0">Finished Goods:</p>
                          <div className="ms-3" style={{ width: '160px' }}>
                            <CFormInput
                              type="number"
                              size="sm"
                              className="text-center"
                            />
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCollapse>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>
        <CCol md={8}>
          <div className="bg-warning text-white d-flex align-items-center justify-content-center" style={{ height: '48px' }}>
            <p className="m-0">Unfulfilled Orders</p>
          </div>
          <div className="mx-3">
            {workOrders.map((item) => (
              <CCard key={item.id} className="mt-2">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center cursor-pointer w-100">
                    <span
                      onClick={() => toggleCollapse(item.id)}
                      className="d-flex align-items-center"
                    >
                      {item.order_id ? item.order_id : `${item.layer_name}, ${item.wo}`}
                      {groupVisibleIndex === item.id ? (
                        <FaAngleUp className="ms-2" />
                      ) : (
                        <FaAngleDown className="ms-2" />
                      )}
                    </span>

                    <div className="d-flex justify-content-end align-items-center gap-3">
                      <div style={{ width: '150px' }}>
                        <CFormSelect size="sm">
                          <option value="">Select an option</option>
                          <option value="outsource">Out Source</option>
                          <option value="purchase_rm">Purchase RM</option>
                        </CFormSelect>
                      </div>

                      <span className="fs-6 text-center" style={{ width: '96px' }}>
                        {item.quantity ? `${item.finished_goods} / ${item.quantity}` : ''}
                      </span>

                      <CDropdown>
                        <CDropdownToggle
                          className="p-0 m-0 bg-transparent border-0"
                          style={{ boxShadow: 'none' }}
                          caret={false}
                        >
                          <CIcon
                            icon={cilOptions}
                            className="me-2 cursor-pointer"
                            style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                          />
                        </CDropdownToggle>
                        <CDropdownMenu as={CustomMenu}>
                          <CDropdownItem onClick={() => console.log('View Work Order', item)}>
                            <CIcon
                              icon={cilBriefcase}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            Out Source
                          </CDropdownItem>
                          <CDropdownItem onClick={() => console.log('View Sales Order', item)}>
                            <CIcon
                              icon={cilClipboard}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            Raise PO
                          </CDropdownItem>
                          <CDropdownItem onClick={() => removeWOFromPlan(item)}>
                            <CIcon
                              icon={cilTrash}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            Remove from Plan
                          </CDropdownItem>
                          <CDropdownItem onClick={() => setVisibleSplit(true)}>
                            <CIcon
                              icon={cilCut}
                              className="me-2"
                              style={{ color: '#8167e5', fontSize: '1.4rem' }}
                            />
                            Split Work Order
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>
                  </div>

                  <CCollapse className="custom-collapse" visible={groupVisibleIndex === item.id}>
                    <CRow className="ps-2 text-start">
                      <CCol>
                        <p className="mb-1">Sku name: {item.sku_name}</p>
                        <p className="mb-1">Layers: {item.layers}</p>
                        <p className="mb-1">Print: {item.print}</p>
                        <p className="mb-1">Dimensions(mm): {item.dimension}</p>
                        <p className="mb-1">Planned Start: {item.planned_start}</p>
                        <p className="mb-1">Planned End: {item.planned_end}</p>
                        <p className="mb-1">Quantity: {item.quantity}</p>
                        <p className="mb-1">Route: {item.route}</p>
                        <p className="mb-1">Quantity to manufacture:</p>

                        <div className="d-flex align-items-center">
                          <p className="m-0">Finished Goods:</p>
                          <div className="ms-3" style={{ width: '160px' }}>
                            <CFormInput
                              type="number"
                              size="sm"
                              className="text-center"
                            />
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCollapse>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Outsource_Preview