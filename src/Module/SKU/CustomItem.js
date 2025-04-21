import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash, cilX } from '@coreui/icons'
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
  isopenval
}) {
  const [tagFields, setTagFields] = useState([]);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);


  useEffect(() => {
    const ply = 2
    setAddNewSkuData((prev) => ({ ...prev, ply }))
  }, [])
  
  useEffect(() => {
    if (editTag && Array.isArray(addNewSkuData?.tags)) {
      setTagInput(addNewSkuData.tags.join(''))
    }
  }, [editTag]) // only run when editTag toggles



  console.log("is open",isopenval)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isopenval) {
        const message = "Don't refresh or else your data will be lost!";
        event.preventDefault(); // For most browsers
        event.returnValue = message; // For Chrome
        return message; // For Firefox
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isopenval]);
  const handleAddField = () => {
    const newIndex = tagFields.length + 1;
    const newLabel = `label${newIndex}`;
    setTagFields((prev) => [...prev, { label: newLabel, value: '' }]);
    updateTags([...tagFields, { label: newLabel, value: '' }]);
  };

  const handleTagChange = (index, key, newValue) => {
    const updatedFields = [...tagFields];
    updatedFields[index][key] = newValue;
    setTagFields(updatedFields);
    updateTags(updatedFields);
  };

  const handleLabelEdit = (index, newLabel) => {
    const updatedFields = [...tagFields];
    updatedFields[index].label = newLabel;
    setTagFields(updatedFields);
    updateTags(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...tagFields];
    updatedFields.splice(index, 1);
    setTagFields(updatedFields);
    updateTags(updatedFields);
  };

  const updateTags = (fields) => {
    const tagsObj = fields.reduce((acc, curr) => {
      if (curr.label) acc[curr.label] = curr.value;
      return acc;
    }, {});
    setAddNewSkuData((prev) => ({ ...prev, tags: tagsObj }));
  };
  useEffect(() => {
    if (editTag && addNewSkuData.tags) {
      const initialFields = Object.entries(addNewSkuData.tags).map(([label, value]) => ({
        label,
        value,
      }));
      setTagFields(initialFields);
    }
  }, [editTag, addNewSkuData.tags]);

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
        <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">SKU Name</label>
            <input
              id="sku_name"
              name="sku_name"
              value={addNewSkuData.sku_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

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
              Select
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.display_name}>
                {item.display_name}
              </option>
            ))}
                                        <option value="add_client">➕ Add Client</option>

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
          //placeholder="Estimate"
        />

        <Input
          skuName="Default SKU Details"
          id="default_sku_details"
          name="default_sku_details"
          value={addNewSkuData?.default_sku_details}
          onChange={handleChange}
          //placeholder="Default SKU Details"
        />

        <Input
          skuName="Description"
          id="description"
          name="description"
          value={addNewSkuData.description}
          onChange={handleChange}
          //placeholder="Description"
        />
 <div className="col-span-3">
    <button
      type="button"
      onClick={handleAddField}
      className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-400 transition-colors"
    >
      + Add Fields
    </button>
  </div>

  {/* Render Dynamic Tag Fields */}
  {tagFields.map((field, index) => (
    <div
      key={index}
      className="relative flex flex-col gap-1"
    >
      {/* Label title */}
      <label className="text-sm font-medium text-gray-700">
        {editingLabelIndex === index ? (
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleLabelEdit(index, e.target.value)}
            onBlur={() => setEditingLabelIndex(null)}
            className="border rounded px-2 py-1 text-sm w-28"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer break-words w-28 inline-block text-[16px] font-medium"
            onClick={() => setEditingLabelIndex(index)}
          >
            {field.label}
          </span>
        )}
      </label>

      {/* Input field */}
      <input
        type="text"
        placeholder="Value"
        value={field.value}
        onChange={(e) => handleTagChange(index, 'value', e.target.value)}
        className="w-full p-2 mt-2 shadow-md border-l-2 rounded-md"
      />

      {/* Remove icon */}
      <CIcon
        onClick={() => handleRemoveField(index)}
        icon={cilX}
        size="sm"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
      />
    </div>
  ))}

      </div>
   
    </div>
  )
}

export default CustomItem