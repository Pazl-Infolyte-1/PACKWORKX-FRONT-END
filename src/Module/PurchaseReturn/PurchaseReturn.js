import React, { useEffect, useRef, useState } from 'react'
import CustomAlert from '../../components/New/CustomAlert'
import SearchBar from '../../components/New/SearchBar'
import ActionButton from '../../components/New/ActionButton'
import CommonPagination from '../../components/New/Pagination'
import PurchaseReturnTable from './PurchaseReturnTable'
import Drawer from '../../components/Drawer/Drawer'
import apiMethods from '../../api/config'
import { useSearch } from '../../components/New/SearchContext'
import PurchaseReturnForm from './PurchaseReturnForm'
import AddPurchaseOrderReturn from './AddPurchaseReturn'  

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

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await apiMethods.getPurchaseReturn({
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
      const response = await apiMethods.getPurchaseOrders({
        search: searchQuery,
        page: pagination.currentPage,
        limit: limit,
      })
      console.log('podata',response?.data);
      
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
      console.log('id',id);
      
      const response = await apiMethods.getPurchaseReturn({ id })
      console.log('response',response);
      
      const approvedList = Array.isArray(response?.data?.approved)
      ? response.data.approved
      : []     
      console.log('approvedList',approvedList);
      
      const matchedPor = approvedList.find(item => item.id === id)
      console.log('matchedpor',matchedPor);
      
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
    console.log('po_return',po_return)
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
  }

  const clearFilters = () => {
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="flex flex-col lg:flex-row item-center gap-5 relative my-3">
        <h3 className="text-xl font-semibold mb-3">Purchase Return</h3>
      </div>
      <div className="bg-white p-3 rounded-lg w-full h-full">
        <div className="flex items-center">
          <SearchBar data={porData} text={'Purchase Return'} ref={searchBarRef} />
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
          <div className="ml-auto flex gap-2">
                  <ActionButton label="Add Purchase Return" onClick={handleAddNew} variant="add" />
          </div>
        </div>      
        
        

        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap my-4">
          <PurchaseReturnTable
            porData={porData}
            setPorData={setPorData}
            setAlerts={setAlerts}
            handleEdit={handleEdit}
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
                currentPage: 1,
              }))
            }}
            limit={limit}
          />
        </div>
        <Drawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          maxWidth={"1270px"}
          title={isPorEdit ? "Edit Purchase Order Return" : "Add Purchase Order Return"}
        >
          <AddPurchaseOrderReturn
            isPorEdit={isPorEdit}
            selectedPorId={selectedPorId}
            selectedPoId={selectedPoId}
            setDrawer={setDrawerOpen}
            handlePurchaseDetails={handlePurchaseDetails}
            fetchData={fetchData}
            poData={poData}
          />
        </Drawer>
      </div>
    </>
  )
}

export default PurchaseOrderReturn