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

  console.log('sku datas', addNewSkuData)

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

  console.log('edittag', editTag)
  console.log('edit data', addNewSkuData)

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <label className="block text-[16px] font-medium">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span>{addNewSkuData?.sku_type || 'Select Type'}</span>
              <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <ul
                className={`absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-30`}
              >
                {skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-100">
                    <li
                      className={`p-2 cursor-pointer w-full ${editTag ? 'text-gray-400 cursor-not-allowed' : ''}`}
                      onClick={!editTag ? () => handleSelect(option) : undefined}
                    >
                      {option.sku_type}
                    </li>
                    {/* {editTag && (
					  <div className="flex items-center gap-2">
						<CIcon icon={cilPencil} className="cursor-pointer" />
						<CIcon
						  icon={cilTrash}
						  style={{ color: 'red' }}
						  className="cursor-pointer"
						  onClick={() => handleDeleteSkuType(option.id)}
						/>
					  </div>
					)} */}
                  </div>
                ))}

                {/* Add more Procedure */}
                {/* <li
				  className="p-2 font-semibold text-blue-600 hover:bg-gray-100 cursor-pointer"
				  onClick={() => handleSelect({ value: 'addMore', label: 'Add More Procedure' })}
				>
				  Add More Procedure
				</li> */}
              </ul>
            )}
          </div>
        </div>

        <Input
          skuName="SKU Name"
          id="sku_name"
          name="sku_name"
          value={addNewSkuData.sku_name}
          onChange={handleChange}
          placeholder="SKU Name"
        />

        <div>
          <label className="block text-[16px] font-medium mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData?.client || ''}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
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

        {/* <div className="mb-4">
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
		</div> */}

        <Input
          skuName="Description"
          id="description"
          name="description"
          value={addNewSkuData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <div>
          <label className="text-[16px] font-medium">Tags</label>
          <div
            className="min-h-[42px] shadow-md border-l-2 rounded-md p-2 mt-2"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Chips Row */}
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
              className="w-full outline-none px-2 py-1 text-sm rounded"
              placeholder="Type tags like #fun#vibe"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomItem
