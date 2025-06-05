import React, { useEffect, useState } from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import { FaClipboardList, FaBox, FaCalendarAlt, FaPlus, FaMinus } from 'react-icons/fa'
import apiMethods from '../../api/config'

function WorkOrderListing({ workOrders,activeTab,isNextStepClicked,setActiveTab}) {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleWorkOrderProduction = async () => {
      if (isNextStepClicked && activeTab === "Work Orders") {
        try {
          if (selectedOrders.length === 0) {
            setError("Please select at least one work order")
            return
          }

          const body = {
            workOrderIds: selectedOrders,
            production: 'in_production'
          }
          
          const response = await apiMethods.addWorkOrderIntoProduction(body)
          setActiveTab('Group Layers')
          console.log('Work orders added to production:', response)
          setError(null)
        } catch (err) {
          console.error('Error adding work orders to production:', err)
          setError(err.message || 'Failed to add work orders to production')
        }
      }
    }

    handleWorkOrderProduction()
  }, [isNextStepClicked])
  

  // useEffect(() => {
  //   if (onSelectedOrdersChange) {
  //     onSelectedOrdersChange(selectedOrders)
  //   }
  // }, [selectedOrders, onSelectedOrdersChange])

  const handleOrderToggle = (workOrderId) => {
    setSelectedOrders(prev => 
      prev.includes(workOrderId)
        ? prev.filter(id => id !== workOrderId)
        : [...prev, workOrderId]
    )
  }

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-GB') : '-'
  }

  return (
    <CCol xs={12}>
      <CCard className="border-0 rounded-lg shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <CCardBody className="p-0">
          {workOrders?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th className="text-secondary py-3" style={{ fontWeight: '500' }}>Work Order ID</th>
                    <th className="text-secondary py-3" style={{ fontWeight: '500' }}>SKU</th>
                    <th className="text-secondary py-3" style={{ fontWeight: '500' }}>Quantity</th>
                    <th className="text-secondary py-3" style={{ fontWeight: '500' }}>Expected Delivery</th>
                    <th style={{ width: '40px', padding: '1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={selectedOrders.includes(order.id) ? 'selected-row' : ''}
                      style={{ 
                        backgroundColor: selectedOrders.includes(order.id) ? '#f8f9fa' : 'transparent',
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => !selectedOrders.includes(order.id) && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="py-3">
                        <span style={{ 
                          color: '#2c3e50', 
                          fontWeight: '500',
                          fontSize: '0.95rem'
                        }}>
                          {order.work_generate_id}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          <FaBox style={{ color: '#8761e5', fontSize: '0.9rem' }} />
                          <span style={{ color: '#2c3e50' }}>{order.sku_name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2" 
                          style={{ 
                            backgroundColor: '#8761e5',
                            color: 'white',
                            fontWeight: '500'
                          }}>
                          {order.qty}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <FaCalendarAlt style={{ fontSize: '0.9rem', color: '#8761e5' }} />
                          <span>{formatDate(order.edd)}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleOrderToggle(order.id)}
                          className="btn btn-sm p-0"
                          style={{
                            backgroundColor: selectedOrders.includes(order.id) ? '#dc3545' : '#8761e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            fontSize: '0.75rem'
                          }}
                        >
                          {selectedOrders.includes(order.id) ? <FaMinus size={10} /> : <FaPlus size={10} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="text-secondary">
                <FaClipboardList className="mb-3" style={{ fontSize: '2.5rem', color: '#8761e5' }} />
                <h6 className="mb-2" style={{ color: '#2c3e50', fontWeight: '500' }}>No Work Orders Found</h6>
                <p className="small mb-0">There are no work orders to display at the moment.</p>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default WorkOrderListing