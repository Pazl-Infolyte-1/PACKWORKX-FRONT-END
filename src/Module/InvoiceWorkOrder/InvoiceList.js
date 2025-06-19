import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import InvoiceTable from './InvoiceTable'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'
import { workOrderApi } from '../../api/workOrder'

function InvoiceList() {
  const [isMiniMised, setIsMinimised] = useState()
  const [invoices, setInvoices] = useState([])
  const Navigate = useNavigate()
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 50
  })
  const { id } = useParams();
  const { searchQuery } = useSearch()
  const location = useLocation()


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await workOrderApi.getInvoiceList({
          search: searchQuery,
          page: pagination.page,
          limit: pagination.limit
        });
        setInvoices(response.data.invoices);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total
        }))
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, [pagination.page, pagination.limit, searchQuery]);



  useEffect(() => {
    // Check if current route includes "/salesorder/view/"
    if (location.pathname.includes('/invoice/view/')) {
      setIsMinimised(true);
    } else {
      setIsMinimised(false);
    }
  }, [location.pathname]);


  return (
    <div className='flex flex-row'>
      <div className={`${isMiniMised ? 'w-2/6' : 'w-full'} !h-[90vh]`}>
        <ContentHeader
          heading={"invoice"}
          isMinimized={isMiniMised}
          onAddClick={()=>{Navigate('form')}}
        />
        <InvoiceTable
          isMiniMised={isMiniMised}
          invoices={invoices}
        />
        <div className="flex justify-end items-center gap-4 mt-4">
          <CompactPagination
            count={pagination.totalPages}
            page={pagination.page}
            onPageChange={(event, value) =>
              setPagination(prev => ({
                ...prev,
                page: value,
              }))
            }
            onEntriesChange={(newLimit) => {
              setPagination(prev => ({
                ...prev,
                limit: newLimit,
                page: 1,
              }))
            }}
            entriesPerPage={pagination.limit}
          />
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export default InvoiceList