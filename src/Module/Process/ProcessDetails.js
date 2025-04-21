import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import ActionButton from '../../components/New/ActionButton'
import Loading from '../../components/New/Loading'

function ProcessDetails({ id, handleEditProcess }) {
  const [processDetails, setProcessDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getProcessDetails(id)
        setProcessDetails(response.data.data)
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
    return <div className="flex justify-center text-red-500">No process details found</div>
  }

  return (
    <div className="bg-gray-50 max-h-[500px] overflow-y-scroll">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 mt-1">Process Details </p>
              <h1 className="text-3xl font-bold text-gray-800">{processDetails.ProcessName.process_name}</h1>
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
              <ActionButton
                label={'Edit'}
                variant="edit"
                height={8}
                width={24}
                onClick={() => handleEditProcess(processDetails)}
              />
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
                          Parameter
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
