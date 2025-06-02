import { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import PopUp from '../../components/New/PopUp'
import FluteParametersForm from './AddEditFlute'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const FluteTypeView = ({ onSelect }) => {
  const [flutesList, setFlutesList] = useState([])
  const [openDelModal, setOpenDelModal] = useState(false)
  const [openAddEditModal, setOpenAddEditModal] = useState(false)
  const [selectedFlute, setSelectedFlute] = useState(null)
  const [fluteToDelete, setFluteToDelete] = useState(null)

  useEffect(() => {
    fetchFluteList()
  }, [])

  const fetchFluteList = async () => {
    try {
      const response = await apiMethods.getFluteType()
      setFlutesList(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelFlute = async () => {
    try {
      await apiMethods.deleteFlute(fluteToDelete.id)
      setOpenDelModal(false)
      fetchFluteList()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (flute) => {
    setSelectedFlute(flute)
    setOpenAddEditModal(true)
  }

  const handleAddNew = () => {
    setSelectedFlute(null)
    setOpenAddEditModal(true)
  }

  const handleCloseModal = () => {
    setOpenAddEditModal(false)
    setSelectedFlute(null)
    fetchFluteList()
  }

  const handleOpenDeleteModal = (flute) => {
    setFluteToDelete(flute)
    setOpenDelModal(true)
  }

  return (
    <div className="overflow-x-auto">

      <div className="h-[200px] overflow-y-auto border border-gray-200 rounded custom-scrollbar">
  <CTable striped hover className="w-full m-0 text-sm">
    <CTableHead className="bg-gray-100 sticky top-0 z-10">
      <CTableRow className="text-center">
        <CTableHeaderCell className="py-2 px-1 font-medium text-gray-600">Flute</CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 font-medium text-gray-600">Flute height (mm)</CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 font-medium text-gray-600">Flutes per m</CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 font-medium text-gray-600">Take-up factor</CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 font-medium text-gray-600">Glue consumption g/m²</CTableHeaderCell>
        <CTableHeaderCell className="py-2 px-1 font-medium text-gray-600">Action</CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {flutesList.length > 0 ? (
        flutesList.map((flute,index) => (
              <CTableRow
          key={flute.id}
          onClick={() => onSelect(flute, index)} // Notify parent on click
          className="hover:bg-gray-100 cursor-pointer text-center"
        >
            <CTableDataCell className="py-2 px-1 text-gray-700">{flute.name}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{flute.flute_height}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{flute.number_of_flutes_per_meter}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{flute.take_up_factor}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">{flute.glue_consumption}</CTableDataCell>
            <CTableDataCell className="py-2 px-1 text-gray-700">
              <ThreeDotMenu
                value={[
                  {
                    label: 'Edit',
                    icon: cilPencil,
                    onClick: () => handleEdit(flute),
                  },
                  {
                    label: 'Delete',
                    icon: cilTrash,
                    onClick: () => handleOpenDeleteModal(flute),
                  },
                ]}
              />
            </CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
          <CTableDataCell colSpan={6} className="px-4 py-4 text-center text-gray-500 text-sm">
            No Flute data found.
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
  
</div>
      <div className="flex justify-start my-2">
        <ActionButton height={6} variant="add" label="Add Flute" onClick={handleAddNew} />
      </div>
      
      {/* Delete confirmation modal */}
      <ConfirmationModale
        isOpen={openDelModal}
        onClose={() => setOpenDelModal(false)}
        onConfirm={handleDelFlute}
      />
      
      {/* Add/Edit modal */}
      <PopUp
        visible={openAddEditModal}
        setVisible={handleCloseModal}
        showCloseButton={true}
        width={'50vw'}
        header={selectedFlute ? 'Edit Flute' : 'Add Flute'}
      >
        <FluteParametersForm 
          setOpenAddEditModal={handleCloseModal} 
          fluteToEdit={selectedFlute}
        />
      </PopUp>
    </div>
  )
}

export default FluteTypeView