import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import apiMethods from '../../../api/config';
import CustomAlert from '../../../components/New/CustomAlert';

const AddItemProcess = ({ isEdit, selectedItemID, setDrawer, fetchData }) => {
  const [alerts, setAlerts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState('');
  const [tagFields, setTagFields] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      item_type: 'raw-materials',
      tags: {}
    }
  });

  const handleAddField = () => {
    const newIndex = tagFields.length + 1;
    const newLabel = `label${newIndex}`;
    setTagFields((prev) => [...prev, { label: newLabel, value: '' }]);
  };

  const handleTagChange = (index, key, newValue) => {
    const updatedFields = [...tagFields];
    updatedFields[index][key] = newValue;
    setTagFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...tagFields];
    updatedFields.splice(index, 1);
    setTagFields(updatedFields);
  };

  useEffect(() => {
    if (isEdit && selectedItemID) {
      fetchItemData(selectedItemID);
    } else {
      setSelectedItemType('raw-materials');
    }
  }, [isEdit, selectedItemID]);

  const fetchItemData = async (id) => {
    try {
      const response = await apiMethods.getItemData(id);
      if (response?.data?.data) {
        const itemData = response.data.data;
        reset(itemData);
        setSelectedItemType(itemData.item_type);

        // If tags exist, convert them to tagFields
        const tags = itemData.tags || {};
        const tagsArray = Object.entries(tags).map(([label, value]) => ({ label, value }));
        setTagFields(tagsArray);
      }
    } catch (error) {
      setAlerts([{
        severity: 'error',
        message: error?.response?.data?.message || 'Error fetching item data.'
      }]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let response;

      // Convert tagFields to an object
        const tagsObj = Array.isArray(tagFields) ? tagFields.reduce((acc, curr) => {
      if (curr.label) acc[curr.label] = curr.value;
      return acc;
    }, {}) : {};

      const formattedData = {
        ...data,
        custom_fields: tagsObj,
        min_stock_level: parseFloat(data.min_stock_level) || 0,
        reorder_level: parseFloat(data.reorder_level) || 0,
        standard_cost: parseFloat(data.standard_cost) || 0,
        cgst: parseFloat(data.cgst) || 0,
        sgst: parseFloat(data.sgst) || 0
      };

      console.log('Submitting:', formattedData);


      if (isEdit) {
        formattedData.id = selectedItemID;
        response = await apiMethods.updateItem(selectedItemID, formattedData);
      } else {
        response = await apiMethods.addItem(formattedData);
      }

      setAlerts([{
        severity: 'success',
        message: response?.data?.message || `Item ${isEdit ? 'updated' : 'added'} successfully`
      }]);

      setTimeout(() => {
        setDrawer(false);
        fetchData();
      }, 1500);
    } catch (error) {
      setAlerts([{
        severity: 'error',
        message: error?.response?.data?.message || 'Operation failed'
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  function cleanAndUppercase(text) {
    return text
        .replace(/[^a-zA-Z0-9\s]/g, ' ')  // Replace special chars with spaces
        .replace(/\s+/g, ' ')             // Replace multiple spaces with single space
        .trim()                           // Remove leading/trailing spaces
        // .toUpperCase(); 
         .replace(/\b\w/g, char => char.toUpperCase());                  // Convert to uppercase
}

  const formFields = [
    { label: 'Reference Number', name: 'item_code', required: true },
    { label: 'Product Name', name: 'item_name', required: true },
    { label: 'HSN Code', name: 'hsn_code' },
    { label: 'UOM', name: 'uom', required: true },
    { label: 'CGST %', name: 'cgst', type: 'number', min: 0, max: 100 },
    { label: 'SGST %', name: 'sgst', type: 'number', min: 0, max: 100 },
    { label: 'Category', name: 'category', required: true },
    { label: 'Manufacturer', name: 'manufacturer' },
    { label: 'Min Stock Level', name: 'min_stock_level', type: 'number', min: 0 },
    { label: 'Reorder Level', name: 'reorder_level', type: 'number', min: 0 },
    { label: 'Standard Cost', name: 'standard_cost', type: 'number', required: true, min: 0, step: '0.01' }
  ];

  return (
    <div className="p-6 bg-white rounded">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formFields.map(({ label, name, type = 'text', required, min, max, step, readOnly }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}{required && <span className="text-red-500"> *</span>}
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
                min: min !== undefined ? { value: min, message: `Minimum value is ${min}` } : undefined,
                max: max !== undefined ? { value: max, message: `Maximum value is ${max}` } : undefined
              })}
            />
            {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" {...register('specifications')} />
        </div>

        <div className='md:col-span-2 grid md:grid-cols-2 gap-6'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description<span className="text-red-500"> *</span></label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('description', { required: 'required' })} />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Type <span className="text-red-500"> *</span></label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={selectedItemType}
              onChange={(e) => {
                setSelectedItemType(e.target.value);
                setValue('item_type', e.target.value);
              }}
            >
              <option value="raw-materials">Raw Materials</option>
              <option value="reels">Reels</option>
              <option value="corrugation-glue">Corrugation Glue</option>
              <option value="pasting-glue">Pasting Glue</option>
              <option value="pins">Pins</option>
            </select>
          </div>
              {[ 'reels', 'corrugation-glue', 'pasting-glue', 'pins'].includes(selectedItemType) && (
                        <div className="col-span-4 mt-2 mb-2">
                          <button
                            type="button"
                            onClick={handleAddField}
                            className="bg-purple-500 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-purple-400"
                          >
                            + Add {cleanAndUppercase(selectedItemType)} Custom Tags
                          </button>
                        </div>
              )}
      
      


        </div>
        <div className='md:col-span-2'>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tags</label> */}
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
            onClick={() => setDrawer(false)}
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
            {isSubmitting ? 'Processing...' : (isEdit ? 'Update' : 'Submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemProcess;
