import { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import CommonPagination from '../../components/New/Pagination'
import ActionButton from '../../components/New/ActionButton'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import PopUp from '../../components/New/PopUp'
import DieForm from './AddEditDies'
import { Pagination, Stack } from '@mui/material'
import { IoSearch } from 'react-icons/io5'
import {skuApi} from "../../api/sku"

const DiePopupTable = ({ setSelectedDiePopup, selectedDiePopup, setisSingleViewPopup,client }) => {

  console.log("coienty val",client)
  const [dies, setDies] = useState([])
  const [openDelModal, setOpenDelModal] = useState(false)
  const [dieToDelete, setDieToDelete] = useState(null)
  const [openAddEditDies, setOpenAddEditDies] = useState(false)
  const [dieToEdit, setDieToEdit] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  })
  
  const [limit, setLimit] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const [searchText, setSearchText] = useState('')

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
  
      return () => clearTimeout(handler)
    }, [value, delay])
  
    return debouncedValue
  }
  
  // usage
  const debouncedSearch = useDebounce(searchText, 300)
  useEffect(() => {
    const fetchDies = async () => {
      try {
        const dieResponse = await skuApi.getDies({
          search: debouncedSearch.trim() || undefined,
        })
  
        if (dieResponse) {
          setDies(dieResponse.data.data)
        }
        if (dieResponse?.data) {
          const { data, page, totalPages } = dieResponse.data
  
          setDies(data)
          setPagination((prev) => ({
            ...prev,
            currentPage: Number(page),
            totalPages: Number(totalPages),
          }))
        }
      } catch (error) {
        console.error('Failed to fetch dies:', error)
      }
    }
  
    fetchDies()
  }, [refresh, debouncedSearch,pagination.currentPage])
  
  
  const handleOpenDeleteModal = (die) => {
    setDieToDelete(die)
    setOpenDelModal(true)
  }

  const handleDeleteDie = async () => {
    if (!dieToDelete) return

    try {
      const response = await skuApi.deleteDie(dieToDelete.id)
      if (response.status === 200 || response.status === 204) {
        if (selectedDiePopup?.id === dieToDelete.id) {
          setSelectedDiePopup(null)
        }
        // Refresh the list
        setRefresh((prev) => !prev)
        setOpenDelModal(false)
      } else {
        console.error('Failed to delete die:', response)
      }
    } catch (error) {
      console.error('Error deleting die:', error)
    }
  }

  const handleOpenEditModal = (die, e) => {
    e.stopPropagation()
    setDieToEdit(die)
    setOpenAddEditDies(true)
  }

  const handleCloseModal = () => {
    setOpenAddEditDies(false)
    setDieToEdit(null) // Clear the die being edited
  }
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [searchText])
  
  return (
    <>
    <div className="flex justify-between items-center m-2">
  {/* Search Input - aligned to the left */}
  <div className="flex items-center h-[35px] w-[300px] gap-[2px] border border-gray-300 rounded-md">
    <div className="bg-white h-full w-10 flex justify-center items-center rounded-l-md border-r-[1px]">
      <IoSearch />
    </div>
    <input
  type="text"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder="Search Die..."
  className="outline-none h-full w-full rounded-r-md pl-2"
/>

  </div>

  {/* Button - aligned to the right */}
  <ActionButton 
    height={7}
    variant="add" 
    label="Add Die" 
    onClick={() => {
      setDieToEdit(null) // Ensure we're not in edit mode
      setOpenAddEditDies(true)
    }}
  />
</div>

      <div className="h-[200px] overflow-y-auto border border-gray-200 custom-scrollbar">
  <CTable striped hover className="w-full m-0 text-sm">
    <CTableHead className="bg-gray-100 sticky top-0 z-10">
      <CTableRow className="text-center">
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium">
          Select Die
        </CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          Die ID
        </CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          Name
        </CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          Client
        </CTableHeaderCell>
         <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          L x W
        </CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
           Board Size
        </CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          Ups
        </CTableHeaderCell>
        {/*<CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          Status
        </CTableHeaderCell>*/}
        <CTableHeaderCell className="py-2 px-1 text-gray-600 font-medium text-start">
          Action
        </CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {dies?.length > 0 ? (
        dies.map((item) => (
          <CTableRow
            key={item.id}
            className="hover:bg-gray-50 cursor-pointer text-sm"
            onClick={() => setSelectedDiePopup(item)}
          >
            <CTableDataCell className="py-2 px-1 text-center">
              <input
                type="radio"
                name="selectedDie"
                checked={selectedDiePopup?.id === item.id}
                onChange={() => setSelectedDiePopup(item)}
                onClick={(e) => e.stopPropagation()}
              />
            </CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{item.die_id}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{item.name}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{item.client}</CTableDataCell>
                    <CTableDataCell className="py-2 px-1 text-gray-700">{item.board_length} x {item.board_width}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{item.board_size}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{item.ups}</CTableDataCell>
            {/*<CTableDataCell className="py-2 px-1 text-gray-700">
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-medium ${
                  item.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {item.status}
              </span>
            </CTableDataCell>*/}
            <CTableDataCell className="py-2 px-1 text-gray-700">
              <ThreeDotMenu
                value={[
                  {
                    label: 'Edit',
                    icon: cilPencil,
                    onClick: (e) => handleOpenEditModal(item, e),
                  },
                  {
                    label: 'Delete',
                    icon: cilTrash,
                    onClick: (e) => {
                      e.stopPropagation()
                      handleOpenDeleteModal(item)
                    },
                  },
                ]}
              />
            </CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
          <CTableDataCell colSpan={6} className="px-4 py-4 text-center text-gray-500 text-sm">
            No Die data found.
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
</div>


      {/* Confirmation Modal for Delete */}
      <ConfirmationModale
        isOpen={openDelModal}
        onClose={() => setOpenDelModal(false)}
        onConfirm={handleDeleteDie}
      />

      <div className="flex justify-end items-center gap-4 mt-[20px]">
        {/*<CommonPagination
          count={pagination?.totalPages || 1}
          page={pagination?.currentPage || 1}
          onChange={(event, value) => {
            setPagination((prev) => ({
              ...prev,
              currentPage: value,
            }))
            setRefresh((prev) => !prev)
          }}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setPagination((prev) => ({
              ...prev,
              currentPage: 1,
              pageSize: newLimit,
            }))
            setRefresh((prev) => !prev)
          }}
          limit={10}
        />*/}
          <ActionButton 
    height={7}
    variant="secondary" 
    label="Submit" 
    onClick={()=>setisSingleViewPopup(false)}
  />
              <div>
              <Stack spacing={2} alignItems="center">
  <Pagination
    count={pagination.totalPages || 1}
    page={pagination.currentPage || 1}
    onChange={(event, value) => {
      setPagination((prev) => ({
        ...prev,
        currentPage: value,
      }))
      setRefresh((prev) => !prev)
    }}
    color="secondary"
  />
</Stack>

      </div>
      </div>

      {/* Add/Edit Die Form Modal */}
      <PopUp 
        visible={openAddEditDies} 
        setVisible={setOpenAddEditDies} 
        showCloseButton={true} 
        width={'30%'} 
        height={'58%'}
        header={dieToEdit ? 'Edit Die' : 'Add New Die'}
        onClose={handleCloseModal}
      >
        <DieForm 
          dieToEdit={dieToEdit}
          setRefresh={setRefresh}
          onClose={handleCloseModal}
          setisSingleViewPopup={setisSingleViewPopup} 
          client={client}
        />
      </PopUp>
    </>
  )
}

export default DiePopupTable