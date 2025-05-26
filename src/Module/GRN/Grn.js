import React, { useEffect, useRef, useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import CommonPagination from '../../components/New/Pagination'
import PopUp from '../../components/New/ModifiedPopup'
import GrnTable from './GrnTable'
import Drawer from '../../components/Drawer/Drawer'
import GrnForm from './GrnForm'
import apiMethods from '../../api/config'
import { useSearch } from '../../components/New/SearchContext'

const Grn = () => {
  const [alerts, setAlerts] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [grnData, setGrnData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(10)
  const searchBarRef = useRef(null)
  const [errors, setErrors] = useState({})
  const { searchQuery } = useSearch()
  const [refresh, setRefresh] = useState(false)

  const fetchData = async () => {
    try {
      const response = await apiMethods.getGrn({
        search: searchQuery,
        page: pagination.currentPage,
        limit: limit,
      })
      setGrnData(response?.data?.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log('Fetching data with limit:', limit, 'and searchQuery:', searchQuery)
    fetchData()
  }, [limit, searchQuery, pagination.currentPage,refresh])

  const [grnFormData, setGrnFormData] = useState({
    po_id: null,
    grn_date: '',
    delivery_note_no: '',
    invoice_no: '',
    invoice_date: '',
    received_by: '',
    notes: '',
    items: [],
  })

  const handleEdit = (item) => {
    console.log('Edit item', item)
    setGrnFormData({
      id: item.id,
      po_id: item.po_id,
      grn_date: item.grn_date,
      delivery_note_no: item.delivery_note_no,
      invoice_no: item.invoice_no,
      invoice_date: item.invoice_date,
      received_by: item.received_by,
      notes: item.notes,
      items: item.GRNItems,
    })
    setIsEdit(true)
    setDrawerOpen(true)
  }

  const handleClose = () => {
    setAlerts([])
  }
  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setGrnFormData({
      po_id: null,
      grn_date: '',
      delivery_note_no: '',
      invoice_no: '',
      invoice_date: '',
      received_by: '',
      notes: '',
      items: [],
    })
    setIsEdit(false)
  }

  const clearFilters = () => {
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
  }

  const handleSubmit = async (data) => {
    let newErrors = {}
    if (!grnFormData.po_id) newErrors.po_id = 'Required'
    if (!grnFormData.grn_date) newErrors.grn_date = 'Required'
    if (!grnFormData.delivery_note_no) newErrors.delivery_note_no = 'Required'
    if (!grnFormData.invoice_no) newErrors.invoice_no = 'Required'
    if (!grnFormData.invoice_date) newErrors.invoice_date = 'Required'
    if (!grnFormData.received_by) newErrors.received_by = 'Required'
    if (!grnFormData.notes) newErrors.notes = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setAlerts((prev) => [
        ...prev,
        { severity: 'error', message: 'Please fill all the required fields' },
      ])
    } else {
      setAlerts([])
      try {
        if (isEdit) {
          data.id = grnFormData.id
          const response = await apiMethods.editGrn(data)
          setAlerts((prev) => [
            ...prev,
            { severity: 'success', message: response.data.message || 'GRN Uopdated Successfully' },
          ])
        } else {
          const response = await apiMethods.postGrn(data)
          setAlerts((prev) => [
            ...prev,
            { severity: 'success', message: response.data.message || 'GRN Added Successfully' },
          ])
        }
        setGrnFormData({
          po_id: null,
          grn_date: '',
          delivery_note_no: '',
          invoice_no: '',
          invoice_date: '',
          received_by: '',
          notes: '',
          items: [],
        })
        setErrors({})

        await fetchData()
        handleCloseDrawer()
      } catch (error) {
        console.error(error)
        setAlerts([
          {
            severity: 'error',
            message: error?.response?.data?.message || 'Something went wrong',
          },
        ])
      }
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex flex-col lg:flex-row item-center gap-5 relative my-3">
        <h3 className="text-xl font-semibold mb-3">GRN</h3>
      </div>
      <div className="bg-white p-3 rounded-lg w-full h-full">
        <div className="flex items-center">
          <SearchBar data={grnData} text={'Grn'} ref={searchBarRef} />
          <button
            className="ml-4 border border-[#e7e5e4] bg-white text-gray-700 px-4 h-[35px] rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center gap-1"
            onClick={clearFilters}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="whitespace-nowrap">Clear</span>
          </button>

          <div className="flex-grow flex justify-end gap-3">
            <ActionButton
              variant="add"
              label={'Add GRN'}
              onClick={() => {
                setIsEdit(false)
                setDrawerOpen(true)
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap my-4">
          <GrnTable
            grnData={grnData}
            setGrnData={setGrnData}
            setAlerts={setAlerts}
            handleEdit={handleEdit}
            setRefresh={setRefresh}
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
            }}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }))
            }}
            limit={limit}
          />
        </div>
        <Drawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          maxWidth={'1350px'}
          title={isEdit ? `Edit Grn` : `New Grn`}
        >
          <GrnForm
            grnFormData={grnFormData}
            setGrnFormData={setGrnFormData}
            onSubmit={handleSubmit}
            isEdit={isEdit}
            handleCloseDrawer={handleCloseDrawer}
            errors={errors}
            setErrors={setErrors}
          />
        </Drawer>
      </div>
    </>
  )
}

export default Grn
