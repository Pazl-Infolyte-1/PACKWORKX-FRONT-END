import React, { useEffect, useRef, useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import Drawer from '../../components/Drawer/Drawer'
import DebitNoteTable from './DebitNoteTable'
import DebitNoteForm from './DebitNoteForm'
import { useSearch } from '../../components/New/SearchContext'
import { debitApi } from '../../api/debit'

const DebitNote = () => {
  const [alerts, setAlerts] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [debitNoteData, setDebitNoteData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(50)
  const [count, setCount] = useState(null)
  const [errors, setErrors] = useState({})
  const { searchQuery, setGlobalPlaceholder } = useSearch()
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setGlobalPlaceholder('Search Debit Notes...')
    return () => setGlobalPlaceholder('Search...')
  }, [])

  const fetchData = async () => {
    
    try {
      const response = await debitApi.getDebitNotes({
        search: searchQuery,
        page: pagination.currentPage,
        limit: limit,
      })
      setDebitNoteData(response?.data?.data || [])
      setPagination(response.data.pagination)
      setCount(response.data.totalCount)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const [debitNoteFormData, setDebitNoteFormData] = useState({
    po_return_id: null,
    debit_note_date: '',
    reference_no: '',
    reason: '',
    total_amount: '',
    items: [],
  })

  const handleEdit = (item) => {
    setDebitNoteFormData({
      id: item.id,
      po_return_id: item.po_return_id,
      debit_note_date: item.debit_note_date,
      reference_no: item.reference_no,
      reason: item.reason,
      total_amount: item.total_amount,
      items: item.DebitNoteItems || [],
    })
    setIsEdit(true)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setDebitNoteFormData({
      po_return_id: null,
      debit_note_date: '',
      reference_no: '',
      reason: '',
      total_amount: '',
      items: [],
    })
    setIsEdit(false)
  }

  const handleSubmit = async (data) => {
    let newErrors = {}
    if (!data.po_return_id) newErrors.po_return_id = 'Required'
    if (!data.debit_note_date) newErrors.debit_note_date = 'Required'
    if (!data.reference_no) newErrors.reference_no = 'Required'
    if (!data.reason) newErrors.reason = 'Required'
    if (!data.total_amount) newErrors.total_amount = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setAlerts([{ severity: 'error', message: 'Please fill all required fields' }])
    } else {
      setAlerts([])
      try {
        let response
        if (isEdit) {
          data.id = debitNoteFormData.id
          response = await debitApi.editDebitNote(data)
        } else {
          response = await debitApi.postDebitNote(data)
        }
        setAlerts([{ severity: 'success', message: response?.data?.message || 'Success' }])
        await fetchData()
        handleCloseDrawer()
      } catch (error) {
        console.error(error)
        setAlerts([{ severity: 'error', message: error?.response?.data?.message || 'Error occurred' }])
      }
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <ContentHeader
        heading={'Debit Notes'}
        onAddClick={() => {
          setIsEdit(false)
          setDrawerOpen(true)
        }}
      />
      <div className="">
        <DebitNoteTable
          debitNoteData={debitNoteData}
          handleEdit={handleEdit}
          setAlerts={setAlerts}
          setRefresh={setRefresh}
        />
        <div className="flex justify-end items-center gap-4 mt-2 ml-4 mr-4">
          <p className='w-40 text-sm'>Total Count: <span className='font-semibold'>{count}</span></p>
          <CompactPagination
            count={pagination.totalPages || 1}
            page={pagination.currentPage || 1}
            onPageChange={(e, value) => setPagination(prev => ({ ...prev, currentPage: value }))}
            onEntriesChange={(newLimit) => {
              setLimit(newLimit)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
            entriesPerPage={limit}
          />
        </div>
        <Drawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          maxWidth={'1350px'}
          title={isEdit ? 'Edit Debit Note' : 'New Debit Note'}
        >
          <DebitNoteForm
            debitNoteFormData={debitNoteFormData}
            setDebitNoteFormData={setDebitNoteFormData}
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

export default DebitNote
