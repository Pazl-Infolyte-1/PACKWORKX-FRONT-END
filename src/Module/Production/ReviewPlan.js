import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { Package, Layers } from 'lucide-react';
import { productionApi } from '../../api/production';
import { useNextHandler } from '../../Context/ProductionNextHandlerContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function ReviewPlan() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const { registerNextHandler } = useNextHandler();
  const location = useLocation();
  const navigate = useNavigate()
  

  const handleFinalisePlan = async () => {
    const groupIds = groups.map(i => i.id);
    console.log('Finalizing with groupIds:', groupIds);
    const body = {
      group_ids: groupIds,
      group_status: 'Completed',
      temporary_status: 0
    };

    
    try {
      await productionApi.finalStatusUpdate(body);
      // Optionally show a success message or redirect
      navigate('/production')
    } catch (err) {
      setError('Failed to finalize plan.');
      console.error('Finalize error:', err);
    }
  }

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams(location.search);
      const queryId = query.get('id');
      let response;
        response = await productionApi.getProductionGroups();
        setGroups(response.data.data);
      
    } catch (err) {
      setError('Failed to fetch production groups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    registerNextHandler(() => Promise.resolve(false));
    fetchGroups();
  }, []);

  const getStatusBadge = (group) => {
    if (group.balance_Qty === 0 && group.group_Qty === 0) {
      return { color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle size={10} />, text: 'Pending' };
    }
    if (group.allocated_qty && group.allocated_qty > 0) {
      return { color: 'bg-green-100 text-green-800', icon: <FaCheck size={10} />, text: 'Allocated' };
    }
    return { color: 'bg-gray-100 text-gray-800', icon: <Package size={10} />, text: 'Ready' };
  };

  const totalGroups = groups.length;
  const totalQuantity = groups.reduce((sum, group) => sum + group.group_Qty, 0);
  const allocatedGroups = groups.filter(g => g.allocated_qty > 0).length;

  const openModal = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedGroup(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="animate-pulse p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderBottom: '3px solid #5a67d8'
        }}
        className="px-4 py-3 text-white"
      >
        <div className="text-base font-semibold mb-1">
          Step 5: Review & Plan
        </div>
        <div className="text-xs opacity-90">
          Review your production groups and finalize manufacturing plan
        </div>
      </div>

      <div className="flex-1 p-4 bg-slate-50 overflow-hidden">
        {/* {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )} */}
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded border p-3 text-center">
            <div className="text-lg font-bold text-gray-900">{totalGroups}</div>
            <div className="text-xs text-gray-600">Total Groups</div>
          </div>
          <div className="bg-white rounded border p-3 text-center">
            <div className="text-lg font-bold text-gray-900">{totalQuantity}</div>
            <div className="text-xs text-gray-600">Total Quantity</div>
          </div>
          <div className="bg-white rounded border p-3 text-center">
            <div className="text-lg font-bold text-gray-900">{allocatedGroups}</div>
            <div className="text-xs text-gray-600">Allocated</div>
          </div>
        </div>

        {/* Groups Table */}
        <div className=" rounded border p-4 overflow-x-auto h-[40vh] overflow-y-auto ">
          <div className="text-sm font-semibold mb-2 text-gray-700">Production Groups</div>
          <div className="">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2 px-2 font-medium">Group ID</th>
                  <th className="py-2 px-2 font-medium">Group Name</th>
                  <th className="py-2 px-2 font-medium">Work Orders</th>
                  <th className="py-2 px-2 font-medium">Quantity</th>
                  <th className="py-2 px-2 font-medium">Allocated</th>
                  {/* <th className="py-2 px-2 font-medium">Status</th> */}
                  <th className="py-2 px-2 font-medium">Layers</th>
                  <th className="py-2 px-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const status = getStatusBadge(group);
                  return (
                    <tr key={group.id} className="border-b hover:bg-slate-50">
                      <td className="py-2 px-2 font-medium text-gray-900">{group.production_group_generate_id}</td>
                      <td className="py-2 px-2 font-medium text-gray-900">{group.group_name}</td>
                      <td className="py-2 px-2">
                        {[...new Set(group.group_value.map(v => v.work_order_id))]
                          .map(id => `#WO-${String(id).padStart(5, '0')}`)
                          .join(', ')}
                      </td>
                      <td className="py-2 px-2">{group.group_Qty}</td>
                      <td className="py-2 px-2">{group.allocated_qty || 0}</td>
                      {/* <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </td> */}
                      <td className="py-2 px-2">{group.layer_details.length}</td>
                      <td className="py-2 px-2">
                        <button
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                          onClick={() => openModal(group)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showModal && selectedGroup && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-opacity-30 backdrop-blur-sm transition-all duration-300 pt-20">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative transform transition-all duration-300 ease-out animate-slideDown"
              style={{
                animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Layers size={18} /> {selectedGroup.group_name} Details
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Work Orders: {[...new Set(selectedGroup.group_value.map(v => v.work_order_id))].map(id => `#WO-${String(id).padStart(5, '0')}`).join(', ')}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedGroup.layer_details.map((layer, index) => (
                  <div key={index} className="bg-slate-50 border rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-900">
                        {layer.layer_detail.layer}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full border ${
                          layer.layer_detail.color === 'Natural' ? 'bg-yellow-200' :
                          layer.layer_detail.color === 'Golden Yellow' ? 'bg-yellow-400' : 'bg-gray-300'
                        }`}
                        title={layer.layer_detail.color}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                      <div>GSM: <span className="font-medium">{layer.layer_detail.gsm}</span></div>
                      <div>BF: <span className="font-medium">{layer.layer_detail.bf}</span></div>
                      <div>Weight: <span className="font-medium">{layer.layer_detail.weight.toFixed(2)}</span></div>
                      <div>Material: <span className="font-medium">{layer.layer_detail.material}</span></div>
                    </div>
                    {layer.layer_detail.flute_type && (
                      <div className="text-xs text-gray-600 mt-1">
                        Flute: <span className="font-medium">{layer.layer_detail.flute_type}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Allocation Details Section */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-800 mb-2">Allocation Details</div>
                <div className="text-xs text-gray-600 mb-1">
                  <span className="font-medium">Total Allocated Quantity:</span> {selectedGroup.allocation_history?.total_allocated_qty ?? 0}
                </div>
                {/* Allocation by Inventory Table */}
                {selectedGroup.allocation_history?.allocation_by_inventory?.length > 0 ? (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-700 mb-1">By Inventory:</div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs text-left border">
                        <thead>
                          <tr className="border-b bg-slate-100">
                            <th className="py-1 px-2 font-medium">Inventory</th>
                            <th className="py-1 px-2 font-medium">Allocated Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroup.allocation_history.allocation_by_inventory.map((inv, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-1 px-2">{inv.inventory_name || '-'}</td>
                              <td className="py-1 px-2">{inv.allocated_qty ?? '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mb-2">No inventory allocations.</div>
                )}
                {/* All Allocation Records Table */}
                {selectedGroup.allocation_history?.all_allocation_records?.length > 0 ? (
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">All Allocation Records:</div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs text-left border">
                        <thead>
                          <tr className="border-b bg-slate-100">
                            <th className="py-1 px-2 font-medium">Date</th>
                            <th className="py-1 px-2 font-medium">Qty</th>
                            <th className="py-1 px-2 font-medium">By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroup.allocation_history.all_allocation_records.map((rec, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-1 px-2">{rec.date || '-'}</td>
                              <td className="py-1 px-2">{rec.qty ?? '-'}</td>
                              <td className="py-1 px-2">{rec.allocated_by || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">No allocation records.</div>
                )}
              </div>
            </div>
            <style>{`
              @keyframes slideDown {
                0% {
                  opacity: 0;
                  transform: translateY(-40px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t bg-slate-50 mt-4">
          <button
           className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
            Back to Allocation
          </button>
          <div className="flex gap-2">
            {/* <button className="px-4 py-2 text-sm border border-purple-300 text-purple-700 rounded hover:bg-purple-50 transition-colors">
              Save Draft
            </button> */}
            <button
            onClick={handleFinalisePlan}
             className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
              Finalize Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPlan;