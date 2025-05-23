import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'

function ViewMachineData({ Id }) {
  const [machineData, setMachineData] = useState(null)
  const [AllProcess, setAllProcess] = useState([])
  const [values, setValues] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getMachineById(Id)
        setMachineData(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [Id])

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const response = await apiMethods.getProcessValues()
        const Process = await apiMethods.getByMachineId(Id)
        setAllProcess(Process.data.data)

        const allValues = response.data.data
        const machineProcesses = Process.data.data

        // Find matching process values for each machine process
        const matchedValues = machineProcesses
          .map((machineProcess) => {
            return allValues.find(
              (processValue) => processValue.process_name_id === machineProcess.process_id,
            )
          })
          .filter(Boolean)

        setValues(matchedValues)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchValues()
  }, [Id])

  console.log(values)

  if (!machineData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-black italic flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          No machine data available
        </p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 ">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{machineData.machine_name}</h2>
        <span
          className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border border-gray-300
            ${
              machineData.machine_status === 'Under Maintenance'
                ? 'bg-blue-100 text-blue-800'
                : machineData.machine_status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : machineData.machine_status === 'Inactive'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
        >
          {machineData.machine_status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wide text-black mb-2">Machine Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Machine Type</span>
              <span className="font-medium">{machineData.machine_type}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Model Number</span>
              <span className="font-medium">{machineData.model_number}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Serial Number</span>
              <span className="font-medium">{machineData.serial_number}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Manufacturer</span>
              <span className="font-medium">{machineData.manufacturer}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Location</span>
              <span className="font-medium">{machineData.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wide text-black mb-2">
            Technical Specifications
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Power Rating</span>
              <span className="font-medium">{machineData.power_rating}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">IP Address</span>
              <span className="font-medium">{machineData.ip_address}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Connectivity</span>
              <span className="font-medium">
                {machineData.connectivity_status ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Assigned Operator</span>
              <span className="font-medium">{machineData.assigned_operator}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <div className=" bg-gray-50 rounded-lg">
          <h3 className="text-sm uppercase tracking-wide text-black mb-2">Process Values</h3>
          {values.length > 0 ? (
            values.map((value, index) => (
              <div key={index} className="mb-4 bg-white p-2">
                <h4 className="text-sm">{value.ProcessName.process_name}</h4>
                <div className="grid grid-cols-3 gap-2 mt-2 ">
                  {Object.entries(value.process_value).map(([key, val]) => (
                    <div key={key} className=" p-2 rounded">
                      <span className="text-gray-600 text-sm">{key}: </span>
                      <span className="font-medium">{val || <span className='text-xs'>N/A</span>}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm text-center">No process values found.</p>
          )}
        </div>
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm uppercase tracking-wide text-black mb-2">Dates & Maintenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Purchase Date</p>
            <p className="font-medium">{formatDate(machineData.purchase_date)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Installation Date</p>
            <p className="font-medium">{formatDate(machineData.installation_date)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Last Maintenance</p>
            <p className="font-medium">{formatDate(machineData.last_maintenance)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Next Maintenance</p>
            <p className="font-medium">{formatDate(machineData.next_maintenance_due)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Warranty Expires</p>
            <p className="font-medium">{formatDate(machineData.warranty_expiry)}</p>
          </div>
        </div>
      </div>

      {machineData.remarks_notes && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wide text-black mb-2">Notes & Remarks</h3>
          <p className="text-gray-700">{machineData.remarks_notes}</p>
        </div>
      )}
    </div>
  )
}

export default ViewMachineData
