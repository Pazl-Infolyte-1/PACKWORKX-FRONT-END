import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import Loading from '../../components/New/Loading'

function ProcessDetails({ id }) {
  const [processDetails, setProcessDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getProcessDetails(id)
        setProcessDetails(response?.data?.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div>
        <Loading isLoading={loading} />
      </div>
    )
  }

  if (!processDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 p-8 border border-dotted rounded-lg border-gray-300">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Process Details Found</h3>
          <p className="text-gray-600 max-w-md">
            We couldn't find any details for this process. This might be due to an invalid process
            ID or the process might have been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 max-h-[500px] overflow-y-scroll">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 mt-1">Process Details </p>
              <h1 className="text-3xl font-bold text-gray-800">
                {processDetails.ProcessName.process_name}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  processDetails.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {processDetails.status || 'unknown'}
              </span>
            </div>
          </div>
        </header>

        {/* Only render content if processDetails exists */}
        {processDetails && (
          <div className="grid grid-cols-1 gap-8">
            {/* Process Values Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Process Values</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {processDetails.process_value &&
                        Object.entries(processDetails.process_value).map(([key, value], index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {key}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcessDetails
