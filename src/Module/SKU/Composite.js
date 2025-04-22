import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import { IoTrash } from 'react-icons/io5'
import React from 'react'
import ActionButton from '../../components/New/ActionButton'
import PopUp from '../../components/New/PopUp'
import CompositePopupTable from './CompositePopupTable'
import { FaChevronDown } from 'react-icons/fa'
import Tooltip from '@mui/material/Tooltip'
import PlyToggle from '../../components/New/PlyToggle'
import RSCBox from './RSCBox'
import CorrugatedSheet from './CorrugatedSheet'
import DieCutBox from './DieCutBox'
import CustomItem from './CustomItem'
import ModifiedPopup from '../../components/New/ModifiedPopup'

const compositeTypes = [
  { id: '1', name: 'Partition' },
  { id: '2', name: 'Panel' },
]

const skuTypes = [
  { id: 1, name: 'Charger' },
  { id: 2, name: 'Laptop' },
]

function Composite({
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
  editedSkudata,
  updateSkuValues,
  isopenval,
  setCompositeSelect,
  isactivateRender
}) {
  const [skuListTable, setSkuListTable] = useState([])
  const [skuFields, setSkuFields] = useState([])
  const [skuList, setSkuList] = useState([])
  const [skuDropdown, setSkuDropdown] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(false)

  const [checkboxSelectedArray, setCheckboxSelectedArray] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [skuTypes, setSkuTypes] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  })
  const [limit, setLimit] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedSkuType, setSelectedSkuType] = useState('')
  const [selectedSkuTypePopup, setSelectedSkuTypePopup] = useState(null);


  const handleCompositeTypeChange = (e) => {
    const selectedType = e.target.value

    setAddNewSkuData((prev) => ({
      ...prev,
      composite_type: selectedType,
    }))
  }

  //this is for add sku with ratio dropw=down
  const fetchSkuList = async () => {
    try {
      const response = await apiMethods.getSkuListOptions()
      setSkuList(response.data) // Assuming data is inside 'data'
    } catch (error) {
      console.error('Failed to fetch SKU list:', error)
    }
  }

  useEffect(() => {
    fetchSkuList()
  }, [isactivateRender])

  //this is for popup table summary
  const fetchSkuListTablePopup = async () => {
    try {
      const response = await apiMethods.getSkuList({
        page: pagination.currentPage,
        limit: limit,
        search: searchQuery || '',
        client: selectedClient || '',
        sku_type: selectedSkuType || '',
      })
      //setSkuList(response.data); // Assuming data is inside 'data'
      setSkuListTable(response)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Failed to fetch SKU list:', error)
    }
  }

  useEffect(() => {
    fetchSkuListTablePopup()
  }, [pagination.currentPage, limit, refresh, searchQuery, selectedClient, selectedSkuType])

  const handleAddSkuField = () => {
    setSkuFields((prev) => [...prev, { id: '', ratio: '', key: Date.now() }])
  }

  const handleChangeSkuSelect = (index, value) => {
    setSkuFields((prev) => {
      const updatedFields = [...prev]
      const matchedSku = skuList.find((sku) => sku.id === value) // Find the SKU based on the selected value

      // Update the specific field at the given index
      updatedFields[index] = {
        ...updatedFields[index], // Keep the existing properties
        id: value, // Update the id with the selected value
        sku_name: matchedSku ? matchedSku.sku_name : '', // Update sku_name based on selection
        ratio: matchedSku ? matchedSku.ratio : '', // Optionally update ratio if needed
      }

      return updatedFields // Return the updated fields
    })
  }

  const handleChangeRatio = (index, value) => {
    const updated = [...skuFields]
    updated[index].ratio = parseFloat(value) // Ensure it's a number
    setSkuFields(updated)
  }

  const handleRemoveSkuField = (key) => {
    setSkuFields((prev) => prev.filter((field) => field.key !== key))
  }

  useEffect(() => {
    const part_value = skuFields
      .filter((field) => field.id !== '')
      .map((field) => {
        const selectedSku = skuList.find((sku) => sku.id === parseInt(field.id))
        return {
          sku_id: selectedSku?.id,
          sku_name: selectedSku?.sku_name,
          ratio: field.ratio,
        }
      })

    setAddNewSkuData((prev) => ({
      ...prev,
      part_value,
      part_count: part_value.length,
    }))
  }, [skuFields, skuList])

  useEffect(() => {
    if (addNewSkuData?.part_value?.length > 0) {
      const fetchSkuList = async () => {
        try {
          const response = await apiMethods.getSkuListOptions()
          const skuData = response.data
          setSkuDropdown(skuData)

          // Now process after data is fetched
          const newSkuFields = addNewSkuData.part_value.map((part) => {
            const matchedSku = skuData.find((sku) => sku.id === part.sku_id)
            return {
              id: matchedSku ? matchedSku.id : '',
              sku_name: matchedSku ? matchedSku.sku_name : '',
              ratio: part.ratio,
              key: Date.now() + Math.random(),
            }
          })

          setSkuFields((prev) => [...prev, ...newSkuFields])
        } catch (error) {
          console.error('Failed to fetch SKU list:', error)
        }
      }

      fetchSkuList()
    }
  }, [])

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedClientDeleteId(null)
  }

  const tablepopup = () => {
    setisSingleViewPopup(true)
  }

  useEffect(() => {
    if (checkboxSelectedArray.length > 0) {
      const addedFields = checkboxSelectedArray.map((sku) => ({
        id: sku.id,
        sku_name: sku.sku_name,
        ratio: '',
        key: Date.now() + Math.random(),
        readonly: true,
      }))

      setSkuFields((prev) => [...prev, ...addedFields])
      setCheckboxSelectedArray([])
    }
  }, [checkboxSelectedArray])

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



  const handleSelectPopup = (data) => {
    console.log("selected data", data.sku_type);
    setCompositeSelect(data.sku_type)

  };

      //setSelectedSkuTypePopup(data.sku_type);
    //setisSingleViewPopupForType(true);
  
  const skuComponents = {
    'RSC box': <RSCBox />,
    Board: <CorrugatedSheet />,
    'Die Cut box': <DieCutBox />,
    Composite: <Composite />,
    'Custom Item': <CustomItem />
  };

  console.log("popup selectr",isSingleViewPopupForType)
  //const handleClosePopup = () => {
  //  console.log("popup closed")
  //  setisSingleViewPopupForType(false);
  //  setCompositeSelect(null); // reset when popup is closed
  //};
  
  //console.log("pop///",isSingleViewPopupForType)
  console.log("rebder activate",isactivateRender)
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
              <BsChevronDown
                className={`transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {isOpen && (
              <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md z-20 shadow-lg">
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
        {/*<div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData?.ply}
            onChange={(e) => {
              const selectedPly = Number(e.target.value)
              updateSkuValues(selectedPly)
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select Number of Layers
            </option>
            <option value={2}>2 Ply</option>
            <option value={3}>3 Ply</option>
            <option value={5}>5 Ply</option>
            <option value={7}>7 Ply</option>
            <option value={9}>9 Ply</option>
          </select>
        </div>*/}
           <PlyToggle
  value={addNewSkuData.ply}
  onChange={(selectedPly) => updateSkuValues(selectedPly)}
/>


        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
            Partition Panel
          </label>
          <select
            name="composite_type"
            id="composite_type"
            value={addNewSkuData?.composite_type}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            onChange={handleCompositeTypeChange}
          >
            <option value="">Select</option>
            <option value="Partition">Partition</option>
            <option value="Panel">Panel</option>
          </select>
        </div>

        <div>
          <Input
            skuName="Minimum Order Level"
            id="minimum_order_level"
            name="minimum_order_level"
            type="number"
            value={addNewSkuData.minimum_order_level}
            onChange={handleChange}
            //placeholder="Minimum Order Level"
          />
        </div>

        <div className="col-span-3">
          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              className="bg-purple-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-500 transition-colors"
              onClick={handleAddSkuField}
            >
              + Add
            </button>

            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition-colors"
              onClick={tablepopup}
            >
              Browse
            </button>

            <div className="w-[150px]">
  <select
    id="sku_type"
    name="sku_type"
    value={selectedFilter || ''}
    onChange={(e) => {
      const selectedOption = skuType.find(opt => opt.sku_type === e.target.value);
      //handleSelect(selectedOption);
      handleSelectPopup(selectedOption)
    }}
    className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
  >
    <option value="">Create New</option>
    {skuType.map((option) => (
      <option key={option.id} value={option.sku_type}    disabled={option.sku_type === 'Composite'}>
        {option.sku_type}
      </option>
    ))}
  </select>
</div>

          </div>
        </div>
      </div>

      {/* SKU Selection Area */}
      <div className="mt-2 w-full overflow-auto">
        {skuFields.length > 0 && (
          <div className="mt-4 min-w-[900px]">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">SKU No</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Selected SKU</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Ratio</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {skuFields.map((field, index) => (
                  <tr key={field.key} className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">SKU {index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {field.readonly ? (
                        <input
                          type="text"
                          value={field.sku_name}
                          readOnly
                          className="w-full px-1 py-[5px] text-sm bg-gray-100 border border-gray-300 rounded text-black"
                        />
                      ) : (
                        <select
                          className="w-full h-[30px] px-1 border border-gray-300 text-sm rounded-md bg-white text-black outline-none"
                          value={field.id}
                          onChange={(e) => handleChangeSkuSelect(index, e.target.value)}
                        >
                          {addNewSkuData.part_value.length === 0 && (
                            <option value="" disabled>
                              Select SKU
                            </option>
                          )}
                          {skuList.map((sku) => (
                            <option key={sku.id} value={sku.id}>
                              {sku.sku_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        placeholder="Ratio"
                        value={field.ratio ?? ''}
                        onChange={(e) => handleChangeRatio(index, e.target.value)}
                        className="w-[70%] p-1 text-center focus:outline-none border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSkuField(field.key)}
                        className="text-gray-500 hover:text-red-600"
                        title="Remove"
                      >
                        <IoTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PopUp
        header={'Select SKU'}
        visible={isSingleViewPopup}
        setVisible={setisSingleViewPopup}
        showCloseButton={true}
        width={'60vw'}
      >
        <CompositePopupTable
          skuSelected={setSelectedSkuType}
          onClientSelect={setSelectedClient}
          pagination={pagination}
          setSearchQuery={setSearchQuery}
          setPagination={setPagination}
          limit={limit}
          setLimit={setLimit}
          setRefresh={setRefresh}
          setVisible={setisSingleViewPopup}
          checkedValue={setCheckboxSelectedArray}
          skuListTable={skuListTable}
        />
      </PopUp>

     {/*<ModifiedPopup
  header="Selected SKU"
  visible={isSingleViewPopupForType}
  setVisible={handleClosePopup}
  showCloseButton={true}
  width="60vw"
>
  {skuComponents[selectedSkuTypePopup] || (
    <div className="text-gray-500">No view available for this SKU type</div>
  )}
</ModifiedPopup>*/}
    </div>
  )
}

export default Composite
