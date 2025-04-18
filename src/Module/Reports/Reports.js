import { useEffect, useRef, useState } from 'react'
import PopUp from '../../components/New/PopUp'
import ActionButton from '../../components/New/ActionButton'
import ProcessIntegrartionTable from './ProcessIntegrartionTable'
import CommonPagination from '../../components/New/Pagination'
import SearchBar from '../../components/New/SearchBar'
import apiMethods from '../../api/config'
import { useSearch } from '../../components/New/SearchContext'
import CustomAlert from '../../components/New/CustomAlert'
import FiledTable from './FiledTable'
import AddProcessField from './AddProcessField'
import AddFieldForm from '../Machine/AddFieldForm'
import ProcessForm from './AddProcessNameForm'

const Reports = () => {
  const [showAddProcessModal, setShowAddProcessModal] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [showAddFieldModal, setShowAddFieldModal] = useState({ show: false, processId: null })
  const [selectedProcess, setSelectedProcess] = useState(null)
  const [processData, setProcessData] = useState([])
  const [fieldData, setFieldData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [showProcessFields, setShowProcessFields] = useState(false)
  const [showFileds, setShowFileds] = useState(false)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [selectedProcessValue, setSelectedProcessValue] = useState(null)
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
  }, [searchQuery, limit, refresh])

  const [formData, setFormData] = useState({
    process_name: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getAllFileds()
        setFieldData(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [refresh])

  const handleEditProcess = (process) => {
    setFormData({
      id: process.id,
      process_name: process.process_name || process.ProcessName?.process_name,
    })
    setShowAddProcessModal(true)
    setIsEdit(true)

  }

  const handleClose = () => {
    setAlerts([])
  }

  const handleProcessSubmit = async (data) => {
    try {
      if (isEdit) {
        const response = await apiMethods.EditProcess(data)
        setAlerts([
          { severity: 'success', message: response.data.message || 'Process Updated Successfully' },
        ])
      } else {
        const response = await apiMethods.AddProcess(data)
        setAlerts([
          { severity: 'success', message: response.data.message || 'Process Added Successfully' },
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
    setRefresh((prev) => !prev)
  }
  const handleAddField = (id) => {
    // Find the process if ID is provided
    const process = id ? processData.find(p => p.id === id) : null;
    
    if (process) {
      const processValue = {
        value: process.process_name || process.ProcessName?.process_name || '',
        processId: id,
        id: id,
        process_value: process.process_value || {}
      };
      
      setSelectedProcessValue(processValue);
      setIsEdit(false);
      setShowProcessFields(true);
    } else {
      // Handle case when no ID is provided (general "Process Fields" button)
      setSelectedProcessValue(null);
      setIsEdit(false);
      setShowProcessFields(true);
    }
  }

  const handleEditProcessValues = (process) => {
    if (!process) return;
    
    const processFieldValues = process.process_value || {};
    
    const selectedProcess = {
      value: process.process_name || process.ProcessName?.process_name || '',
      processId: process.id,
      id: process.id,
      process_value: processFieldValues
    };
    
    setSelectedProcess(selectedProcess);
    setShowProcessFields(true);
    setIsEdit(true);
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex flex-col lg:flex-row item-center gap-5 relative my-3">
        <h3 className="text-xl font-semibold mb-3">Process Integration</h3>
      </div>

      <div className="bg-white p-3 rounded-lg w-full h-full">
        <div className="flex items-center">
          <SearchBar data={processData} text={'Process Integration'} ref={searchBarRef} />
          <div className="flex-grow flex justify-end gap-3">
            <ActionButton
              variant="add"
              label={'Add Process Name'}
              onClick={() => {
                setIsEdit(false)
                setShowAddProcessModal(true)
              }}
            />
            <ActionButton
              variant="minimal"
              label={showFileds ? 'Show Process' : 'Show Fields'}
              onClick={() => setShowFileds(!showFileds)}
            />
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap my-4">
          {showFileds ? (
            <FiledTable
              processData={processData}
              setRefresh={setRefresh}
            />
          ) : (
            <ProcessIntegrartionTable
              processData={processData}
              setProcessData={setProcessData}
              handleEditProcess={handleEditProcess}
              handleClose={handleClose}
              alerts={alerts}
              setAlerts={setAlerts}
              setShowAddFieldModal={setShowAddFieldModal}
              handleEditProcessValues={handleEditProcessValues}
              handleAddField={handleAddField}
            />
          )}
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
          header={isEdit ? 'Edit Process' : 'Add Process'}
          showCloseButton={true}
        >
          <ProcessForm
            isEdit={isEdit}
            initialData={formData}
            onCancel={() => setShowAddProcessModal(false)}
            onSubmit={handleProcessSubmit}
          />
        </PopUp>

        <PopUp
          visible={showAddFieldModal.show}
          setVisible={(isVisible) => {
            if (!isVisible) {
              setShowAddFieldModal({ show: false, processId: null })
            }
          }}
          width="700px"
          header="Add New Field"
          showCloseButton={true}
          overflowX="visible"
          overflowY="visible"
        >
          <AddFieldForm
            processData={processData}
            setProcessData={setProcessData}
            setIsFieldModaleOpen={() => setShowAddFieldModal({ show: false, processId: null })}
            isEdit={isEdit}
            formData={formData}
            setFormData={setFormData}
            selectedProcess={
              showAddFieldModal.processId
                ? {
                    value: processData.find((p) => p.id === showAddFieldModal.processId)
                      ?.process_name,
                    processId: showAddFieldModal.processId,
                  }
                : selectedProcess
            }
            setSelectedProcess={setSelectedProcess}
            setRefresh={setRefresh}
            setShowProcessFields={setShowProcessFields}
          />
        </PopUp>

        <PopUp
          visible={showProcessFields}
          setVisible={setShowProcessFields}
          width="40%"
          header={isEdit ? 'Edit Machine Process Integration' : 'Machine Process Integration'}
          showCloseButton={true}
          overflowX="visible"
          overflowY="visible"
        >
          <AddProcessField
            fieldData={fieldData}
            setShowProcessFields={setShowProcessFields}
            setShowAddFieldModal={setShowAddFieldModal}
            isEditing={isEdit}
            editData={selectedProcess}
            selectedProcessValue={selectedProcessValue}
            setSelectedProcessValue={setSelectedProcess}
          />
        </PopUp>
      </div>
    </>
  )
}

export default Reports
