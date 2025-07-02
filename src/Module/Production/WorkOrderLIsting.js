import React, { useEffect, useState, useRef } from 'react'
import { FaClipboardList, FaBox, FaCalendarAlt, FaPlus, FaMinus, FaSort, FaFilter, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useSearch } from '../../components/New/SearchContext';
import { ArrowUpDown } from 'lucide-react';
import { useNextHandler } from '../../Context/ProductionNextHandlerContext';
import { useNavigate } from 'react-router-dom';
import { productionApi } from '../../api/production';
import { clientApi } from '../../api/client';
import { skuApi } from '../../api/sku';
import { workOrderApi } from '../../api/workOrder';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Modal from 'react-modal';

function WorkOrderListing() {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [workOrders, setWorkOrders] = useState([]);
  const [error, setError] = useState(null);
  const {searchQuery,setGlobalPlaceholder} = useSearch()
  const { registerNextHandler } = useNextHandler();
  const [sortModalPosition, setSortModalPosition] = useState({ x: 0, y: 0, visible: false, column: null });
  const [sortParams, setSortParams] = useState({ sortBy: null, sortOrder: null });
  const navigate = useNavigate();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterBoxType, setFilterBoxType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const filterBtnRef = useRef(null);
  const filterPopoverRef = useRef(null);
  const datePickerRef = useRef(null);
  const [filterPopoverPos, setFilterPopoverPos] = useState({ x: 0, y: 0 });

  // Pending filter state (used in popover fields)
  const [pendingFilterCustomer, setPendingFilterCustomer] = useState('');
  const [pendingFilterBoxType, setPendingFilterBoxType] = useState('');
  const [pendingFilterStatus, setPendingFilterStatus] = useState('');

  const [clientOptions, setClientOptions] = useState([{ value: '', label: 'All Customers' }]);
  const [skuOptions, setSkuOptions] = useState([{ value: '', label: 'All Types' }]);
  const [proggressOption, setProgressOption] = useState([{ value: '', label: 'All' }]);

  // Single date range state
  const [dateRange, setDateRange] = useState([]);
  const [pendingDateRange, setPendingDateRange] = useState(null);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const [layerModalOpen, setLayerModalOpen] = useState(false);
  const [modalLayers, setModalLayers] = useState([]);
  const [modalOrderId, setModalOrderId] = useState(null);

  useEffect(() => {
    const fetchClientsAndSkus = async () => {
      try {
        // Fetch clients
        const clientResponse = await clientApi.getClients();
        const clientData = clientResponse?.data || [];
        setClientOptions([
          { value: '', label: 'All Customers' },
          ...clientData.map(client => ({ value: client.id, label: client.company_name }))
        ]);

        // Fetch SKUs
        const skuResponse = await skuApi.getSkuList();
        console.log(skuResponse)
        const skuData = skuResponse?.data || [];
        setSkuOptions([
          { value: '', label: 'All Types' },
          ...skuData.map(sku => ({ value: sku.sku_name, label: sku.sku_name }))
        ]);

        const progressOptionsResponse = await workOrderApi.getWorkOrderProgressDropDownOptions();
        const progressOptions = progressOptionsResponse?.data?.data || [];
        console.log(progressOptions)
        setProgressOption([
          { value: '', label: 'All Types' },
          ...progressOptions.map(option => ({ value: option.work_order_status, label: option.work_order_status }))
        ]);
      } catch (err) {
        console.error('Error fetching clients or SKUs:', err);
      }
    };
    fetchClientsAndSkus();
  }, []);

  // Table style objects
  const headerStyle = {
    background: '#f8fafc',
    padding: '12px 10px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '12px',
  };
  const headerStyleWithSort = {
    ...headerStyle,
    cursor: 'pointer',
  };
  const rowStyle = {
    padding: '12px 10px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '12px',
  };

  const openSortModal = (column, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSortModalPosition({
      x: rect.left,
      y: rect.bottom + 5,
      visible: true,
      column
    });
  }
  
  const handleSortChoice = (order) => {
    setSortModalPosition(prev => ({ ...prev, visible: false }));
    setSortParams({ sortBy: sortModalPosition.column, sortOrder: order });
  }

  // Close sort modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortModalPosition.visible && !event.target.closest('.sort-modal')) {
        setSortModalPosition(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sortModalPosition.visible]);

  useEffect(() => {
    setGlobalPlaceholder('Search Work Order...')
    return () => {
      setGlobalPlaceholder('Search...');
    }
  }, []);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const params = {
          skuName: filterBoxType || '',
          clientName: filterCustomer || '',
          startDate: dateRange?.[0]?.startDate ? format(dateRange[0].startDate, 'yyyy-MM-dd') : '',
          endDate: dateRange?.[0]?.endDate ? format(dateRange[0].endDate, 'yyyy-MM-dd') : '',
          progress: filterStatus || '',
          sortBy: sortParams.sortBy,
          sortOrder: sortParams.sortOrder
        };
        const response = await productionApi.getWorkOrderInCreated(params);
        setWorkOrders(response?.data?.workOrders);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        setError(error);
      }
    };
  
    fetchWorkOrders();
  }, [searchQuery, sortParams, dateRange, filterCustomer, filterBoxType, filterStatus]);

  const handleNext = async () => {
    try {
      if (selectedOrders.length > 0) {
        const body = {
          workOrderIds: selectedOrders,
          production: 'in_production',
          "temporary_status": 1,
        }

        const response = await productionApi.addWorkOrderIntoProduction(body)

        if (response?.success || response?.status === 200) {
          setError(null);
        }
      }
      navigate('/production/form/GroupLayers');
    } catch (err) {
      console.error('Error adding work orders to production:', err)
      setError(err.message || 'Failed to add work orders to production')
    }
  };

  useEffect(() => {
    registerNextHandler(handleNext);
  }, [handleNext]);

  const handleOrderToggle = (workOrderId) => {
    setSelectedOrders((prev) =>
      prev.includes(workOrderId) ? prev.filter((id) => id !== workOrderId) : [...prev, workOrderId],
    )
  }

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-GB') : '-'
  }

  const getSortLabel = (column, order) => {
    if (column === 'qty') {
      return order === 'asc' ? '1 → 100' : '100 → 1';
    }
    return order === 'asc' ? 'A → Z' : 'Z → A';
  };

  // Format date range for display
  const formatDateRange = (range) => {
    if (!range || !range.startDate || !range.endDate) {
      return 'Select date range';
    }
    
    const start = format(range.startDate, 'MMM dd, yyyy');
    const end = format(range.endDate, 'MMM dd, yyyy');
    
    if (start === end) {
      return start;
    }
    
    return `${start} - ${end}`;
  };

  // Modal handlers
  const handleOpenFilterModal = () => {
    if (filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      let left = rect.left;
      let top = rect.bottom + window.scrollY;
      const popoverWidth = 380; // px
      const popoverHeight = 350; // px (estimate)
      const margin = 8;
      if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - margin;
        if (left < margin) left = margin;
      }
      if (top + popoverHeight > window.innerHeight + window.scrollY) {
        top = window.innerHeight + window.scrollY - popoverHeight - margin;
        if (top < margin + window.scrollY) top = margin + window.scrollY;
      }
      setFilterPopoverPos({ x: left, y: top });
    }
    // Initialize pending values from real filter state
    setPendingFilterCustomer(filterCustomer);
    setPendingFilterBoxType(filterBoxType);
    setPendingFilterStatus(filterStatus);
    setPendingDateRange([...dateRange]);
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
    setShowDateRangePicker(false);
  };

  const handleApplyFilters = () => {
    setDateRange([...pendingDateRange]);
    setFilterCustomer(pendingFilterCustomer);
    setFilterBoxType(pendingFilterBoxType);
    setFilterStatus(pendingFilterStatus);
    setFilterModalOpen(false);
    setShowDateRangePicker(false);
  };

  const handleClearFilters = () => {
    setPendingFilterCustomer('');
    setPendingFilterBoxType('');
    setPendingFilterStatus('');
    setPendingDateRange([]);
    // Immediately apply cleared filters
    setDateRange([]);
    setFilterCustomer('');
    setFilterBoxType('');
    setFilterStatus('');
    setFilterModalOpen(false);
    setShowDateRangePicker(false);
  };

  const handleDateRangeChange = (item) => {
    setPendingDateRange([item.selection]);
  };

  const handleDateInputClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  // Add these style objects at the top of the component (after other style objects):
  const modalLabelStyle = {
    fontSize: 12,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 4,
    display: 'block',
  };
  const modalInputStyle = {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: 5,
    fontSize: 13,
    marginBottom: 0,
    marginTop: 2,
    cursor: 'pointer',
  };

  // Click outside to close
  useEffect(() => {
    if (!filterModalOpen) return;
    const handleClickOutside = (event) => {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(event.target) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(event.target)
      ) {
        setFilterModalOpen(false);
        setShowDateRangePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterModalOpen]);

  const openLayerModal = (layers, orderId) => {
    setModalLayers(layers);
    setModalOrderId(orderId);
    setLayerModalOpen(true);
  };

  const closeLayerModal = () => {
    setLayerModalOpen(false);
    setModalLayers([]);
    setModalOrderId(null);
  };

  return (
    <div
      style={{ 
        height: 'calc(100vh - 200px)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: '#f5f7fa',
        padding: '2px 5px'
      }}>
      <div style={{ margin: '0 auto' }}>
        {/* Screen Container */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          // boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '40px',
          overflow: 'hidden'
        }}>
          {/* Screen Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '10px 30px',
            borderBottom: '3px solid #5a67d8'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '5px' }}>
              Step 1: Select Work Orders for RM Planning
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Choose work orders to include in your raw material planning batch
            </div>
          </div>
  
          {/* Screen Content */}
          <div style={{ padding: '5px 10px' }}>
            {/* Filter Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, position: 'relative' }}>
              <button
                ref={filterBtnRef}
                onClick={handleOpenFilterModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 18px',
                  fontWeight: 500,
                  fontSize: 10,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(102,126,234,0.08)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = '#5a67d8'}
                onMouseLeave={e => e.target.style.background = '#667eea'}
              >
                <FaFilter style={{ fontSize: 15 }} />
                Filter
              </button>

              {/* Filter Popover */}
              {filterModalOpen && (
                <div
                  ref={filterPopoverRef}
                  style={{
                    position: 'fixed',
                    left: filterPopoverPos.x,
                    top: filterPopoverPos.y,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(102,126,234,0.18)',
                    padding: '24px 20px 16px 20px',
                    minWidth: 380,
                    zIndex: 100,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 14, color: '#4c51bf' }}>
                    Filter Work Orders
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                        <label style={modalLabelStyle}>Date Range</label>
                        <input
                          type="text"
                          readOnly
                          value={formatDateRange(pendingDateRange[0])}
                          onClick={handleDateInputClick}
                          style={{
                            ...modalInputStyle,
                            cursor: 'pointer',
                            background: '#f9fafb'
                          }}
                          placeholder="Click to select date range"
                        />
                        
                        {/* Inline Date Range Picker */}
                        {showDateRangePicker && (
                          <div
                            ref={datePickerRef}
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              zIndex: 1000,
                              background: 'white',
                              borderRadius: 8,
                              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                              border: '1px solid #e5e7eb',
                              marginTop: 5,
                            }}
                          >
                            <DateRange
                              editableDateInputs={true}
                              onChange={handleDateRangeChange}
                              moveRangeOnFirstSelection={false}
                              ranges={pendingDateRange}
                              direction="horizontal"
                              rangeColors={['#667eea']}
                            />
                          </div>
                        )}
                      </div>
                      
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabelStyle}>Client</label>
                        <select 
                          value={pendingFilterCustomer} 
                          onChange={e => setPendingFilterCustomer(e.target.value)} 
                          style={modalInputStyle}
                        >
                          {clientOptions?.map(opt => 
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          )}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabelStyle}>SKU</label>
                        <select 
                          value={pendingFilterBoxType} 
                          onChange={e => setPendingFilterBoxType(e.target.value)} 
                          style={modalInputStyle}
                        >
                          {skuOptions?.map(opt => 
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          )}
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabelStyle}>Progress</label>
                        <select 
                          value={pendingFilterStatus} 
                          onChange={e => setPendingFilterStatus(e.target.value)} 
                          style={modalInputStyle}
                        >
                          {proggressOption?.map(opt => 
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          )}
                        </select>
                      </div>

                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                    <button 
                      onClick={handleClearFilters} 
                      style={{
                        background: '#f3f4f6', 
                        color: '#374151', 
                        border: 'none', 
                        borderRadius: 5, 
                        padding: '7px 16px', 
                        fontWeight: 500, 
                        fontSize: 13, 
                        cursor: 'pointer',
                      }}
                    >
                      Clear
                    </button>
                    <button 
                      onClick={handleApplyFilters} 
                      style={{
                        background: '#667eea', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 5, 
                        padding: '7px 18px', 
                        fontWeight: 500, 
                        fontSize: 13, 
                        cursor: 'pointer',
                      }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
  
            <div style={{ 
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Table or No Results Message */}
              <div
              className='border'
               style={{
                height: '50vh',
                overflowY: 'auto',
                width: '100%',
              }}>
                {workOrders?.length > 0 ? (
                  <table style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    background: 'white',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    // boxShadow: '0 2px 8px rgba(102,126,234,0.10)',

                  }}>
                    <thead>
                      <tr>
                        <th style={headerStyle}>
                          {/* <input
                            type="checkbox"
                            style={{
                              width: '15px',
                              height: '15px',
                              accentColor: '#667eea'
                            }}
                          /> */}
                        </th>
                        <th style={headerStyle}>Sales-ID</th>
                        <th style={headerStyle}>SO-Reference</th>
                        <th style={headerStyle}>Work Order ID</th>
                        <th style={headerStyle}>Priority</th>
                        <th style={headerStyleWithSort}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            SKU
                            <ArrowUpDown
                              onClick={(e) => openSortModal('sku_name', e)}
                              style={{ marginLeft: 6, color: '#a0aec0', width: 16, height: 16, cursor: 'pointer' }}
                            />
                          </div>
                        </th>
                        <th style={headerStyleWithSort}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Quantity
                            <ArrowUpDown
                              onClick={(e) => openSortModal('qty', e)}
                              style={{ marginLeft: 6, color: '#a0aec0', width: 16, height: 16, cursor: 'pointer' }}
                            />
                          </div>
                        </th>
                        <th style={headerStyleWithSort}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Client
                            <ArrowUpDown
                              onClick={(e) => openSortModal('client', e)}
                              style={{ marginLeft: 6, color: '#a0aec0', width: 16, height: 16, cursor: 'pointer' }}
                            />
                          </div>
                        </th>
                        <th style={headerStyle}>Expected Delivery</th>
                        <th style={headerStyle}>Grouping Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrders.map((order) => (
                        <tr
                          key={order?.id}
                          style={{
                            borderBottom: '1px solid #f3f4f6',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <td style={rowStyle}>
                            <input
                              type="checkbox"
                              checked={order.production === 'in_production' || selectedOrders.includes(order?.id)}
                              disabled={order.production === 'in_production'}
                              onChange={() => handleOrderToggle(order?.id)}
                              style={{
                                width: '15px',
                                height: '15px',
                                accentColor: '#667eea'
                              }}
                            />
                          </td>
                          <td style={rowStyle}>{order?.salesOrder?.sales_generate_id || 'N/A'}</td>
                          <td style={rowStyle}>{order?.salesOrder?.sales_ui_id || 'N/A'}</td>
                          <td style={rowStyle}>{order?.work_generate_id || 'N/A'}</td>
                          <td style={rowStyle}>{order?.priority || 'N/A'}</td>
                          <td style={rowStyle}>{order?.sku_name || 'N/A'}</td>
                          <td style={rowStyle}>{order?.qty || '-'}</td>
                          <td style={rowStyle}>{order?.salesOrder.client || 'N/A'}</td>
                          <td style={rowStyle}>{order?.edd ? formatDate(order.edd) : 'N/A'}</td>
                          <td style={rowStyle}>
                            {order.work_order_sku_values?.every(layer => layer.layer_status === 'grouped') ? (
                              <FaCheckCircle style={{ color: 'green', fontSize: 18 }} title="All layers grouped" />
                            ) : (
                              <span style={{ display: 'inline-block' }}>
                                <FaExclamationTriangle 
                                  style={{ color: '#f59e42', fontSize: 18, cursor: 'pointer' }} 
                                  title="Some layers ungrouped"
                                  onClick={() => openLayerModal(order.work_order_sku_values, order.work_generate_id)}
                                />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#6b7280'
                  }}>
                    <h6 style={{ marginBottom: '8px', color: '#374151', fontWeight: 600 }}>
                      No Work Orders Found
                    </h6>
                    <p style={{ fontSize: '14px', margin: 0 }}>
                      {selectedOrders.length > 0 
                        ? `No work orders match your current filters. You have ${selectedOrders.length} work order(s) selected.`
                        : 'There are no work orders to display at the moment.'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons - Always show */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                padding: '20px 0'
              }}>
                <button
                  onClick={handleNext}
                  disabled={selectedOrders.length === 0}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 500,
                    cursor: selectedOrders.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    background: selectedOrders.length === 0 ? '#cbd5e0' : '#667eea',
                    color: 'white',
                    fontSize: '12px',
                    opacity: selectedOrders.length === 0 ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedOrders.length > 0) {
                      e.target.style.background = '#5a67d8';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOrders.length > 0) {
                      e.target.style.background = '#667eea';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  Continue to Layer Grouping ({selectedOrders.length})
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Sort Modal */}
        {sortModalPosition.visible && (
          <div 
            className="sort-modal"
            style={{
              position: 'fixed',
              zIndex: 50,
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              padding: '4px 0',
              minWidth: '90px',
              left: `${sortModalPosition.x}px`,
              top: `${sortModalPosition.y}px`
            }}
          >
            <button
              onClick={() => handleSortChoice('asc')}
              style={{
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#6b7280';
              }}
            >
              {getSortLabel(sortModalPosition.column, 'asc')}
            </button>
            <button
              onClick={() => handleSortChoice('desc')}
              style={{
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#6b7280';
              }}
            >
              {getSortLabel(sortModalPosition.column, 'desc')}
            </button>
          </div>
        )}

        {/* Layer Status Modal */}
        <Modal
          isOpen={layerModalOpen}
          onRequestClose={closeLayerModal}
          contentLabel="Layer Grouping Status"
          ariaHideApp={false}
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-8 border border-gray-200 max-w-md w-full shadow-lg focus:outline-none"
          overlayClassName="fixed inset-0  bg-opacity-30 z-50 flex items-center justify-center"
        >
          <div className="font-semibold text-lg mb-3 text-indigo-700">
            Layer Grouping Status
          </div>
          <div className="mb-4 text-sm text-gray-700">
            Work Order ID: <span className="font-medium">{modalOrderId}</span>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left px-2 py-1 border-b border-gray-200">Layer</th>
                <th className="text-left px-2 py-1 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {modalLayers.map((layer, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1 border-b border-gray-100">{layer.layer}</td>
                  <td className="px-2 py-1 border-b border-gray-100">
                    {layer.layer_status === 'grouped' ? (
                      <span className="text-green-600 font-medium">Grouped</span>
                    ) : (
                      <span className="text-orange-400 font-medium">Ungrouped</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-5">
            <button
              onClick={closeLayerModal}
              className="bg-indigo-600 text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-indigo-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default WorkOrderListing