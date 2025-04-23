import { useEffect, useState } from 'react'
import ProcessDropDown from '../Machine/ProcessDropDown'
import ActionButton from '../../components/New/ActionButton'
import apiMethods from '../../api/config'
import CustomAlert from '../../components/New/CustomAlert'

const AddFieldForm = ({
  processData,
  setRefresh,
  setIsFieldModaleOpen,
  isEdit,
  formData,
  selectedProcess,
  setSelectedProcess,
  setShowProcessFields,
  showAddFieldModal,
  setShowAddFieldModal,
}) => {
  const [fieldLabel, setFieldLabel] = useState('')
  const [isRequired, setIsRequired] = useState(true)
  const [fieldType, setFieldType] = useState('text')
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (isEdit && formData) {
      setFieldLabel(formData.label || '')
      setIsRequired(formData.required !== undefined ? formData.required : true)
      setFieldType((formData.field_type || 'Text').toLowerCase())
    } else {
      setFieldLabel('')
      setIsRequired(true)
      setFieldType('text')

      if (showAddFieldModal && showAddFieldModal.processId) {
        const process = processData.find((p) => p.id === showAddFieldModal.processId)
        if (process) {
          setSelectedProcess({
            value: process.process_name || process.ProcessName?.process_name,
            processId: showAddFieldModal.processId,
          })
        }
      }
    }
  }, [isEdit, formData, showAddFieldModal, processData])

  const handleAddField = async () => {
    if (!fieldLabel.trim()) {
      setAlerts([{ severity: 'error', message: 'Field Label is required' }])
      return
    }

    if (!selectedProcess || !selectedProcess.processId) {
      setAlerts([{ severity: 'error', message: 'Please select a process' }])
      return
    }

    const payload = {
      process_name_id: selectedProcess.processId,
      label: fieldLabel,
      field_type: fieldType.charAt(0).toUpperCase() + fieldType.slice(1),
      required: isRequired,
    }

    if (isEdit && formData && formData.id) {
      payload.id = formData.id
    }

    try {
      const res = isEdit
        ? await apiMethods.updateField(payload)
        : await apiMethods.addFields(payload)

      // Show success message
      if (res.status === 201 || res.status === 200) {
        setAlerts([
          {
            severity: 'success',
            message: isEdit ? 'Field updated successfully!' : 'Field added successfully!',
          },
        ])
      }

      // Reset form and trigger refresh BEFORE closing modals
      setFieldLabel('')
      setIsRequired(true)
      setFieldType('text')

      setRefresh((prev) => !prev)

      // Now close modals
      setShowAddFieldModal({ show: false })
      setIsFieldModaleOpen(false)
      if (setShowProcessFields) {
        setShowProcessFields(false)
      }
    } catch (error) {
      console.error('Error saving field:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Error saving field',
        },
      ])
    }
  }

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <div className="my-2 w-full rounded-lg border border-gray-50 p-3">
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className="grid grid-cols-2 gap-4 md:gap-10 lg:gap-40">
        {/* Left Column */}
        <div>
          <div className="relative z-10">
            <ProcessDropDown
              options={processData}
              onChange={(option) =>
                setSelectedProcess({
                  value: option.value,
                  processId: option.processId,
                })
              }
              value={selectedProcess}
              showAddProcedure={false}
              disabled={isEdit}
              readOnly={true}
            />
          </div>

          {/* Is Required */}
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">Is Required</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isRequired}
                  onChange={() => setIsRequired(true)}
                  className="mr-2 w-5 h-5 accent-red-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isRequired}
                  onChange={() => setIsRequired(false)}
                  className="mr-2 w-5 h-5"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Field Label */}
          <label className="block mb-2 text-gray-600">
            Field Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter field label"
          />

          {/* Field Type */}
          <div className="mt-6">
            <label className="block mb-2 text-gray-600">Field Type <span className="text-red-500 text-xs">{isEdit && '(Not Editable)'}</span></label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full p-2 border rounded bg-white"
              disabled={isEdit}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <ActionButton
          variant="cancel"
          label="Cancel"
          onClick={() => {
            setIsFieldModaleOpen(false)
            if (setShowProcessFields) {
              setShowProcessFields(false)
            }
          }}
        />
        <ActionButton variant="save" label={isEdit ? 'Update' : 'Save'} onClick={handleAddField} />
      </div>
    </div>
  )
}

export default AddFieldForm
