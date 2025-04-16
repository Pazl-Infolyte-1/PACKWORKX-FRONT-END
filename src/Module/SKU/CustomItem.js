import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useRef, useState } from 'react'

function CustomItem({
  editTag,
  dropdownRef,
  addNewSkuData,
  isOpen,
  handleChange,
  clientDiasble,
  client,
  setIsOpen,
  handleSelect,
  skuType,
  setAddNewSkuData,
  updateSkuValues,
}) {
  const [tagInput, setTagInput] = useState('')
  const inputRef = useRef(null)
  
  const handleTagChange = (e) => {
    const input = e.target.value
    setTagInput(input)

    // Optional: only parse when input ends with space or some delimiter
    const tags = input.match(/#\w+/g) || []
    setAddNewSkuData((prev) => ({ ...prev, tags }))
  }

  useEffect(() => {
    const ply = 2
    setAddNewSkuData((prev) => ({ ...prev, ply }))
  }, [])
  
  useEffect(() => {
    if (editTag && Array.isArray(addNewSkuData?.tags)) {
      setTagInput(addNewSkuData.tags.join(''))
    }
  }, [editTag]) // only run when editTag toggles

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = addNewSkuData.tags.filter((tag) => tag !== tagToRemove)
    setAddNewSkuData((prev) => ({ ...prev, tags: updatedTags }))
    setTagInput(updatedTags.join('')) // keep input in sync
  }

  return (
    <div className="rounded-lg">
      {/* Top header fields */}
      <div className="grid grid-cols-3 gap-6 p-6 border border-gray-200 rounded-lg">
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 h-10 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-blue-500 transition-colors"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="text-gray-800">{addNewSkuData?.sku_type || 'Select Type'}</span>
              <BsChevronDown className={`transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <ul
                className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md z-20 shadow-lg"
              >
                {skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-50">
                    <li
                      className={`p-2 cursor-pointer w-full ${editTag ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}`}
                      onClick={!editTag ? () => handleSelect(option) : undefined}
                    >
                      {option.sku_type}
                    </li>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Input
          skuName="SKU Name"
          id="sku_name"
          name="sku_name"
          value={addNewSkuData?.sku_name}
          onChange={handleChange}
          placeholder="SKU Name"
        />

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData?.client || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select Client
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.display_name}>
                {item.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
        <Input
          skuName="Estimate"
          id="estimate_composite_item"
          name="estimate_composite_item"
          value={addNewSkuData?.estimate_composite_item}
          onChange={handleChange}
          placeholder="Estimate"
        />

        <Input
          skuName="Default SKU Details"
          id="default_sku_details"
          name="default_sku_details"
          value={addNewSkuData?.default_sku_details}
          onChange={handleChange}
          placeholder="Default SKU Details"
        />

        <Input
          skuName="Description"
          id="description"
          name="description"
          value={addNewSkuData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Tags</label>
          <div
            className=" border border-gray-300 rounded-md p-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Tags/Chips Row */}
            <div className="flex flex-wrap gap-2 mb-2">
              {addNewSkuData?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-red-500"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Input Row */}
            <input
              ref={inputRef}
              value={tagInput}
              onChange={handleTagChange}
              className="w-full outline-none px-2 py-1 text-sm"
              placeholder="Type tags like #fun#vibe"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomItem