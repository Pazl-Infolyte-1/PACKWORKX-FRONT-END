import React, { useEffect, useRef, useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import RouteProcessTable from './RouteProcessTable'
import CommonPagination from '../../components/New/Pagination'
import PopUp from '../../components/New/PopUp'
import { RouteProcessForm } from './RouteProcessForm'
import apiMethods from '../../api/config'
import { useSearch } from '../../components/New/SearchContext'

const RouteProcess = () => {
  const [showAddRouteProcessModal, setShowAddRouteProcessModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [routeProcessData, setRouteProcessData] = useState([])
  const [processData, setProcessData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(10)
  const searchBarRef = useRef(null)
  const { searchQuery } = useSearch()
  const [refresh, setRefresh] = useState(false)
  const [processOrder, setProcessOrder] = useState([])

  const [formData, setFormData] = useState({
    route_name: '',
    route_process: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getRoute({
          search: searchQuery,
          page: pagination.page,
          limit: limit,
        })
        console.log('Route Process:', response.data.routes)
        setRouteProcessData(response.data.routes)
        setPagination(response.data.pagination)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [refresh, limit, searchQuery])

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const response = await apiMethods.getProcess({
          search: searchQuery,
          page: 1,
          limit: 10000,
        })
        setProcessData(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProcessData()
  }, [refresh])

  const handleProcessSubmit = async (data) => {
    console.log('Form Data:', data)
    try {
      if (isEdit) {
        const response = await apiMethods.EditRoute(data)
        setAlerts((prev) => [
          ...prev,
          { severity: 'success', message: response.data.message || 'Route Updated Successfully' },
        ])
      } else {
        const response = await apiMethods.AddRoute(data)
        setAlerts((prev) => [
          ...prev,
          { severity: 'success', message: response.data.message || 'Route Added Successfully' },
        ])
      }
    } catch (error) {
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Something went wrong' },
      ])
      console.log(error)
    }
    setShowAddRouteProcessModal(false)
    setFormData({
      route_name: '',
      route_process: [],
    })
    setRefresh((prev) => !prev)
  }

  const handleEdit = (route) => {
    console.log('Edit Route:', route)
    setFormData({
      id: route.id,
      route_name: route.route_name,
      route_process: route.route_process.map((item) => item.id),
    })
    setIsEdit(true)
    setShowAddRouteProcessModal(true)
    setProcessOrder(route.route_process)
    setProcessData((prev) =>
      prev.filter((item) => !route.route_process.some((selected) => selected.id === item.id)),
    )
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex flex-col lg:flex-row item-center gap-5 relative my-3">
        <h3 className="text-xl font-semibold mb-3">Route Process</h3>
      </div>
      <div className="bg-white p-3 rounded-lg w-full h-full">
        <div className="flex items-center">
          <SearchBar data={routeProcessData} text={'Route Process'} ref={searchBarRef} />
          <div className="flex-grow flex justify-end gap-3">
            <ActionButton
              variant="add"
              label={'Add Route Process'}
              onClick={() => {
                setIsEdit(false)
                setShowAddRouteProcessModal(true)
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap my-4">
          <RouteProcessTable
            routeProcessData={routeProcessData}
            setRouteProcessData={setRouteProcessData}
            handleEdit={handleEdit}
            setAlerts={setAlerts}
          />
        </div>
        <div>
          <CommonPagination
            count={pagination?.totalPages || 1}
            page={pagination?.currentPage || 1}
            onChange={(event, value) => {
              setPagination((prev) => ({
                ...prev,
                currentPage: value,
              }))
              fetchData()
            }}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPagination((prev) => ({
                ...prev,
                currentPage: 1,
              }))
              fetchData()
            }}
            limit={limit}
          />
        </div>
        <PopUp
          visible={showAddRouteProcessModal}
          setVisible={setShowAddRouteProcessModal}
          width="900px"
          header={isEdit ? 'Edit Route Process' : 'Add Route Process'}
          showCloseButton={true}
        >
          <RouteProcessForm
            isEdit={isEdit}
            initialData={formData}
            onCancel={() => {
              setShowAddRouteProcessModal(false)
              setRefresh(!refresh)
            }}
            onSubmit={handleProcessSubmit}
            processData={processData}
            setProcessData={setProcessData}
            setRefresh={setRefresh}
            refresh={refresh}
            processOrder={processOrder}
            setProcessOrder={setProcessOrder}
          />
        </PopUp>
      </div>
    </>
  )
}

export default RouteProcess
