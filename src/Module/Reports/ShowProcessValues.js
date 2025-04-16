import React, { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import PopUp from '../../components/New/PopUp'
import AddProcessField from './AddProcessField'
import Loading from '../../components/New/Loading'

function ShowProcessValues() {
  const [processValues, setProcessValues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [fieldData, setFieldData] = useState([])

  useEffect(() => {
    fetchProcessValues()
  }, [])

  const fetchProcessValues = async () => {
    try {
      setLoading(true)
      const response = await apiMethods.getProcessValues()
      setProcessValues(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Fetch error:', error)
      setLoading(false)
    }
  }

  const handleEditClick = async (item) => {
    try {
        setEditItem({...item}); 
        setShowEditModal(true)

      const fieldsResponse = await apiMethods.getAllFileds()
      setFieldData(fieldsResponse.data.data)
      
      // Set the item to be edited
    } catch (error) {
      console.error('Error fetching fields:', error)
    }
  }

  // This function will be called when edit is completed
  const handleEditComplete = () => {
    fetchProcessValues()
    setShowEditModal(false)
  }

  if (loading) return <div className="flex justify-center p-8"><Loading/></div>
  return (
    <>
      <div className="container mx-auto p-4 max-h-[450px] overflow-y-scroll">
        <div className="grid grid-cols-2 gap-6">
          {processValues.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-2 border-b-2 border-gray-200 mx-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold ">{item.ProcessName.process_name}</h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {Object.entries(item.process_value).map(([key, value]) => (
                      <div key={key} className="bg-gray-100 p-2 rounded">
                        <span className="text-gray-600 text-sm">{key}: </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <div>
                      <p>Created by: {item.created_by_user.name}</p>
                      <p className='-my-3'>{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <div 
                      className='flex gap-2 items-center cursor-pointer hover:text-blue-600'
                      onClick={() => handleEditClick(item)}
                      title="Edit process values"
                    >
                      <CIcon icon={cilPencil} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editItem && (
        <PopUp
          visible={showEditModal}
          setVisible={setShowEditModal}
          width="700px"
          header={`Edit Process Values - ${editItem?.ProcessName?.process_name || ''}`}
          showCloseButton={true}
          overflowX="visible"
          overflowY="visible"
        >
          <AddProcessField 
            fieldData={fieldData}
            setShowProcessFields={handleEditComplete}
            isEditing={true}
            editData={editItem}
          />
        </PopUp>
      )}
    </>
  )
}

export default ShowProcessValues