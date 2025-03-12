import React from 'react';

function ViewMachineData({ machineData }) {
  if (!machineData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-black italic flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          No machine data available
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'running': return 'bg-green-100 text-green-800 border-green-300';
      case 'idle': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{machineData.name}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(machineData.status)}`}>
          {machineData.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wide text-black mb-2">Machine Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID</span>
              <span className="font-medium">{machineData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">{machineData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Process Count</span>
              <span className="font-medium">{machineData.process_count}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wide text-black mb-2">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Speed</span>
              <span className="font-medium">{machineData.speed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Capacity</span>
              <span className="font-medium">{machineData.capacity}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm uppercase tracking-wide text-black mb-2">Maintenance Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Last Maintenance</p>
            <p className="font-medium">{formatDate(machineData.last_maintenance)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Next Maintenance</p>
            <p className="font-medium">{formatDate(machineData.next_maintenance)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMachineData;