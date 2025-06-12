import React, { useEffect, useState } from 'react'
import { FaClipboardList, FaBox, FaCalendarAlt, FaPlus, FaMinus, FaSort } from 'react-icons/fa'
import { useSearch } from '../../components/New/SearchContext';
import { ArrowUpDown } from 'lucide-react';
import { useNextHandler } from '../../Context/ProductionNextHandlerContext';
import { useNavigate } from 'react-router-dom';
import { productionApi } from '../../api/production';

function WorkOrderListing() {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [workOrders, setWorkOrders] = useState([]);
  const [error, setError] = useState(null);
  const {searchQuery,setGlobalPlaceholder} = useSearch()
  const { registerNextHandler } = useNextHandler();
  const [sortModalPosition, setSortModalPosition] = useState({ x: 0, y: 0, visible: false, column: null });
  const [sortParams, setSortParams] = useState({ sortBy: null, sortOrder: null });
  const navigate = useNavigate();

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
          sku_name: searchQuery,
          ...(sortParams.sortBy && { sortBy: sortParams.sortBy }), //if condition is truth then only the object is spreaded into the object else it will not b spreaded
          ...(sortParams.sortOrder && { sortOrder: sortParams.sortOrder })
        }
        const response = await productionApi.getWorkOrderInCreated(params);
        setWorkOrders(response?.data?.workOrders);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        setError(error);
      }
    };
  
    fetchWorkOrders();
  }, [searchQuery, sortParams]);


  
  

  const handleNext = async () => {
    try {
      console.log(selectedOrders)

      if (selectedOrders.length === 0) {
        setError('Please select at least one work order')
        return
      }

      const body = {
        workOrderIds: selectedOrders,
        production: 'in_production',
      }

      const response = await productionApi.addWorkOrderIntoProduction(body)

      if (response?.success || response?.status === 200) {
        setError(null);
        navigate('/production/GroupLayers');
      }
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

  return (
    <div className="w-full min-h-[calc(86vh-200px)]">
      <div className="bg-white rounded-lg shadow-sm h-full">
        <div className="p-0">
          {workOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-gray-600 text-center font-medium">Select</th>
                    <th className="p-3 text-gray-600 font-medium text-left">Sales-ID</th>
                    <th className="p-3 text-gray-600 font-medium text-left">SO-Reference</th>
                    <th className="p-3 text-gray-600 font-medium text-left">Work Order ID</th>
                    <th className="p-3 text-gray-600 font-medium text-left">Priority</th>
                    <th className="p-3 text-gray-600 font-medium text-left relative">
                      <div className="flex items-center">
                        SKU
                        <ArrowUpDown
                          onClick={(e) => openSortModal('sku_name', e)}
                          className="inline-block ml-2 text-gray-400 w-4 h-4 cursor-pointer hover:text-purple-500"
                        />
                      </div>
                    </th>
                    <th className="p-3 text-gray-600 font-medium text-left relative">
                      <div className="flex items-center">
                        Quantity
                        <ArrowUpDown
                          onClick={(e) => openSortModal('qty', e)}
                          className="inline-block ml-2 text-gray-400 w-4 h-4 cursor-pointer hover:text-purple-500"
                        />
                      </div>
                    </th>
                    <th className="p-3 text-gray-600 font-medium text-left relative">
                      <div className="flex items-center">
                        Client
                        <ArrowUpDown
                          onClick={(e) => openSortModal('client', e)}
                          className="inline-block ml-2 text-gray-400 w-4 h-4 cursor-pointer hover:text-purple-500"
                        />
                      </div>
                    </th>
                    <th className="p-3 text-gray-600 font-medium text-left">Expected Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((order) => (
                    <tr
                      key={order?.id}
                      className="transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-50"
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order?.id)}
                          onChange={() => handleOrderToggle(order?.id)}
                          className="w-[18px] h-[18px] cursor-pointer"
                          style={{
                            accentColor: selectedOrders.includes(order?.id) ? '#dc3545' : '#8761e5',
                          }}
                        />
                      </td>
                      
                      <td className="p-3">
                        <span className="text-gray-800 font-medium text-[0.95rem]">
                          {order?.sales_generate_id || 'N/A'}
                        </span>
                      </td>

                                    
                      <td className="p-3">
                        <span className="text-gray-800 font-medium text-[0.95rem]">
                          {order?.sales_ui_id || 'N/A'}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="text-gray-800 font-medium text-[0.95rem]">
                          {order?.work_generate_id || 'N/A'}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="text-gray-800 font-medium text-[0.95rem]">
                          {order?.priority || 'N/A'}
                        </span>
                      </td>


                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <FaBox className="text-purple-500 text-[0.9rem]" />
                          <span className="text-gray-800">{order?.sku_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">
                          {order?.qty || '-'}
                        </span>
                      </td>


                      <td className="p-3">
                        <span className="font-medium">
                          {order?.client || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendarAlt className="text-[0.9rem] text-purple-500" />
                          <span>{order?.edd ? formatDate(order.edd) : 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 w-full flex-1">
              <div className="text-gray-600">
                <FaClipboardList className="mb-3 mx-auto text-4xl text-purple-500" />
                <h6 className="mb-2 text-gray-800 font-medium">
                  No Work Orders Found
                </h6>
                <p className="text-sm mb-0">There are no work orders to display at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {sortModalPosition.visible && (
  <div 
    className="sort-modal fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[90px]"
    style={{
      left: `${sortModalPosition.x}px`,
      top: `${sortModalPosition.y}px`
    }}
  >
    <button
      onClick={() => handleSortChoice('asc')}
      className="w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 hover:text-purple-500"
    >
      {getSortLabel(sortModalPosition.column, 'asc')}
    </button>
    <button
      onClick={() => handleSortChoice('desc')}
      className="w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 hover:text-purple-500"
    >
      {getSortLabel(sortModalPosition.column, 'desc')}
    </button>
  </div>
)}

    </div>
  )
}

export default WorkOrderListing