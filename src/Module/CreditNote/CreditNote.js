import { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import CreditNoteTable from './CreditNoteTable'
import CompactPagination from '../../components/New/CompactPagination'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { creditApi } from '../../api/credit'
import { useSearch } from '../../components/New/SearchContext'

function CreditNote() {
  const [creditNote, setCreditNote] = useState([])
  const [isMinimiseTable, setIsMinimiseTable] = useState(false)
  const { setGlobalPlaceholder, searchQuery } = useSearch()
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total: 0,
    per_page: 50,
  })

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setGlobalPlaceholder('Search Credit Notes...')
    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: pagination.current_page,
          limit: pagination.per_page,
          status: '',
          client_id: '',
          search: searchQuery,
        }
        const response = await creditApi.getCreditNotes(params)
        setCreditNote(response.data.data || [])
        setPagination(prev => ({
          ...prev,
          current_page: response.data.pagination.current_page,
          total_pages: response.data.pagination.total_pages,
          total: response.data.pagination.total,
          per_page: response.data.pagination.per_page,
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [pagination.current_page, pagination.per_page, searchQuery])

  useEffect(() => {
    if (location.pathname === '/credit-note') {
      setIsMinimiseTable(false)
    } else {
      setIsMinimiseTable(true)
    }
  }, [location.pathname])

  const fetchData = async () => {
    try {
      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        status: '',
        client_id: '',
        search: searchQuery,
      }
      const response = await creditApi.getCreditNotes(params)
      setCreditNote(response.data.data || [])
      setPagination(prev => ({
        ...prev,
        current_page: response.data.pagination.current_page,
        total_pages: response.data.pagination.total_pages,
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      <div className="flex">
        <div className={`${isMinimiseTable ? 'w-4/12' : 'w-full'}`}>
          <ContentHeader heading={'Credit Note'} onAddClick={() => navigate('/credit-note/form')} />
          <div className="">
            <CreditNoteTable
              creditNote={creditNote}
              isMinimiseTable={isMinimiseTable}
              setIsMinimiseTable={setIsMinimiseTable}
              fetchData={fetchData}
            />
          </div>
          <div className="mt-4">
            <CompactPagination
              count={pagination.total_pages}
              page={pagination.current_page}
              onPageChange={(event, value) => {
                setPagination((prev) => ({
                  ...prev,
                  current_page: value,
                }))
              }}
              entriesPerPage={pagination.per_page}
              onEntriesChange={(newLimit) => {
                setPagination((prev) => ({
                  ...prev,
                  per_page: newLimit,
                  current_page: 1,
                }))
              }}
            />
          </div>
        </div>

        {isMinimiseTable && <Outlet />}
      </div>
    </>
  )
}

export default CreditNote