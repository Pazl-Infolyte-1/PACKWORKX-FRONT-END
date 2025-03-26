import React, { useContext, useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { AuthContext } from '../../Context/AuthContext'
import Input from '../../components/New/Input'
import apiMethods from '../../api/config'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

function SkuAddEdit({
  handleChange,
  strictAdherence,
  handleStrictAdherenceToggle,
  handleAddSkuSubmit,
  editTag,
  addNewSkuData,
  setAddNewSkuData,
}) {
  const [skuType, setSkuType] = useState([])
  const { user } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!editTag) {
      setAddNewSkuData({
        sku_name: '',
        client_id:user.id,
        ply: '',
        length: '',
        width: '',
        height: '',
        joints: '',
        ups: '',
        inner_outer_dimension: '',
        flap_width: '',
        flap_tolerance: '',
        length_trimming_tolerance: '',
        width_trimming_tolerance: '',
        strict_adherence: strictAdherence,
        customer_reference: '',
        reference_number: '',
        internal_id: '',
        board_size_cm2: '',
        deckle_size: '',
        minimum_order_level: '',
        sku_type: '',
        sku_values: [
          {
            layer: '',
            gsm: '',
            bf: '',
            material: '',
            color: '',
            flute_type: '',
            flute_ratio: '',
          },
        ],
      })
    }
  }, [editTag])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getSkuType()
        setSkuType(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleSelect = (option) => {
    if (option.value === 'addMore') {
      // Handle add more procedure logic if needed
      setIsOpen(false)
      return
    }
    setIsOpen(false)
    // Update the sku_type in addNewSkuData
    setAddNewSkuData((prevData) => ({
      ...prevData,
      sku_type: option.sku_type || option.value,
    }))
  }

  const handleDeleteSkuType = async (id) => {
    try {
      await apiMethods.deleteSkuType(id)
      setSkuType((prevTypes) => prevTypes.filter((type) => type.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSkuValuesChange = (index, field, value) => {
    setAddNewSkuData((prevData) => {
      const updatedSkuValues = [...prevData.sku_values] // Copy the array
      updatedSkuValues[index] = { ...updatedSkuValues[index], [field]: value } // Update specific field
      return { ...prevData, sku_values: updatedSkuValues } // Update state
    })
  }
  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {editTag ? 'Update SKU Details' : 'Add SKU Details'}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          skuName="SKU Name"
          id="sku_name"
          name="sku_name"
          value={addNewSkuData.sku_name}
          onChange={handleChange}
          placeholder="SKU Name"
        />

        <div>
          <label className="block text-[16px] font-medium mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData.ply}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option value="" hidden>
              Select Number of Layers
            </option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={9}>9</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Input
            skuName="Length"
            id="length"
            name="length"
            value={addNewSkuData.length}
            onChange={handleChange}
            placeholder="length"
          />

          <Input
            skuName="Width"
            id="width"
            name="width"
            value={addNewSkuData.width}
            onChange={handleChange}
            placeholder="width"
          />

          <Input
            skuName="Height"
            id="height"
            name="height"
            value={addNewSkuData.height}
            onChange={handleChange}
            placeholder="height"
          />
        </div>

        <div className="flex gap-3">
          <Input
            skuName="Joints"
            id="joints"
            name="joints"
            value={addNewSkuData.joints}
            onChange={handleChange}
            placeholder="joints"
          />

          <Input
            skuName="UPS"
            id="ups"
            name="ups"
            value={addNewSkuData.ups}
            onChange={handleChange}
            placeholder="ups"
          />
        </div>
        <div>
          <label className="block text-[16px] font-medium mb-2">Inner/Outer Dimension</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Inner"
                checked={addNewSkuData.inner_outer_dimension === 'Inner'}
                onChange={handleChange}
                className="mr-2"
              />
              Inner
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Outer"
                checked={addNewSkuData.inner_outer_dimension === 'Outer'}
                onChange={handleChange}
                className="mr-2"
              />
              Outer
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            skuName="Flap Width"
            id="flap_width"
            name="flap_width"
            value={addNewSkuData.flap_width}
            onChange={handleChange}
            placeholder="flap width"
          />

          <Input
            skuName="Flap Tolerance"
            id="flap_tolerance"
            name="flap_tolerance"
            value={addNewSkuData.flap_tolerance}
            onChange={handleChange}
            placeholder="flap tolerance"
          />
        </div>

        <div>
          <label className="block text-[16px] font-medium mb-2">Length Trimming Tolerance</label>
          <select
            name="length_trimming_tolerance"
            id="length_trimming_tolerance"
            value={addNewSkuData.length_trimming_tolerance}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option>0.2</option>
            <option>0.1</option>
          </select>
        </div>

        <div>
          <label className="block text-[16px] font-medium mb-2">Width Trimming Tolerance</label>
          <select
            name="width_trimming_tolerance"
            id="width_trimming_tolerance"
            value={addNewSkuData.width_trimming_tolerance}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option>0.2</option>
            <option>0.1</option>
          </select>
        </div>
      </div>

      <div className="flex items-center my-3 space-x-2">
        <span className="text-[16px] font-medium">Strict Adherence for All Layers</span>
        <button
          className={`w-11 h-[23px] flex items-center border border-blue-600 rounded-full p-1 cursor-pointer 
              ${strictAdherence ? 'bg-blue-600' : 'bg-gray-300'}`}
          onClick={handleStrictAdherenceToggle}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out 
                ${strictAdherence ? 'translate-x-5' : '-translate-x-[2px]'}`}
          ></div>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          skuName="Customer Reference"
          id="customer_reference"
          name="customer_reference"
          value={addNewSkuData.customer_reference}
          onChange={handleChange}
          placeholder="customer reference"
        />

        <Input
          skuName="Reference #"
          id="reference_number"
          name="reference_number"
          value={addNewSkuData.reference_number}
          onChange={handleChange}
          placeholder="reference number"
        />

        <Input
          skuName="Internal ID"
          id="internal_id"
          name="internal_id"
          value={addNewSkuData.internal_id}
          onChange={handleChange}
          placeholder="internal id"
        />

        <Input
          skuName="Board Size (cm²)"
          id="board_size_cm2"
          name="board_size_cm2"
          value={addNewSkuData.board_size_cm2}
          onChange={handleChange}
          placeholder="board size"
        />

        <Input
          skuName="Deckle Size"
          id="deckle_size"
          name="deckle_size"
          value={addNewSkuData.deckle_size}
          onChange={handleChange}
          placeholder="deckle size"
        />

        <Input
          skuName="Minimum Order Level"
          id="minimum_order_level"
          name="minimum_order_level"
          type="number"
          value={addNewSkuData.minimum_order_level}
          onChange={handleChange}
          placeholder="minimum order level"
        />
      </div>

      <div className="w-[32%]">
        <label className="block text-[16px] font-medium m-2">SKU Type</label>
        <div className="relative w-full" ref={dropdownRef}>
          <div
            className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span>{addNewSkuData.sku_type || 'Select Type'}</span>
            <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <ul
              className={`absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-40`}
            >
              {skuType.map((option) => (
                <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-100">
                  <li className="p-2 cursor-pointer w-full" onClick={() => handleSelect(option)}>
                    {option.sku_type}
                  </li>
                  {editTag && (
                    <div className="flex items-center gap-2">
                      <CIcon icon={cilPencil} className="cursor-pointer" />
                      <CIcon
                        icon={cilTrash}
                        style={{ color: 'red' }}
                        className="cursor-pointer"
                        onClick={() => handleDeleteSkuType(option.id)}
                      />
                    </div>
                  )}
                </div>
              ))}

              <li
                className="p-2 font-semibold text-blue-600 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect({ value: 'addMore', label: 'Add More Procedure' })}
              >
                Add More Procedure
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="border rounded-lg overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-gray-500 text-center">
                <th className="p-2">Layer</th>
                <th className="p-2">GSM</th>
                <th className="p-2">BF</th>
                <th className="p-2">Color</th>
                <th className="p-2">Flute Type</th>
                <th className="p-2">Flute Ratio</th>
                <th className="p-2">material</th>
                <th className="p-2">Weight (Kg)</th>
                <th className="p-2">
                  Bursting Strength <br />{' '}
                  <span className="text-xs">
                    (Kg Per Cm<sup>2</sup>
                  </span>
                  )
                </th>
              </tr>
            </thead>
            <tbody>
              {addNewSkuData?.sku_values?.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 text-center">
                    <select
                      className="p-1 border rounded w-full"
                      value={item.layer || 'Select'}
                      onChange={(e) => handleSkuValuesChange(index, 'layer', e.target.value)}
                    >
                      <option hidden>Select</option>
                      <option value={'Top Layer'}>Top Layer</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      className="w-20 p-1 border rounded text-center"
                      value={item.gsm || ''}
                      placeholder="gsm"
                      onChange={(e) => handleSkuValuesChange(index, 'gsm', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      className="w-20 p-1 border rounded text-center"
                      value={item.bf || ''}
                      placeholder="bf"
                      onChange={(e) => handleSkuValuesChange(index, 'bf', Number(e.target.value))}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <select
                      className="p-1 border rounded w-full"
                      value={item.color || 'Select'}
                      onChange={(e) => handleSkuValuesChange(index, 'color', e.target.value)}
                    >
                      <option hidden>Select</option>
                      <option value={'yellow'}>Yellow</option>
                      <option value={'blue'}>Blue</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <select
                      className="p-1 border rounded w-full"
                      value={item.flute_type || 'Select'}
                      onChange={(e) => handleSkuValuesChange(index, 'flute_type', e.target.value)}
                    >
                      <option hidden>Select</option>
                      <option value={'flex'}>flex</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      className="p-1 border rounded text-center"
                      value={item.flute_ratio || ''}
                      placeholder="flute ratio"
                      onChange={(e) => handleSkuValuesChange(index, 'flute_ratio', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <select
                      className="p-1 border rounded w-full"
                      value={item.material || 'Select'}
                      onChange={(e) => handleSkuValuesChange(index, 'material', e.target.value)}
                    >
                      <option>Select</option>
                      <option>Sheet</option>
                      <option>Box</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      className="p-1 border rounded text-center"
                      // value={item.weight || ''}
                      placeholder="weight"
                      // onChange={(e) => handleSkuValuesChange(index, 'weight', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      className="p-1 border rounded text-center"
                      // value={item.gsm || ''}
                      placeholder="brusting_strength"
                      // onChange={(e) => handleSkuValuesChange(index, 'gsm', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <ActionButton
          label="Add Version"
          variant="add"
          className="bg-[#079b54] text-white px-4 py-2 rounded-md"
        />
        <ActionButton
          label="Save As Draft"
          className="bg-[#079b54] text-white px-4 py-2 rounded-md"
        />
        <ActionButton
          onClick={handleAddSkuSubmit}
          label={editTag ? 'Update' : 'Submit'}
          variant="save"
          className="bg-[#079b54] text-white px-4 py-2 rounded-md"
        />
      </div>
    </div>
  )
}

export default SkuAddEdit
