import { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPencil, cilTrash } from '@coreui/icons'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import PopUp from '../../components/New/PopUp'
import FluteParametersForm from './AddEditFlute'

const FluteTypeView = () => {
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
    <div className="overflow-x-auto p-4">
      <div className="flex justify-end my-2">
        <ActionButton variant="add" label="Add Flute" onClick={handleAddNew} />
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border border-gray-300">Flute</th>
            <th className="p-3 border border-gray-300">Flute height (mm)</th>
            <th className="p-3 border border-gray-300">flutes per m</th>
            <th className="p-3 border border-gray-300">Take-up factor</th>
            <th className="p-3 border border-gray-300">Glue consumption g/m²</th>
            <th className="p-3 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-900">
          {flutesList.map((flute) => (
            <tr key={flute.id} className="bg-white border border-gray-300">
              <td className="p-3 border border-gray-300">{flute.name}</td>
              <td className="p-3 border border-gray-300">{flute.flute_height}</td>
              <td className="p-3 border border-gray-300">{flute.number_of_flutes_per_meter}</td>
              <td className="p-3 border border-gray-300">{flute.take_up_factor}</td>
              <td className="p-3 border border-gray-300">{flute.glue_consumption}</td>
              <td className="p-3 border border-gray-300">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
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