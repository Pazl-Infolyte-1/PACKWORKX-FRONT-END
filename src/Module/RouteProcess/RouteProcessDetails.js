import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import Loading from '../../components/New/Loading'
import { FaArrowDown } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { Button } from 'react-bootstrap'

const RouteProcessDetails = ({ id, handleEdit, setOpenRouteModal }) => {
  const [routeProcessDetails, setRouteProcessDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getRouteById(id)
        setRouteProcessDetails(response?.data?.data)
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

  if (!routeProcessDetails) {
    return <div className="flex justify-center text-red-500">No process details found</div>
  }
  return (
    <>
      <div className="bg-gray-50 max-h-[500px] overflow-y-scroll">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {routeProcessDetails.route_name}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    routeProcessDetails.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {routeProcessDetails.status || 'unknown'}
                </span>

                <button
                  className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md hover:bg-[#6b4fd1]"
                  type="button"
                  onClick={() => {
                    handleEdit(routeProcessDetails)
                    setOpenRouteModal({ open: false, id: null })
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="overflow-x-auto">
                  {routeProcessDetails.route_process.length > 0 ? (
                    <div className="flex flex-col items-center space-y-2">
                      {routeProcessDetails.route_process.map((process, index) => (
                        <>
                          <div className="card mt-2" style={{ width: '100%' }}>
                            <div className="card-body d-flex justify-content-center align-items-center">
                              {process.process_name}
                            </div>
                          </div>
                          {index !== routeProcessDetails.route_process.length - 1 && (
                            <FaArrowDown className="text-muted my-1" />
                          )}
                        </>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <span>No process added</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RouteProcessDetails
