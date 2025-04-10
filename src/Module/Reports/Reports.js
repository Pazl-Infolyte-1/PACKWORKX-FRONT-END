import { useEffect, useRef, useState } from 'react'
import ProcessDropDown from '../Machine/ProcessDropDown'
import AddButton from '../../components/New/AddButton'
import PopUp from '../../components/New/PopUp'
import AddFieldForm from '../Machine/AddFieldForm'
import ActionButton from '../../components/New/ActionButton'
import ProcessIntegrartionTable from './ProcessIntegrartionTable'
import CommonPagination from '../../components/New/Pagination'
import SearchBar from '../../components/New/SearchBar'
import apiMethods from '../../api/config'
import { useSearch } from '../../components/New/SearchContext'
import CustomAlert from '../../components/New/CustomAlert'

const Reports = () => {
  const [showAddProcessModal, setShowAddProcessModal] = useState(false)
  const [showAddFieldModal, setShowAddFieldModal] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState(null)
  const [processInputs, setProcessInputs] = useState({})
  const [isFieldModaleOpen, setIsFieldModaleOpen] = useState(false)
  const [processData, setProcessData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const { searchQuery } = useSearch()
  const searchBarRef = useRef(null)

  const fetchData = async () => {
    try {
      const response = await apiMethods.getProcess({
        search: searchQuery,
        page: pagination.page,
        limit: limit,
      })
      setProcessData(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchQuery, limit])

  const [formData, setFormData] = useState({
    process_name: '',
  })

  // const options = processData.map((process) => ({
  //   value: process.processName,
  //   label: process.processName,
  // }))

  const handleProcessChange = (selectedOption) => {
    if (selectedOption.value === 'addMore') {
      setSelectedProcess('')
    } else {
      const process = processData.find((p) => p.processName === selectedOption.value)
      setSelectedProcess(process)
    }
  }

  const handleInputChange = (e, param) => {
    setProcessInputs((prev) => ({ ...prev, [param]: e.target.value }))
  }

  const toggleModal = () => {
    setIsFieldModaleOpen(!isFieldModaleOpen)
  }

  const handleBack = () => {
    setIsViewMode(false)
    setViewData(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.process_name) {
      alert('Process name cannot be empty!')
      return
    }
    try {
      if (isEdit) {
        const response = await apiMethods.EditProcess(formData)
        setAlerts([
          { severity: 'success', message: response.data.message || 'Process Added Successfully' },
        ])
      } else {
        const response = await apiMethods.AddProcess(formData)
        setAlerts([
          { severity: 'success', message: response.data.message || 'Process updated Successfully' },
        ])
      }
    } catch (error) {
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Something went wrong' },
      ])
      console.error(error)
    }
    setShowAddProcessModal(false)
    setFormData({
      process_name: '',
    })
    await fetchData()
  }

  const addParameter = () => {
    setFormData((prev) => ({ ...prev, parameters: [...prev.parameters, ''] }))
  }

  const handleParameterChange = (e, index) => {
    const newParameters = [...formData.parameters]
    newParameters[index] = e.target.value
    setFormData((prev) => ({ ...prev, parameters: newParameters }))
  }

  const removeParameter = (index) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }))
  }

  const handleEditProcess = (process) => {
    setFormData({
      id: process.id,
      process_name: process.process_name,
    })
    setShowAddProcessModal(true)
    setIsEdit(true)
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex flex-col lg:flex-row item-center gap-5 relative my-3">
        <h3 className="text-xl font-semibold mb-3">Process Integration</h3>
        {/* Add Fields Button */}
        <div className="flex-grow flex justify-end gap-3">
          <ActionButton
            variant="add"
            label={'Add Process'}
            onClick={() => setShowAddProcessModal(true)}
          />
          <AddButton
            text="Fields"
            onClick={() => setShowAddFieldModal(true)}
            className="absolute top-3 right-3"
          />
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg w-full h-full">
        <SearchBar data={processData} text={'Process Integration'} ref={searchBarRef} />
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap my-4">
          <ProcessIntegrartionTable
            processData={processData}
            setProcessData={setProcessData}
            handleEditProcess={handleEditProcess}
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
              fetchData()
            }}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              // Reset to first page when changing limit
              setPagination((prev) => ({
                ...prev,
                currentPage: 1,
              }))
              fetchData()
            }}
            limit={limit}
          />
        </div>

        <PopUp
          visible={showAddProcessModal}
          setVisible={setShowAddProcessModal}
          width="500px"
          header="Add New Process"
          showCloseButton={true}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4 my-3 border border-gray-50 rounded-md p-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="processName" className="block text-sm font-medium text-gray-700">
                  Process Name
                </label>
                <input
                  type="text"
                  id="process_name"
                  name="process_name"
                  value={formData.process_name}
                  placeholder="Process Name"
                  onChange={handleChange}
                  className="w-full p-2 my-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8167e5] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddProcessModal(false)}
                className="text-black bg-white w-20 rounded p-1 shadow-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-[#8167e5] w-20 rounded p-1 shadow-md hover:bg-[#6b4fd1]"
              >
                Save
              </button>
            </div>
          </form>
        </PopUp>
        <PopUp
          visible={showAddFieldModal}
          setVisible={setShowAddFieldModal}
          width="700px"
          header="Add New Field"
          showCloseButton={true}
          overflowX="visible"
          overflowY="visible"
        >
          <AddFieldForm
            processData={processData}
            setProcessData={setProcessData}
            closeModal={() => setIsFieldModaleOpen(false)}
          />
        </PopUp>
      </div>
    </>
  )
}

export default Reports
