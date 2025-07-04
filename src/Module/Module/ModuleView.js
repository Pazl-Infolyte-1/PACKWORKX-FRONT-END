import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { moduleApi } from '../../api/module'
import { capitalize } from 'lodash'
import { CloseButton } from 'react-bootstrap'
import { Close } from '@mui/icons-material'

function ModuleView() {
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await moduleApi.getModuleById(id)
        setModule(response.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-70px)] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="h-[calc(100vh-70px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Module not found</h2>
          <p className="text-sm text-gray-600">The requested module could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-70px)] overflow-y-scroll w-full p-3">
      <div className="w-full">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {capitalize(module.module_name)}
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(module.status)}`}
              >
                {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
              </div>
              <Close onClick={() => navigate('/data_transfer')} className="cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Processing Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <h2 className="text-base font-medium text-gray-900 mb-4">Processing Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{module.total_records}</div>
                <div className="text-xs text-blue-600 font-medium">Total Records</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{module.processed_records}</div>
                <div className="text-xs text-green-600 font-medium">Processed</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{module.failed_records}</div>
                <div className="text-xs text-red-600 font-medium">Failed</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round((module.processed_records / module.total_records) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(module.processed_records / module.total_records) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          {/* Column Mapping - Moved to top */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <h2 className="text-base font-medium text-gray-900 mb-4">Column Mapping</h2>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Column Index
                    </th> */}
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Field Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(module.column_mapping || {}).map(([index, fieldName]) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {/* <td className="px-3 py-2 text-sm font-mono text-gray-500">{index}</td> */}
                      <td className="px-3 py-2 text-sm text-gray-900 font-medium">{fieldName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* File Information and Timeline in single row - 75% and 25% */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* File Information - 75% width (3 columns out of 4) */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h2 className="text-base font-medium text-gray-900 mb-4">File Information</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    File Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                    {module.file_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email Sent
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        module.email_sent
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {module.email_sent ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Timeline - 25% width (1 column out of 4) */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h2 className="text-base font-medium text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-900">Started</p>
                    <p className="text-xs text-gray-600">{formatDate(module.started_at)}</p>
                  </div>
                </div>
                {module.completed_at && (
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        module.status === 'completed' ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    ></div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-900">Completed</p>
                      <p className="text-xs text-gray-600">{formatDate(module.completed_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleView
