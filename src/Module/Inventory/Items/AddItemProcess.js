import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import apiMethods from '../../../api/config'
import CustomAlert from '../../../components/New/CustomAlert'
import { useLocation, useNavigate } from 'react-router-dom'

const AddItemProcess = ({ isEdit, selectedItemID, setDrawer, fetchData }) => {
  const [alerts, setAlerts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedItemType, setSelectedItemType] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [tagFields, setTagFields] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
    const [categoryId, setCategoryId] = useState(null)


const location = useLocation()
const navigate=useNavigate()
const fromInventory = location.state?.fromInventory
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      item_type: 'raw-materials',
      tags: {},
    },
  })

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

  useEffect(() => {
    if (isEdit && selectedItemID) {
      fetchItemData(selectedItemID)
    } else {
      setSelectedItemType('raw-materials')
    }
  }, [isEdit, selectedItemID])
  
  const fetchItemData = async (id) => {
    try {
      const response = await apiMethods.getItemData(id)
      if (response?.data?.data) {
        const itemData = response.data.data
        reset(itemData)

        // Set the category (item_type) from the fetched data
        setSelectedItemType(itemData.category || 'raw-materials')

        // Find and set the sub-category name from the ID
        if (itemData.sub_category) {
          const subCat = subCategory.find((sc) => sc.id === itemData.sub_category)
          if (subCat) {
            setSelectedSubCategory(subCat.sub_category_name)
          }
        }

        // If tags exist, convert them to tagFields
        const tags =
          itemData.tags || itemData?.custom_fields ? JSON.parse(itemData.custom_fields) : {} || {}
        const tagsArray = Object.entries(tags).map(([label, value]) => ({ label, value }))
        setTagFields(tagsArray)
      }
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Error fetching item data.',
        },
      ])
    }
  }

useEffect(() => {
  const fetchCategoryAndSubCategory = async () => {
    try {
      const category = await apiMethods.getCategoryList();
      setCategory(category.data.data);

      try {
        const subCategoryResponse = await apiMethods.subCategoryDropdown(categoryId);
        setSubCategory(subCategoryResponse?.data?.data);
      } catch (subCatErr) {
        console.log("SubCategory API error:", subCatErr?.response?.data?.message); // 👈 only log this call’s error
              setAlerts([
        {
          severity: 'error',
          message: subCatErr?.response?.data?.message || 'Error fetching category data.',
        },
      ]);
      }

    } catch (error) {
      console.error("General category fetch error:", error);
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Error fetching category data.',
        },
      ]);
    }
  };

  fetchCategoryAndSubCategory();
}, [isEdit, selectedItemID, categoryId]);

useEffect(() => {
  if (subCategory.length === 0) {
    setSelectedSubCategory("");
    setTagFields([])
  }
}, [subCategory]);



  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
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
        custom_fields: tagsObj,
        min_stock_level: parseFloat(data.min_stock_level) || 0,
        reorder_level: parseFloat(data.reorder_level) || 0,
        standard_cost: parseFloat(data.standard_cost) || 0,
        cgst: parseFloat(data.cgst) || 0,
        sgst: parseFloat(data.sgst) || 0,
      }

      if (isEdit) {
        formattedData.id = selectedItemID
        response = await apiMethods.updateItem(selectedItemID, formattedData)
      } else {
        response = await apiMethods.addItem(formattedData)
      }

      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || `Item ${isEdit ? 'updated' : 'added'} successfully`,
        },
      ])

      setTimeout(() => {
          if (fromInventory) {
    navigate('/inventoryhandling');
  }else{
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
        .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special chars with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim() // Remove leading/trailing spaces
        // .toUpperCase();
        .replace(/\b\w/g, (char) => char.toUpperCase())
    ) // Convert to uppercase
  }

  const formFields = [
    { label: 'Reference Number', name: 'item_code', required: true },
    { label: 'Product Name', name: 'item_name', required: true },
    { label: 'HSN Code', name: 'hsn_code' },
    { label: 'UOM', name: 'uom', required: true },
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
  console.log("from inventy",fromInventory)
  if (fromInventory) {
    navigate('/inventoryhandling');
  } else {
    setDrawer(false);
  }
};

console.log("cateee",categoryId)
const packingReelsTags = [
  { label: "Core Type: 3-inch", value: "core_3_inch" },
  { label: "Core Type: 6-inch", value: "core_6_inch" },
  { label: "Material: Kraft Paper", value: "kraft_paper" },
  { label: "Material: Duplex Board", value: "duplex_board" },
  { label: "GSM: 120", value: "gsm_120" },
  { label: "GSM: 140", value: "gsm_140" },
  { label: "Deckle Size: 24 inches", value: "deckle_24" },
  { label: "Deckle Size: 36 inches", value: "deckle_36" },
  { label: "Color: White", value: "color_white" },
  { label: "Color: Brown", value: "color_brown" },
];
const corrugationGlueTags = [
  { label: "Viscosity: High", value: "viscosity_high" },
  { label: "Viscosity: Medium", value: "viscosity_medium" },
  { label: "Viscosity: Low", value: "viscosity_low" },
  { label: "Type: Starch-Based", value: "type_starch" },
  { label: "Type: Synthetic", value: "type_synthetic" },
  { label: "pH Level: 7", value: "ph_7" },
  { label: "pH Level: 8", value: "ph_8" },
  { label: "Bond Strength: Strong", value: "bond_strong" },
  { label: "Bond Strength: Medium", value: "bond_medium" },
  { label: "Dry Time: Fast", value: "dry_fast" },
];
const pastingGlueTags = [
  { label: "Adhesion: Strong", value: "adhesion_strong" },
  { label: "Adhesion: Medium", value: "adhesion_medium" },
  { label: "Viscosity: 2000 cps", value: "viscosity_2000" },
  { label: "Viscosity: 3000 cps", value: "viscosity_3000" },
  { label: "Drying Time: Quick", value: "dry_quick" },
  { label: "Drying Time: Normal", value: "dry_normal" },
  { label: "Color: White", value: "color_white" },
  { label: "Color: Transparent", value: "color_transparent" },
  { label: "PH Level: 6.5", value: "ph_6_5" },
  { label: "PH Level: 7.5", value: "ph_7_5" },
];

const pinsTags = [
  { label: "Material: Steel", value: "material_steel" },
  { label: "Material: Copper", value: "material_copper" },
  { label: "Size: 1 inch", value: "size_1_inch" },
  { label: "Size: 2 inch", value: "size_2_inch" },
  { label: "Finish: Polished", value: "finish_polished" },
  { label: "Finish: Matte", value: "finish_matte" },
  { label: "Usage: Manual", value: "usage_manual" },
  { label: "Usage: Machine", value: "usage_machine" },
  { label: "Coating: Zinc", value: "coating_zinc" },
  { label: "Coating: Nickel", value: "coating_nickel" },
];
useEffect(() => {
  if (selectedSubCategory === 'reels') {
    setTagFields(packingReelsTags);
  } else if (selectedSubCategory === 'corrugation-glue') {
    setTagFields(corrugationGlueTags);
  } else if (selectedSubCategory === 'pasting-glue') {
    setTagFields(pastingGlueTags);
  } else if (selectedSubCategory === 'pins') {
    setTagFields(pinsTags);
  } else {
    setTagFields([]); // Optional: clear for other subcategories
  }
}, [selectedSubCategory]);


  return (
    <div className="p-6 bg-white rounded">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

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
              className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 
                ${readOnly ? 'bg-gray-50' : ''}`}
              {...register(name, {
                required: required ? 'required' : false,
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
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register('specifications')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register('description', { required: 'required' })}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Category and SubCategory in same row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedItemType}
            onChange={(e) => {
              setSelectedItemType(e.target.value)
              setValue('category', e.target.value)
                 const selectedCategoryId = e.target.value;
      console.log('Selected Category ID:', selectedCategoryId);
setCategoryId(selectedCategoryId)
            }}
          >
            {category.map((Category) => (
              <option key={Category.id} value={Category.id}>
                {Category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SubCategory</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedSubCategory}
            onChange={(e) => {
              const selectedName = e.target.value
              const selectedItem = subCategory.find((sc) => sc.sub_category_name === selectedName)
              setSelectedSubCategory(selectedName)
              setValue('sub_category', selectedItem?.id || '')
            }}
          >
            {subCategory?.map((Sc) => (
              <option key={Sc?.id} value={Sc?.sub_category_name}>
                {Sc?.sub_category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Add button for custom tags spanning full width when needed */}
    {['reels', 'corrugation-glue', 'pasting-glue', 'pins'].includes(selectedSubCategory) && subCategory.length > 0 && (
  <div className="md:col-span-3 mt-2 mb-2">
    <button
      type="button"
      onClick={handleAddField}
      className="bg-purple-500 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-purple-400"
    >
      + Add {cleanAndUppercase(selectedSubCategory)} Custom Tags
    </button>
  </div>
)}


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
            {isSubmitting ? 'Processing...' : isEdit ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItemProcess