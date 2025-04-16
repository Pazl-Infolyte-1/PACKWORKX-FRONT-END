import { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
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

const DiePopupTable = ({ setSelectedDiePopup, selectedDiePopup, setisSingleViewPopup }) => {
  const [dies, setDies] = useState([])
  const [openDelModal, setOpenDelModal] = useState(false)
  const [dieToDelete, setDieToDelete] = useState(null)
  const [openAddEditDies, setOpenAddEditDies] = useState(false)
  const [dieToEdit, setDieToEdit] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  })
  const [limit, setLimit] = useState(10)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchDies = async () => {
      try {
        const dieResponse = await apiMethods.getDies()

        if (dieResponse) {
          setDies(dieResponse.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch dies:', error)
      }
    }

    fetchDies()
  }, [refresh])

  const handleOpenDeleteModal = (die) => {
    setDieToDelete(die)
    setOpenDelModal(true)
  }

  const handleDeleteDie = async () => {
    if (!dieToDelete) return

    try {
      const response = await apiMethods.deleteDie(dieToDelete.id)
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

  return (
    <>
      <div className="flex justify-end m-2">
        <ActionButton 
          variant="add" 
          label={'Add New Die'} 
          onClick={() => {
            setDieToEdit(null) // Ensure we're not in edit mode
            setOpenAddEditDies(true)
          }}
        />
      </div>
      <div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className="w-full m-0">
          <CTableHead className="bg-gray-100 sticky top-0 z-10">
            <CTableRow className="text-center">
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
                Select Die
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Die ID
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Name
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Client
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Status
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {dies?.length > 0 ? (
              dies.map((item) => (
                <CTableRow
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedDiePopup(item)}
                >
                  <CTableDataCell className="py-3 px-2 text-center">
                    <input
                      type="radio"
                      name="selectedDie"
                      checked={selectedDiePopup?.id === item.id}
                      onChange={() => setSelectedDiePopup(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">{item.die_id}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">{item.name}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">{item.client}</CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-2 text-gray-700">
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
                <CTableDataCell colSpan={6} className="px-4 py-4 text-center text-gray-500">
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

      <div className="flex justify-end items-center gap-4 mt-[40px]">
        <CommonPagination
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
        />
      </div>

      {/* Add/Edit Die Form Modal */}
      <PopUp 
        visible={openAddEditDies} 
        setVisible={setOpenAddEditDies} 
        showCloseButton={true} 
        width={'40%'} 
        header={dieToEdit ? 'Edit Die' : 'Add New Die'}
        onClose={handleCloseModal}
      >
        <DieForm 
          dieToEdit={dieToEdit}
          setRefresh={setRefresh}
          onClose={handleCloseModal}
          setisSingleViewPopup={setisSingleViewPopup} 
        />
      </PopUp>
    </>
  )
}

export default DiePopupTable