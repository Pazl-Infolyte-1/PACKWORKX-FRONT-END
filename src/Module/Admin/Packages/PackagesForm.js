import React, { useEffect, useState } from 'react'
import { CCol, CRow, CFormCheck, CFormInput, CFormSelect } from '@coreui/react'
import Drawer from '../../../components/Drawer/Drawer'
import ActionButton from '../../../components/New/ActionButton'
import apiMethods from '../../../api/config'

function PackagesForm({
  isDrawerOpen,
  setDrawerOpen,
  setFormData,
  formData,
  handleSubmit,
  isEdit,
}) {
  const [currency, setCurrency] = useState([])
  const [modules, setModules] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (name === 'packageType') {
      setFormData((prev) => ({
        ...prev,
        is_free: value === 'Free Plan',
      }))
    }
  }

  const handleModuleChange = (moduleName) => {
    setFormData((prev) => {
      const currentModules = prev.module_in_package || []
      const newModules = currentModules.includes(moduleName)
        ? currentModules.filter((name) => name !== moduleName)
        : [...currentModules, moduleName]

      return {
        ...prev,
        module_in_package: newModules,
      }
    })
  }

  const handleSelectAll = (e) => {
    const { checked } = e.target
    setSelectAll(checked)

    setFormData((prev) => ({
      ...prev,
      module_in_package: checked ? modules.map((module) => module.module_name) : [],
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currency = await apiMethods.getCurrency()
        setCurrency(currency.data.data)

        const module = await apiMethods.getModule()
        setModules(module.data.data)
        if (formData.module_in_package?.length === module.data.length) {
          setSelectAll(true)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} title={isEdit ? 'Edit Package' : 'Add Package'}>
        {/* Form Container */}
          <div className="bg-white m-2 p-4 w-full mx-2 flex flex-col gap-4 border border-gray-100 rounded-md">
            <CRow className="g-3 pt-2">
              {/* Package Type */}
              <CCol>
                <label className="block text-gray-700 font-medium mb-1">Package Type</label>
                <div className="flex gap-4">
                  <CFormCheck
                    type="radio"
                    name="packageType"
                    id="Paidplan"
                    label="Paid Plan"
                    value="Paid plan"
                    checked={formData.packageType === 'Paid plan'}
                    onChange={handleInputChange}
                  />
                  <CFormCheck
                    type="radio"
                    name="packageType"
                    id="FreePlan"
                    label="Free Plan"
                    value="Free Plan"
                    checked={formData.packageType === 'Free Plan'}
                    onChange={handleInputChange}
                  />
                </div>
              </CCol>

              {/* Inputs Section */}

              <div className="grid grid-cols-4 gap-2 w-full">
                {/* Package Name */}
                <CCol className=" h-[80px]">
                  <CFormInput
                    label="Package Name"
                    placeholder="Enter Package Name"
                    className="w-full"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </CCol>

                {/* Max Employee */}
                <CCol className=" h-[80px]">
                  <CFormInput
                    label="Max Employee"
                    placeholder="Enter Max Employee"
                    className="w-full"
                    name="max_employees"
                    value={formData.max_employees}
                    onChange={handleInputChange}
                  />
                </CCol>

                {/* Max Storage Size */}
                <CCol className=" h-[80px]">
                  <CFormInput
                    label="Max Storage Size"
                    placeholder="Enter Max Storage Size"
                    className="w-full"
                    name="max_storage_size"
                    value={formData.max_storage_size}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-gray-600">Set -1 for unlimited storage size</p>
                </CCol>

                {/* Storage Unit */}
                <CCol className=" h-[80px]">
                  <CFormSelect
                    label="Storage Unit"
                    className="w-full"
                    name="storage_unit"
                    value={formData.storage_unit}
                    onChange={handleInputChange}
                  >
                    <option>MB</option>
                    <option>GB</option>
                    <option>TB</option>
                  </CFormSelect>
                </CCol>
              </div>

              {/* Position Number */}
              <CCol md={3}>
                <CFormSelect
                  label="Position No"
                  name="sort"
                  value={formData.sort}
                  onChange={handleInputChange}
                >
                  <option hidden>Select</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </CFormSelect>
              </CCol>

              {/* Checkboxes */}
              <div className="flex gap-4">
                <CFormCheck
                  id="make_private"
                  label="Make Private"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleInputChange}
                />
                <CFormCheck
                  id="mark_recommended"
                  label="Mark as Recommended"
                  name="is_recommended"
                  checked={formData.is_recommended}
                  onChange={handleInputChange}
                />
              </div>

              {/* Payment Gateway Plans */}
              <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
                Payment Gateway Plans
              </h5>

              <div className="grid grid-cols-2 gap-4 w-full items-center">
                {/* Package Currency */}
                <CCol md={6} className="w-[250px]">
                  <CFormSelect
                    label="Package Currency"
                    name="currency_id"
                    value={formData.currency_id}
                    onChange={handleInputChange}
                  >
                    <option hidden>Select Currency</option>
                    {currency.map((items) => (
                      <option key={items.id} value={items.id}>
                        {items.currency_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                {/* Plan Options */}
                <div className="flex gap-4">
                  <CFormCheck
                    id="monthly_Plan"
                    label="Monthly Plan"
                    name="monthly_status"
                    checked={formData.monthly_status}
                    onChange={handleInputChange}
                  />
                  <CFormCheck
                    id="annual_plan"
                    label="Annual Plan"
                    name="annual_status"
                    checked={formData.annual_status}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Payment Gateway Plans */}
              <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
                Select Modules for this Package
              </h5>
              <div className="w-full">
                <div className="flex items-center mb-4">
                  <CFormCheck
                    id="selectAllModules"
                    label={selectAll ? 'Unselect All' : 'Select All'}
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="flex flex-wrap gap-1 justify-strat">
                  <div className="flex flex-wrap gap-1 justify-strat">
                    {modules.map((module) => (
                      <div key={module.id} className="flex items-center w-44">
                        <CFormCheck
                          id={`module-${module.id}`}
                          label={module.module_name}
                          checked={
                            formData.module_in_package?.includes(module.module_name) || false
                          }
                          onChange={() => handleModuleChange(module.module_name)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 resize-y overflow-y-auto whitespace-pre-wrap"
                />
              </div>
            </CRow>
          </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <ActionButton
            label="Cancel"
            onClick={() => setDrawerOpen(false)}
            width="[80px]"
            height="10"
            variant='minimal'
          />

          <ActionButton
            label="Save"
            width="[80px]"
            height="10"
            borderRadius="md"
            onClick={handleSubmit}
            variant='save'
          />
        </div>
      </Drawer>
    </>
  )
}

export default PackagesForm
