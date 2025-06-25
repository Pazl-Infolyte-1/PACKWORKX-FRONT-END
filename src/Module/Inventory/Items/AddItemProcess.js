import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CustomAlert from '../../../components/New/CustomAlert'
import { useLocation, useNavigate } from 'react-router-dom'
import { commonApi } from '../../../api/common'
import { itemApi } from '../../../api/item'

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
      net_weight: 'kg',
    },
  })

  // Define default custom fields for each subcategory
  const defaultCustomFields = {
    reels: {
      BF: '',
      GSM: '',
      Color: '',
      Size: '',
      'Net WT (Kgs)': '',
      Mill: '',
      UOM: '',
    },
    'corrugation-glue': {
      'Glue Type': '',
      Viscosity: '',
      'Expiry Date': '',
    },
    'pasting-glue': {
      'Glue Type': '',
      Viscosity: '',
      'Expiry Date': '',
    },
    'stitching-wires': {
      'Wire Type': '',
    },
  }
  // Define options for select fields
  const fieldOptions = {
    'Glue Type': {
      'corrugation-glue': ['Starch-based', 'Casein', 'Synthetic'],
      'pasting-glue': ['Animal', 'Synthetic', 'Starch-based', 'Dextrin'],
    },
    'Wire Type': { 'stitching-wires': ['Galvanized', 'Stainless Steel', 'Copper-coated'] },
    UOM: ['Inch', 'CM', 'MM'],
  }

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
        const categoryResponse = await itemApi.getCategoryList()
        setCategory(categoryResponse.data.data)
        try {
          const allSubCategoriesResponse = await commonApi.subCategoryDropdown()
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

  // Handle predefined tags when subcategory changes
  useEffect(() => {
    if (!selectedSubCategory) return

    const selectedSubCat =
      subCategory.find((sc) => sc.id == selectedSubCategory) ||
      allSubCategories.find((sc) => sc.id == selectedSubCategory)
    const subCatName = selectedSubCat?.sub_category_name

    if (['2', '5', '6', '7', '8', '3', '4'].includes(selectedSubCategory)) {
      setValue('net_weight', 'litre')
    } else if (['1', '5', '6', '7', '8', '9', '4'].includes(selectedSubCategory)) {
      setValue('net_weight', 'kg')
    }

    // If this subcategory has predefined tags, set them
    if (subCatName && subcategoryTagsMap[subCatName] && !isEditing) {
      setTagFields(subcategoryTagsMap[subCatName])
    }
  }, [selectedSubCategory, subCategory, allSubCategories, isEditing])

  const fetchItemData = async (id) => {
    try {
      const response = await commonApi.singleItem(id)
      const itemData = response?.data

      if (itemData) {
        reset({
          item_code: itemData.item_code,
          item_name: itemData.item_name,
          hsn_code: itemData.hsn_code,
          uom: itemData.uom,
          cgst: parseFloat(itemData.cgst) || 0,
          sgst: parseFloat(itemData.sgst) || 0,
          manufacturer: itemData.manufacturer,
          min_stock_level: parseFloat(itemData.min_stock_level) || 0,
          standard_cost: parseFloat(itemData.standard_cost) || 0,
          specifications: itemData.specifications,
          description: itemData.description,
          category: itemData.category,
          sub_category: itemData.sub_category,
          net_weight: itemData.net_weight || 'kg',
        })

        const categoryValue = String(itemData.category || '')
        setSelectedItemType(categoryValue)
        setCategoryId(categoryValue)

        if (itemData.category) {
          const filteredSubCategories = allSubCategories.filter(
            (sc) => sc.category_id === Number(itemData.category),
          )
          setSubCategory(filteredSubCategories)

          const subCategoryValue = String(itemData.sub_category || '')
          setSelectedSubCategory(subCategoryValue)
        }

        // Handle custom fields
        if (itemData.custom_fields || itemData.default_custom_fields) {
          try {
            // Parse custom_fields
            const customFields = itemData.custom_fields
              ? typeof itemData.custom_fields === 'string'
                ? JSON.parse(itemData.custom_fields)
                : itemData.custom_fields
              : {}

            // Parse default_custom_fields
            const defaultFields = itemData.default_custom_fields
              ? typeof itemData.default_custom_fields === 'string'
                ? JSON.parse(itemData.default_custom_fields)
                : itemData.default_custom_fields
              : {}

            // Check if this is a subcategory with default fields
            const selectedSubCat = allSubCategories.find((sc) => sc.id == itemData.sub_category)
            const subCatName = selectedSubCat?.sub_category_name

            if (subCatName && defaultCustomFields[subCatName]) {
              // Set values for default custom fields from API response
              Object.keys(defaultCustomFields[subCatName]).forEach((key) => {
                // Find the corresponding key in the defaultFields (might have different case/format)
                const apiKey = Object.keys(defaultFields).find(
                  (k) => k.toLowerCase() === key.toLowerCase().replace(/\s+/g, '_'),
                )

                // Set the value if found in the API response
                if (apiKey && defaultFields[apiKey]) {
                  setValue(key, defaultFields[apiKey])
                }
              })

              // Handle any additional custom tags (fields not in default schema)
              const additionalTags = Object.entries(customFields)
                .filter(([key]) => {
                  // Check if key is not in default fields (case insensitive)
                  const defaultKey = Object.keys(defaultCustomFields[subCatName]).find(
                    (k) => k.toLowerCase().replace(/\s+/g, '_') === key.toLowerCase(),
                  )
                  return !defaultKey
                })
                .map(([label, value]) => ({ label, value: String(value) }))

              setTagFields(additionalTags)
            } else {
              // For subcategories without default fields, use the tag system
              const tagsArray = Object.entries(customFields).map(([label, value]) => ({
                label,
                value: String(value),
              }))
              setTagFields(tagsArray)
            }
          } catch (parseError) {
            console.error('Error parsing custom fields:', parseError)
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
        (sc) => sc.category_id === Number(categoryId),
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

      const formErrors = Object.keys(errors)
      if (formErrors.length > 0) {
        setAlerts([
          { severity: 'error', message: 'Please fix all validation errors before submitting' },
        ])
        setIsSubmitting(false)
        return
      }

      const selectedSubCat =
        subCategory.find((sc) => sc.id == selectedSubCategory) ||
        allSubCategories.find((sc) => sc.id == selectedSubCategory)
      const subCatName = selectedSubCat?.sub_category_name

      // Prepare custom_fields and default_custom_fields
      let customFields = {}
      let defaultFields = {}

      // First add default custom fields if they exist for this subcategory
      if (subCatName && defaultCustomFields[subCatName]) {
        Object.keys(defaultCustomFields[subCatName]).forEach((key) => {
          // Format the key to match the desired format (lowercase with underscores)
          const formattedKey = key.toLowerCase().replace(/\s+/g, '_')
          // Special case for "net_wt(Kgs)"
          const finalKey = formattedKey === 'net_wt(kgs)' ? 'net_wt(Kgs)' : formattedKey

          if (data[key] !== undefined) {
            defaultFields[finalKey] = String(data[key])
            customFields[finalKey] = String(data[key])
          }
        })
      }

      // Then add any additional tag fields to custom_fields
      tagFields.forEach((field) => {
        if (field.label && field.value) {
          // Format the label to match the desired format (lowercase with underscores)
          const formattedLabel = field.label.toLowerCase().replace(/\s+/g, '_')
          // Special case for "net_wt(Kgs)"
          const finalLabel = formattedLabel === 'net_wt(kgs)' ? 'net_wt(Kgs)' : formattedLabel

          customFields[finalLabel] = String(field.value)
        }
      })
      console.log(data, 'data')

      const formattedData = {
        ...data,
        custom_fields: customFields, // Directly use the object
        default_custom_fields: defaultFields, // Directly use the object
        min_stock_level: parseFloat(data.min_stock_level) || 0,
        standard_cost: parseFloat(data.standard_cost) || 0,
        cgst: parseFloat(data.cgst) || 0,
        sgst: parseFloat(data.sgst) || 0,
        category: Number(data.category),
        sub_category: data.sub_category ? Number(data.sub_category) : null,
      }

      let response

      if (isEditing) {
        formattedData.id = currentItemId
        response = await itemApi.updateItem(currentItemId, formattedData)
      } else {
        response = await itemApi.addItem(formattedData)
      }

      setAlerts([
        {
          severity: 'success',
          message:
            response?.data?.message || `Item ${isEditing ? 'updated' : 'added'} successfully`,
        },
      ])

      setTimeout(() => {
        if (fromInventory) {
          navigate('/inventoryhandling')
        } else {
          setDrawer(false)
        }
        // fetchData()
      }, 1500)
    } catch (error) {
      console.error(error)

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
    return text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const formFields = [
    { label: 'Reference Number', name: 'item_code', required: true },
    { label: 'Product Name', name: 'item_name', required: true },
    { label: 'Description', name: 'description', required: true },
    { label: 'HSN Code', name: 'hsn_code' },
    { label: 'CGST %', name: 'cgst', type: 'number', min: 0, max: 100 },
    { label: 'SGST %', name: 'sgst', type: 'number', min: 0, max: 100 },
    { label: 'Manufacturer', name: 'manufacturer' },
    { label: 'Min Stock Level', name: 'min_stock_level', type: 'number', min: 0 },
  ]

  const handleCancel = () => {
    navigate('/inventoryhandling')
  }

  // Predefined tags for different subcategories
  const packingReelsTags = [
    { label: 'Core Type', value: 'core_3_inch' },
    { label: 'Core Type', value: 'core_6_inch' },
    { label: 'Material', value: 'kraft_paper' },
    { label: 'Material', value: 'duplex_board' },
    { label: 'GSM', value: 'gsm_120' },
    { label: 'GSM', value: 'gsm_140' },
    { label: 'Deckle Size', value: 'deckle_24' },
    { label: 'Deckle Size', value: 'deckle_36' },
    { label: 'Colors', value: 'color_white' },
    { label: 'Colors', value: 'color_brown' },
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
    { label: 'Colors', value: 'color_white' },
    { label: 'Colors', value: 'color_transparent' },
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

  const dyeTags = [
    { label: 'Colors', value: 'color_red' },
    { label: 'Colors', value: 'color_green' },
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

  // Map subcategory names to their predefined tags
  const subcategoryTagsMap = {
    reels: packingReelsTags,
    'corrugation-glue': corrugationGlueTags,
    'pasting-glue': pastingGlueTags,
    pins: pinsTags,
    dye: dyeTags,
    stereo: steroTags,
  }
  const getCurrentSubcategoryName = () => {
    const selectedSubCat =
      subCategory.find((sc) => sc.id == selectedSubCategory) ||
      allSubCategories.find((sc) => sc.id == selectedSubCategory)
    return selectedSubCat?.sub_category_name
  }

  // Render default custom fields for the current subcategory
  const renderDefaultCustomFields = () => {
    const subCatName = getCurrentSubcategoryName()
    if (!subCatName || !defaultCustomFields[subCatName]) return null

    const defaultFieldsKeys = Object.keys(defaultCustomFields[subCatName])
    const fieldsPerRow = 3
    const remainingSlots = fieldsPerRow - (defaultFieldsKeys.length % fieldsPerRow)

    return (
      <>
        {defaultFieldsKeys.map((fieldName) => (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldName}
              <span className="text-red-500"> *</span>
            </label>

            {fieldName === 'UOM' ? (
              <select
                style={getInputStyle(errors[fieldName])}
                className="w-full rounded px-3 py-1"
                {...register(fieldName, { required: true })}
              >
                <option value="">Select UOM</option>
                {fieldOptions['UOM'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : fieldOptions[fieldName]?.[subCatName] ? (
              <select
                style={getInputStyle(errors[fieldName])}
                className="w-full rounded px-3 py-1"
                {...register(fieldName, { required: true })}
              >
                <option value="">Select {fieldName}</option>
                {fieldOptions[fieldName][subCatName].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={fieldName.includes('Date') ? 'date' : 'text'}
                style={getInputStyle(errors[fieldName])}
                className="w-full rounded px-3 py-1"
                {...register(fieldName, { required: true })}
              />
            )}
          </div>
        ))}

        {/* Add empty divs to balance the grid if needed */}
        {remainingSlots !== fieldsPerRow &&
          Array.from({ length: remainingSlots }, (_, index) => <div key={`empty-${index}`}></div>)}
      </>
    )
  }
  const getInputStyle = (hasError) => ({
    border: hasError && isSubmitted ? '1px solid #EF4444' : '1px solid #D1D5DB',
  })

  const showCustomTagsSection = () => {
    return true
  }

  return (
    <div className="p-6 bg-white rounded">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[74vh] mb-24 overflow-y-scroll ">
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
              className={`w-full rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-500 
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Standard Cost</label>
          <div className="flex">
            <input
              type="number"
              step="0.01"
              style={getInputStyle(errors.standard_cost)}
              className="flex-1 rounded-l px-3 py-1 border-r-0"
              {...register('standard_cost')}
            />
            <select
              className="rounded-r px-3 py-1 border border-l-0 bg-gray-700 text-white text-sm min-w-[80px]"
              style={{
                borderColor: getInputStyle(errors.standard_cost)?.borderColor || '#d1d5db',
                borderLeftWidth: '0',
              }}
              {...register('net_weight')}
            >
              {(!selectedSubCategory ||
                ['1', '5', '6', '7', '8', '9', '4'].includes(selectedSubCategory)) && (
                <option value="kg">Kg</option>
              )}
              {(!selectedSubCategory ||
                ['2', '5', '6', '7', '8', '3', '4'].includes(selectedSubCategory)) && (
                <option value="litre">Litre</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
          <input
            type="text"
            style={getInputStyle(errors.specifications)}
            className="w-full rounded px-3 py-1"
            {...register('specifications')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500"> *</span>
          </label>
          <select
            style={getInputStyle(errors.category)}
            className="w-full rounded px-3 py-1"
            value={selectedItemType}
            {...register('category', { required: true })}
            onChange={(e) => {
              const selectedCategoryId = e.target.value
              setSelectedItemType(selectedCategoryId)
              setValue('category', Number(selectedCategoryId))
              setCategoryId(selectedCategoryId)
              setSelectedSubCategory('')
              setValue('sub_category', '')
              setTagFields([])

              const filteredSubCategories = allSubCategories.filter(
                (sc) => sc.category_id === Number(selectedCategoryId),
              )
              setSubCategory(filteredSubCategories)
            }}
          >
            <option value="">Select Category</option>
            {category
              .filter((cat) => cat.is_visible === 1)
              .map((cat) => (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SubCategory <span className="text-red-500"> *</span>
            </label>
            <select
              style={getInputStyle(errors.sub_category)}
              className="w-full rounded px-3 py-1"
              value={selectedSubCategory}
              {...register('sub_category', { required: true })}
              onChange={(e) => {
                const selectedId = e.target.value
                setSelectedSubCategory(selectedId)
                setValue('sub_category', selectedId)
                if (['2', '5', '6', '7', '8', '3', '4'].includes(selectedId)) {
                  setValue('net_weight', 'litre')
                } else if (['1', '5', '6', '7', '8', '9', '4'].includes(selectedId)) {
                  setValue('net_weight', 'kg')
                } else {
                  // Default fallback
                  setValue('net_weight', 'kg')
                }
              }}
            >
              <option value="">Select Subcategory</option>
              {subCategory
                .filter((cat) => cat.is_visible === 1)
                .map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {toTitleCase(sc.sub_category_name)}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Render default custom fields if they exist for this subcategory */}
        {renderDefaultCustomFields()}

        {/* Show custom tags section for all subcategories */}
        {showCustomTagsSection() && (
          <div className="md:col-span-3">
            {selectedSubCategory && (
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold -mb-2">Additional Custom Tags</h3>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="bg-purple-500 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-purple-400"
                >
                  + Add Custom Tag
                </button>
              </div>
            )}

            {tagFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-10 border rounded-md p-3">
                {tagFields.map((field, index) => (
                  <div key={index} className="relative flex flex-col gap-1 min-w-[80px]">
                    <input
                      className=" rounded p-1 text-sm w-1/2 block font-medium text-gray-700"
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) => handleTagChange(index, 'label', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="absolute top-0 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      ✕
                    </button>
                    <input
                      className="w-full p-1 px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                      list={`values-${index}`}
                    />
                    {/* Add datalist for predefined values if available */}
                    {subcategoryTagsMap[getCurrentSubcategoryName()] && (
                      <datalist id={`values-${index}`}>
                        {subcategoryTagsMap[getCurrentSubcategoryName()]
                          .filter((tag) => tag.label === field.label)
                          .map((tag, i) => (
                            <option key={i} value={tag.value} />
                          ))}
                      </datalist>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex fixed bottom-1 bg-white w-full justify-end right-10 ">
          <button
            onClick={handleCancel}
            type="button"
            className="p-1 border border-gray-300 rounded w-24 mr-2 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition duration-200
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
