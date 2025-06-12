import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CustomAlert from '../../components/New/CustomAlert'
import { useLocation, useNavigate } from 'react-router-dom'
import { itemApi } from '../../api/item'

const AddItemProcess = ({ isEdit, selectedItemID, setDrawerOpen, fetchData }) => {
  const [alerts, setAlerts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      item_type: 'raw-materials',
    },
  })

  useEffect(() => {
    if (isEdit && selectedItemID) {
      fetchItemData(selectedItemID)
    }
  }, [isEdit, selectedItemID])

  const fetchItemData = async (id) => {
    try {
      const response = await itemApi.getItemData(id)
      if (response?.data?.data) {
        const itemData = response.data.data
        reset(itemData)
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

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      let response

      const formattedData = {
        ...data,
        min_stock_level: parseFloat(data.min_stock_level) || 0,
        reorder_level: parseFloat(data.reorder_level) || 0,
        standard_cost: parseFloat(data.standard_cost) || 0,
        cgst: parseFloat(data.cgst) || 0,
        sgst: parseFloat(data.sgst) || 0,
      }
      console.log('Formatted data:', formattedData)

      if (isEdit) {
        formattedData.id = selectedItemID
        response = await itemApi.updateItem(selectedItemID, formattedData)
        console.log('Update response:', response)
      } else {
        response = await itemApi.addItem(formattedData)
        console.log('Add response:', response)
      }

      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || `Item ${isEdit ? 'updated' : 'added'} successfully`,
        },
      ])

      setTimeout(() => {
        setDrawerOpen(false)
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
  {
    /* <span className="text-red-500 ml-1">*</span> */
  }
  const formFields = [
    { label: 'Product Code (unique)', name: 'item_code', required: true },
    { label: 'Product Name', name: 'item_name', required: true },
    { label: 'HSN Code', name: 'hsn_code' },
    { label: 'UOM', name: 'uom', required: true },
    {
      label: 'CGST %',
      name: 'cgst',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      label: 'SGST %',
      name: 'sgst',
      type: 'number',
      min: 0,
      max: 100,
    },
    { label: 'Category', name: 'category', required: true },
    { label: 'Manufacturer', name: 'manufacturer' },
    {
      label: 'Min Stock Level',
      name: 'min_stock_level',
      type: 'number',
      min: 0,
    },
    {
      label: 'Reorder Level',
      name: 'reorder_level',
      type: 'number',
      min: 0,
    },
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
    reset()
    navigate('/products')
  }

  return (
    <div className="p-6 bg-white rounded">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formFields.map(
          ({
            label,
            name,
            type = 'text',
            required,
            min,
            max,
            step,
            readOnly,
            defaultValue,
            excluded,
          }) => (
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
                defaultValue={defaultValue}
                className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 
                ${readOnly ? 'bg-gray-50' : ''}`}
                {...(excluded
                  ? {}
                  : register(name, {
                      required: required ? ` required` : false,
                      min:
                        min !== undefined
                          ? { value: min, message: `Minimum value is ${min}` }
                          : undefined,
                      max:
                        max !== undefined
                          ? { value: max, message: `Maximum value is ${max}` }
                          : undefined,
                    }))}
              />
              {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>}
            </div>
          ),
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type<span className="text-red-500"> *</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            {...register('item_type', { required: 'required' })}
          >
            <option value="raw-materials">Raw Materials</option>
            <option value="reels">Reels</option>
            <option value="corrugation-glue">Corrugation Glue</option>
            <option value="pasting-glue">Pasting Glue</option>
            <option value="pins">Pins</option>
            <option value="semi-finished-goods">Semi Finished Goods</option>
            <option value="finished-goods">Finished Goods</option>
          </select>
          {errors.item_type && (
            <p className="text-sm text-red-600 mt-1">{errors.item_type.message}</p>
          )}
        </div>

        <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring focus:border-blue-500"
              {...register('specifications')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description<span className="text-red-500"> *</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring focus:border-blue-500"
              {...register('description', { required: 'required' })}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            onClick={handleCancel}
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
