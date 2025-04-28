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

const Grn = () => {
  const [alerts, setAlerts] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [showGrnModal, setShowGrnModal] = useState(false)
  const [grnData, setGrnData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(10)
  const searchBarRef = useRef(null)

  const fetchData = async () => {
    try {
      const response = await apiMethods.getGrn()
      if (response.status === 200) {
        setGrnData(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      id: item.grn_id,
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

  const handleSubmit = async (data) => {
    console.log('Form data', data)
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

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex flex-col lg:flex-row item-center gap-5 relative my-3">
        <h3 className="text-xl font-semibold mb-3">GRN</h3>
      </div>
      <div className="bg-white p-3 rounded-lg w-full h-full">
        <div className="flex items-center">
          <SearchBar data={grnData} text={'Grn'} ref={searchBarRef} />
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
          />
        </div>
        <div>
          <CommonPagination
            count={pagination?.totalPages || 1}
            page={pagination?.page || 1}
            onChange={(event, value) => {
              setPagination((prev) => ({
                ...prev,
                page: value,
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
          maxWidth={'1265px'}
          title={isEdit ? `Edit Grn` : `New Grn`}
        >
          <GrnForm
            grnFormData={grnFormData}
            setGrnFormData={setGrnFormData}
            onSubmit={handleSubmit}
            isEdit={isEdit}
            handleCloseDrawer={handleCloseDrawer}
          />
        </Drawer>
      </div>
    </>
  )
}

export default Grn
