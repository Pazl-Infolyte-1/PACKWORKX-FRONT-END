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
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'

const Grn = () => {
  const [alerts, setAlerts] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [grnData, setGrnData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(50)
  const [count, setCount] = useState(null)
  const searchBarRef = useRef(null)
  const [errors, setErrors] = useState({})
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const [refresh, setRefresh] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    setGlobalPlaceholder('Search GRN...')

    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  const fetchData = async () => {
    try {
      const response = await apiMethods.getGrn({
        search: searchQuery,
        page: pagination.currentPage,
        limit: limit,
      })
      setGrnData(response?.data?.data)
      setPagination(response.data.pagination)
      setCount(response.data.totalCount)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log('Fetching data with limit:', limit, 'and searchQuery:', searchQuery)
    fetchData()
  }, [limit, searchQuery, pagination.currentPage, refresh])

  const [grnFormData, setGrnFormData] = useState({
    po_id: null,
    grn_date: '',
    delivery_note_no: '',
    invoice_no: '',
    invoice_date: '',
    amount: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    total_qty: 0,
    received_by: '',
    notes: '',
    items: [],
  })

  const handleEdit = (item) => {
    console.log('Edit item', item.GRNItems)
    setGrnFormData({
      id: item.id,
      po_id: item.po_id,
      grn_date: item.grn_date,
      delivery_note_no: item.delivery_note_no,
      invoice_no: item.invoice_no,
      invoice_date: item.invoice_date,
      amount: item.amount,
      cgst_amount: item.cgst_amount,
      sgst_amount: item.sgst_amount,
      tax_amount: item.tax_amount,
      total_amount: item.total_amount,
      total_qty: item.total_qty,
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
    setIsSubmitted(false)
    setGrnFormData({
      po_id: null,
      grn_date: '',
      delivery_note_no: '',
      invoice_no: '',
      invoice_date: '',
      amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      total_qty: 0,
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
      console.log('Submited form DAta', data)
      setAlerts([])
      try {
        if (isEdit) {
          data.id = grnFormData.id
          const response = await apiMethods.editGrn(data)
          setAlerts((prev) => [
            ...prev,
            {
              severity: 'success',
              message: response?.data?.message || 'GRN Uopdated Successfully',
            },
          ])
        } else {
          const response = await apiMethods.postGrn(data)
          setAlerts((prev) => [
            ...prev,
            { severity: 'success', message: response?.data?.message || 'GRN Added Successfully' },
          ])
        }
        setGrnFormData({
          po_id: null,
          grn_date: '',
          delivery_note_no: '',
          invoice_no: '',
          invoice_date: '',
          amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          tax_amount: 0,
          total_amount: 0,
          total_qty: 0,
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
      <ContentHeader
        heading={'GRN'}
        onAddClick={() => {
          setIsEdit(false)
          setDrawerOpen(true)
        }}
      />
      <div className="">
        <div>
          <GrnTable
            grnData={grnData}
            setGrnData={setGrnData}
            setAlerts={setAlerts}
            handleEdit={handleEdit}
            setRefresh={setRefresh}
          />
        </div>
        <div className="flex justify-end items-center gap-4 mt-2 ml-4 mr-4">
          <p className="w-40 text-sm">
            Total Count: <span className="font-semibold">{count}</span>
          </p>
          <CompactPagination
            count={pagination?.totalPages || 1}
            page={pagination?.currentPage || 1}
            onPageChange={(event, value) => {
              setPagination((prev) => ({
                ...prev,
                currentPage: value,
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
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
          />
        </Drawer>
      </div>
    </>
  )
}

export default Grn
