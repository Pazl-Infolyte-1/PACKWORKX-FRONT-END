import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import apiMethods from '../../../api/config'
import CustomAlert from '../../../components/New/CustomAlert'
import { useLocation, useNavigate } from 'react-router-dom'

const AddItemProcess = ({ selectedItemID, setDrawer, fetchData }) => {
  const [alerts, setAlerts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedItemType, setSelectedItemType] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [tagFields, setTagFields] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [allSubCategories, setAllSubCategories] = useState([])
  const [categoryId, setCategoryId] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()
  const fromInventory = location.state?.fromInventory
  const isEditing = location.state?.isEdit
  const itemVal = location.state?.item
  
  // Determine the correct item ID based on context
  const currentItemId = selectedItemID || itemVal?.item_id
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
    reset,
  } = useForm({
    defaultValues: {
      item_type: 'raw-materials',
      tags: {},
    },
  })

   const toTitleCase = (str) =>
    str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const handleAddField = () => {
    const newIndex = tagFields.length + 1
    const newLabel = `label${newIndex}`
    setTagFields((prev) => [...prev, { label: newLabel, value: '' }])
  }

  const handleTagChange = (index, key, newValue) => {
    const updatedFields = [...tagFields]
    updatedFields[index][key] = newValue
    setTagFields(updatedFields)
  }

  const handleRemoveField = (index) => {
    const updatedFields = [...tagFields]
    updatedFields.splice(index, 1)
    setTagFields(updatedFields)
  }

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const fetchCategoryAndSubCategory = async () => {
      try {
        const categoryResponse = await apiMethods.getCategoryList()
        setCategory(categoryResponse.data.data)

        // Fetch all subcategories and store them separately
        try {
          const allSubCategoriesResponse = await apiMethods.subCategoryDropdown()
          setAllSubCategories(allSubCategoriesResponse?.data?.data || [])
        } catch (subCatErr) {
          setAlerts([
            {
              severity: 'error',
              message: subCatErr?.response?.data?.message || 'Error fetching subcategory data.',
            },
          ])
        }
      } catch (error) {
        console.error('General category fetch error:', error)
        setAlerts([
          {
            severity: 'error',
            message: error?.response?.data?.message || 'Error fetching category data.',
          },
        ])
      }
    }

    fetchCategoryAndSubCategory()
  }, [])

  // Initialize form based on editing state
  useEffect(() => {
    if (isEditing && currentItemId && category.length > 0 && allSubCategories.length > 0) {
      fetchItemData(currentItemId)
    } else if (!isEditing) {
      setSelectedItemType('')
      setSelectedSubCategory('')
      setTagFields([])
    }
  }, [isEditing, currentItemId, category.length, allSubCategories.length])

  const fetchItemData = async (id) => {
    try {
      const response = await apiMethods.singleItem(id)
      const itemData = response?.data

      if (itemData) {
        // Reset the form with response values
        reset({
          item_code: itemData.item_code,
          item_name: itemData.item_name,
          hsn_code: itemData.hsn_code,
          uom: itemData.uom,
          cgst: parseFloat(itemData.cgst) || 0,
          sgst: parseFloat(itemData.sgst) || 0,
          manufacturer: itemData.manufacturer,
          min_stock_level: parseFloat(itemData.min_stock_level) || 0,
          reorder_level: parseFloat(itemData.reorder_level) || 0,
          standard_cost: parseFloat(itemData.standard_cost) || 0,
          specifications: itemData.specifications,
          description: itemData.description,
          category: itemData.category,
          sub_category: itemData.sub_category,
        })

        // Set category state - ensure it's a string for comparison
        const categoryValue = String(itemData.category || '')
        setSelectedItemType(categoryValue)
        setCategoryId(categoryValue)

        // Filter subcategories for the selected category
        if (itemData.category) {
          const filteredSubCategories = allSubCategories.filter(
            (sc) => sc.category_id === Number(itemData.category)
          )
          setSubCategory(filteredSubCategories)

          // Set subcategory state
          const subCategoryValue = String(itemData.sub_category || '')
          setSelectedSubCategory(subCategoryValue)
        }

        // Handle custom fields/tags
        if (itemData.custom_fields) {
          try {
            const customFields = typeof itemData.custom_fields === 'string' 
              ? JSON.parse(itemData.custom_fields) 
              : itemData.custom_fields
            const tagsArray = Object.entries(customFields).map(([label, value]) => ({ 
              label, 
              value: String(value) 
            }))
            setTagFields(tagsArray)
          } catch (parseError) {
            console.error('Error parsing custom fields:', parseError)
            setTagFields([])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching item data:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Error fetching item data.',
        },
      ])
    }
  }

  // Update subcategories when category changes
  useEffect(() => {
    if (categoryId && allSubCategories.length > 0) {
      const filteredSubCategories = allSubCategories.filter(
        (sc) => sc.category_id === Number(categoryId)
      )
      setSubCategory(filteredSubCategories)
    } else {
      setSubCategory([])
    }
  }, [categoryId, allSubCategories])

  useEffect(() => {
    if (subCategory.length === 0) {
      setSelectedSubCategory('')
      if (!isEditing) {
        setTagFields([])
      }
    }
  }, [subCategory, isEditing])

