import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import InvoiceTable from './InvoiceTable'
import apiMethods from '../../api/config'
import { Outlet, useParams } from 'react-router-dom'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'

function InvoiceList() {
  const [isMiniMised, setIsMinimised] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 50
  })
  const { id } = useParams();
  const { searchQuery } = useSearch()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await apiMethods.getInvoiceList({
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
    if (!isNaN(id)) {
      setIsMinimised(true);
    }
  }, [id]);

  return (
    <div className='flex flex-row'>
      <div className={`${isMiniMised ? 'w-2/6' : 'w-full'} !h-[90vh]`}>
        <ContentHeader
          heading={"invoice"}
          isMinimized={isMiniMised}
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