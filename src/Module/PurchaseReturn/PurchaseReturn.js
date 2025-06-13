import React, { useEffect, useRef, useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import CommonPagination from '../../components/New/Pagination'
import PurchaseReturnTable from './PurchaseReturnTable'
import Drawer from '../../components/Drawer/Drawer'
import { useSearch } from '../../components/New/SearchContext'
import PurchaseReturnForm from './PurchaseReturnForm'
import AddPurchaseOrderReturn from './AddPurchaseReturn'
import ContentHeader from '../../components/New/ContentHeader'
import CompactPagination from '../../components/New/CompactPagination'
import { purchaseOrderApi } from '../../api/purchaseOrder'

const PurchaseOrderReturn = () => {
  const [isPorEdit, setIsPorEdit] = useState(false)
  const [selectedPorId, setSelectedPorId] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [porData, setPorData] = useState([])
  const [poData, setPoData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [limit, setLimit] = useState(50)
  const searchBarRef = useRef(null)
  const { searchQuery } = useSearch()
  const [selectedPoId, setSelectedPoId] = useState(null)
  const [resetTrigger, setResetTrigger] = useState(false)

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await purchaseOrderApi.getPurchaseReturn({
        search: searchQuery,
        page: pagination.currentPage,
        limit: limit,
      })
      setPorData(response?.data?.approved || [])
      setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, total: 0 })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [limit, searchQuery, pagination.currentPage])

  //po data
  const poFetchData = async () => {
    try {
      const response = await purchaseOrderApi.getPurchaseOrders({
        search: searchQuery,
        page: pagination.currentPage,
        limit: limit,
      })
      console.log('podata', response?.data)

      setPoData(response?.data || [])
      setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, total: 0 })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    poFetchData()
  }, [limit, searchQuery, pagination.currentPage])

  // Fetch details for editing
  const handlePurchaseDetails = async (id, setFormFields, setItems, setGrnId) => {
    try {
      console.log('id', id)

      const response = await purchaseOrderApi.getPurchaseReturn({ id })
      console.log('response', response)

      const approvedList = Array.isArray(response?.data?.approved) ? response.data.approved : []
      console.log('approvedList', approvedList)

      const matchedPor = approvedList.find((item) => item.id === id)
      console.log('matchedpor', matchedPor)

      if (matchedPor) {
        setGrnId(matchedPor.grn_id)
        // Set form fields if needed
        if (setFormFields) {
          setFormFields({
            po_id: matchedPor.po_id,
            grn_id: matchedPor.grn_id,
            return_date: matchedPor.return_date,
            reason: matchedPor.reason,
            payment_terms: matchedPor.payment_terms,
            notes: matchedPor.notes,
            status: matchedPor.status,
            total_qty: matchedPor.total_qty,
            amount: matchedPor.amount,
            cgst_amount: matchedPor.cgst_amount,
            sgst_amount: matchedPor.sgst_amount,
            tax_amount: matchedPor.tax_amount,
            total_amount: matchedPor.total_amount,
          })
        }
        if (setItems) setItems(matchedPor.items || [])
      } else {
        console.warn('No Por found for ID:', id)
      }
    } catch (error) {
      console.error('Error in handlePurchaseDetails:', error)
    }
  }

  // Handle edit button
  const handleEdit = (po_return) => {
    console.log('po_return', po_return)
    setSelectedPorId(po_return.id)
    setSelectedPoId(po_return.po_id)
    setIsPorEdit(true)
    setDrawerOpen(true)
  }

  const handleAddNew = () => {
    setIsPorEdit(false)
    setDrawerOpen(true)
    setIsPorEdit(false)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setIsPorEdit(false)
    setSelectedPorId(null)
    setSelectedPoId(null)
  }

  const clearFilters = () => {
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <ContentHeader heading={'Purchase Return'} onAddClick={handleAddNew} />

      <div>
        <div>
          <PurchaseReturnTable
            porData={porData}
            setPorData={setPorData}
            setAlerts={setAlerts}
            handleEdit={handleEdit}
          />
        </div>
        <div className="mt-2">
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
                currentPage: 1,
              }))
            }}
            entriesPerPage={limit}
          />
        </div>
        <Drawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          maxWidth={'1350px'}
          title={isPorEdit ? 'Edit Purchase Order Return' : 'Add Purchase Order Return'}
        >
          <AddPurchaseOrderReturn
            key={drawerOpen ? 'open' : 'closed'}
            onResetComplete={() => setResetTrigger(false)} // 👈 Force remount on close
            isOpen={drawerOpen}
            isPorEdit={isPorEdit}
            selectedPorId={selectedPorId}
            selectedPoId={selectedPoId}
            setDrawer={setDrawerOpen}
            handlePurchaseDetails={handlePurchaseDetails}
            fetchData={fetchData}
            poData={poData}
            resetTrigger={resetTrigger}
          />
        </Drawer>
      </div>
    </>
  )
}

export default PurchaseOrderReturn