const onSubmit = async (data) => {
  try {
    setIsSubmitting(true)
    
    // Check for form errors first
    const formErrors = Object.keys(errors)
    if (formErrors.length > 0) {
      setAlerts([
        { severity: 'error', message: 'Please fix all validation errors before submitting' },
      ])
      setIsSubmitting(false)
      return
    }

    let response

    // Convert tagFields to an object
    const tagsObj = Array.isArray(tagFields)
      ? tagFields.reduce((acc, curr) => {
          if (curr.label) acc[curr.label] = curr.value
          return acc
        }, {})
      : {}

    const formattedData = {
      ...data,
      custom_fields: JSON.stringify(tagsObj), // Send as JSON string to ensure complete replacement
      min_stock_level: parseFloat(data.min_stock_level) || 0,
      reorder_level: parseFloat(data.reorder_level) || 0,
      standard_cost: parseFloat(data.standard_cost) || 0,
      cgst: parseFloat(data.cgst) || 0,
      sgst: parseFloat(data.sgst) || 0,
      category: Number(data.category),
      sub_category: data.sub_category ? Number(data.sub_category) : null,
    }

    if (isEditing) {
      formattedData.id = currentItemId
      response = await apiMethods.updateItem(currentItemId, formattedData)
    } else {
      response = await apiMethods.addItem(formattedData)
    }

    setAlerts([
      {
        severity: 'success',
        message: response?.data?.message || `Item ${isEditing ? 'updated' : 'added'} successfully`,
      },
    ])

    setTimeout(() => {
      if (fromInventory) {
        navigate('/inventoryhandling')
      } else {
        setDrawer(false)
      }
      fetchData()
    }, 1500)
  } catch (error) {
    setAlerts([
      {
        severity: 'error',
        message: error?.response?.data?.message || 'Operation failed',
      },
    ])
  } finally {
    setIsSubmitting(false)
  }
}

  function cleanAndUppercase(text) {
    return (
      text
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
  }

  const formFields = [
    { label: 'Reference Number', name: 'item_code', required: true },
    { label: 'Product Name', name: 'item_name', required: true },
    { label: 'HSN Code', name: 'hsn_code' },
    { label: 'UOM (Unit of Measurments)', name: 'uom', required: true },
    { label: 'CGST %', name: 'cgst', type: 'number', min: 0, max: 100 },
    { label: 'SGST %', name: 'sgst', type: 'number', min: 0, max: 100 },
    { label: 'Manufacturer', name: 'manufacturer' },
    { label: 'Min Stock Level', name: 'min_stock_level', type: 'number', min: 0 },
    { label: 'Reorder Level', name: 'reorder_level', type: 'number', min: 0 },
    {
      label: 'Standard Cost',
      name: 'standard_cost',
      type: 'number',
      required: true,
      min: 0,
      step: '0.01',
    },
  ]
  
  const handleCancel = () => {
    if (fromInventory) {
      navigate('/inventoryhandling')
    } else {
      setDrawer(false)
    }
  }

  // Raw Materials subcategory tags
  const packingReelsTags = [
    { label: 'Core Type', value: 'core_3_inch' },
    { label: 'Core Type', value: 'core_6_inch' },
    { label: 'Material', value: 'kraft_paper' },
    { label: 'Material', value: 'duplex_board' },
    { label: 'GSM', value: 'gsm_120' },
    { label: 'GSM', value: 'gsm_140' },
    { label: 'Deckle Size', value: 'deckle_24' },
    { label: 'Deckle Size', value: 'deckle_36' },
    { label: 'Color', value: 'color_white' },
    { label: 'Color', value: 'color_brown' },
  ]
  
  const corrugationGlueTags = [
    { label: 'Viscosity', value: 'viscosity_high' },
    { label: 'Viscosity', value: 'viscosity_medium' },
    { label: 'Viscosity', value: 'viscosity_low' },
    { label: 'Type', value: 'type_starch' },
    { label: 'Type', value: 'type_synthetic' },
    { label: 'pH Level', value: 'ph_7' },
    { label: 'pH Level', value: 'ph_8' },
    { label: 'Bond Strength', value: 'bond_strong' },
    { label: 'Bond Strength', value: 'bond_medium' },
    { label: 'Dry Time', value: 'dry_fast' },
  ]
  
  const pastingGlueTags = [
    { label: 'Adhesion', value: 'adhesion_strong' },
    { label: 'Adhesion', value: 'adhesion_medium' },
    { label: 'Viscosity', value: 'viscosity_2000' },
    { label: 'Viscosity', value: 'viscosity_3000' },
    { label: 'Drying Time', value: 'dry_quick' },
    { label: 'Drying Time', value: 'dry_normal' },
    { label: 'Color', value: 'color_white' },
    { label: 'Color', value: 'color_transparent' },
    { label: 'PH Level', value: 'ph_6_5' },
    { label: 'PH Level', value: 'ph_7_5' },
  ]

  const pinsTags = [
    { label: 'Material', value: 'material_steel' },
    { label: 'Material', value: 'material_copper' },
    { label: 'Size', value: 'size_1_inch' },
    { label: 'Size', value: 'size_2_inch' },
    { label: 'Finish', value: 'finish_polished' },
    { label: 'Finish', value: 'finish_matte' },
    { label: 'Usage', value: 'usage_manual' },
    { label: 'Usage', value: 'usage_machine' },
    { label: 'Coating', value: 'coating_zinc' },
    { label: 'Coating', value: 'coating_nickel' },
  ]

  // Returnable category tags
  const dyeTags = [
    { label: 'Color', value: 'color_red' },
    { label: 'Color', value: 'color_green' },
    { label: 'Type', value: 'type_reactive' },
    { label: 'Type', value: 'type_direct' },
    { label: 'Concentration', value: 'concentration_high' },
    { label: 'Concentration', value: 'concentration_low' },
    { label: 'Fastness', value: 'fastness_excellent' },
    { label: 'Fastness', value: 'fastness_good' },
    { label: 'Solubility', value: 'solubility_water' },
    { label: 'Solubility', value: 'solubility_alcohol' },
  ]

  const steroTags = [
    { label: 'Size', value: 'size_small' },
    { label: 'Size', value: 'size_medium' },
    { label: 'Material', value: 'material_metal' },
    { label: 'Material', value: 'material_rubber' },
    { label: 'Shape', value: 'shape_round' },
    { label: 'Shape', value: 'shape_rectangular' },
    { label: 'Weight', value: 'weight_light' },
    { label: 'Weight', value: 'weight_heavy' },
    { label: 'Usage', value: 'usage_industrial' },
    { label: 'Usage', value: 'usage_commercial' },
  ]
  
  // Handle predefined tags based on subcategory
  useEffect(() => {
    const selectedSubCat = subCategory.find(sc => sc.id == selectedSubCategory) || 
                          allSubCategories.find(sc => sc.id == selectedSubCategory)
    const subCatName = selectedSubCat?.sub_category_name
    console.log(subCatName);
    

    // Raw Materials subcategories
    if (subCatName === 'reels') {
      setTagFields(packingReelsTags)
    } else if (subCatName === 'corrugation-glue') {
      setTagFields(corrugationGlueTags)
    } else if (subCatName === 'pasting-glue') {
      setTagFields(pastingGlueTags)
    } else if (subCatName === 'pins') {
      setTagFields(pinsTags)
    }
    // Returnable subcategories
    else if (subCatName === 'dye') {
      setTagFields(dyeTags)
    } else if (subCatName === 'stereo') {
      setTagFields(steroTags)
    } else {
      if (!isEditing) setTagFields([])
    }
  }, [selectedSubCategory, subCategory, allSubCategories, isEditing])

  // Helper function to apply red border style - same as ClientForm
  const getInputStyle = (hasError) => ({
    border: hasError && isSubmitted ? '1px solid #EF4444' : '1px solid #D1D5DB',
  })

  return (
    <div className="p-6 bg-white rounded">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formFields.map(({ label, name, type = 'text', required, min, max, step, readOnly }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type={type}
              min={min}
              max={max}
              step={step || (type === 'number' ? '0.01' : undefined)}
              readOnly={readOnly}
              style={getInputStyle(errors[name])}
              className={`w-full rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 
                ${readOnly ? 'bg-gray-50' : ''}`}
              {...register(name, {
                required: required ? true : false,
                min:
                  min !== undefined
                    ? { value: min, message: `Minimum value is ${min}` }
                    : undefined,
                max:
                  max !== undefined
                    ? { value: max, message: `Maximum value is ${max}` }
                    : undefined,
              })}
            />
            {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>}
          </div>
        ))}

        {/* Specifications and Description in same row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
          <input
            type="text"
            style={getInputStyle(errors.specifications)}
            className="w-full rounded px-3 py-2"
            {...register('specifications')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            style={getInputStyle(errors.description)}
            className="w-full rounded px-3 py-2"
            {...register('description', { required: true })}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Category and SubCategory in same row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            style={getInputStyle(errors.category)}
            className="w-full rounded px-3 py-2"
            value={selectedItemType}
            {...register('category', { required: true })}
            onChange={(e) => {
              const selectedCategoryId = e.target.value
              setSelectedItemType(selectedCategoryId)
              setValue('category', Number(selectedCategoryId))
              setCategoryId(selectedCategoryId)

              // Reset subcategory when category changes
              setSelectedSubCategory('')
              setValue('sub_category', '')
              setTagFields([])

              // Filter subcategories that belong to selected category
              const filteredSubCategories = allSubCategories.filter(
                (sc) => sc.category_id === Number(selectedCategoryId)
              )
              setSubCategory(filteredSubCategories)
            }}
          >
            <option value="">Select Category</option>
            {category.filter((cat) => cat.is_visible === 1).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {toTitleCase(cat.category_name)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        {selectedItemType && subCategory.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SubCategory</label>
            <select
              style={getInputStyle(errors.sub_category)}
              className="w-full rounded px-3 py-2"
              value={selectedSubCategory}
              {...register('sub_category', { required: true })}
              onChange={(e) => {
                const selectedId = e.target.value
                setSelectedSubCategory(selectedId)
                setValue('sub_category', selectedId)
              }}
            >
              <option value="">Select Subcategory</option>
              {subCategory.filter((cat) => cat.is_visible === 1).map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {toTitleCase(sc.sub_category_name)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add button for custom tags spanning full width when needed */}
        {(() => {
          const selectedSubCat = subCategory.find(sc => sc.id == selectedSubCategory) || 
                                allSubCategories.find(sc => sc.id == selectedSubCategory);
          const subCatName = selectedSubCat?.sub_category_name;
          
          return ['reels', 'corrugation-glue', 'pasting-glue', 'pins', 'dye', 'stereo'].includes(subCatName) && (
            <div className="md:col-span-3 mt-2 mb-2">
              <button
                type="button"
                onClick={handleAddField}
                className="bg-purple-500 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-purple-400"
              >
                + Add {cleanAndUppercase(subCatName)} Custom Tags
              </button>
            </div>
          )
        })()}

        {/* Custom tags section spanning full width */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tagFields.map((field, index) => (
              <div key={index} className="relative flex flex-col gap-1 w-[200px]">
                <input
                  className="border rounded px-2 py-1 text-sm w-28"
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) => handleTagChange(index, 'label', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  ✕
                </button>
                <input
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            onClick={handleCancel}
            type="button"
            className="p-2 border border-gray-300 rounded w-24 mr-2 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition duration-200
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Processing...' : isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItemProcess