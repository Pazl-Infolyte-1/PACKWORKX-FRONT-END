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
import RouteProcessDetails from './RouteProcessDetails'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'

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
  const [openRouteModal, setOpenRouteModal] = useState(false)

  const [formData, setFormData] = useState({
    route_name: '',
    route_process: [],
  })

  const fetchData = async () => {
    try {
      const response = await apiMethods.getRoute({
        search: searchQuery,
        page: pagination.page,
        limit: limit,
      })
      setRouteProcessData(response.data.routes)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refresh, limit, searchQuery, pagination.page])

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
      <ContentHeader
        heading={'Route Process'}
        onAddClick={() => {
          setIsEdit(false)
          setShowAddRouteProcessModal(true)
          setProcessOrder([])
          setRefresh(!refresh)
        }}
      />
      <div className="bg-white rounded-lg w-full h-full">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap">
          <RouteProcessTable
            routeProcessData={routeProcessData}
            setRouteProcessData={setRouteProcessData}
            handleEdit={handleEdit}
            setAlerts={setAlerts}
            setOpenRouteModal={setOpenRouteModal}
          />
        </div>
        <div className='mt-4'>
          <CompactPagination
            count={pagination?.totalPages || 1}
            page={pagination?.page || 1}
            onPageChange={(event, value) => {
              setPagination((prev) => ({
                ...prev,
                page: value,
              }))
            }}
            onEntriesChange={(newLimit) => {
              setLimit(newLimit)
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }))
            }}
            entriesPerPage={limit}
          />
        </div>
        <PopUp
          visible={showAddRouteProcessModal}
          setVisible={setShowAddRouteProcessModal}
          width="900px"
          height="660px"
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
        <PopUp
          visible={openRouteModal.open}
          setVisible={(isVisible) => {
            if (!isVisible) setOpenRouteModal({ open: false, id: null })
          }}
          showCloseButton={true}
          width={'40vw'}
        >
          <RouteProcessDetails
            id={openRouteModal.id}
            handleEdit={handleEdit}
            setOpenRouteModal={setOpenRouteModal}
          />
        </PopUp>
      </div>
    </>
  )
}

export default RouteProcess
