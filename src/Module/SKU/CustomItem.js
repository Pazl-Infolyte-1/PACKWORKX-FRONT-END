import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import {
  cilChevronCircleDownAlt,
  cilChevronDoubleDown,
  cilPencil,
  cilPlus,
  cilTrash,
  cilX,
} from '@coreui/icons'
import { useEffect, useRef, useState } from 'react'
import SelectionCards from '../../components/New/SelectionCards'
import ClientForm from '../Client/ClientForm'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import PopUp from '../../components/New/PopUp'
import { useDispatch, useSelector } from 'react-redux'
import RoutePopup from './RoutePopup'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import { useNavigate } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { machineApi } from '../../api/machine'


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
  isopenval,
  compositeSelect,
  setPopupOpen,
  isPopupOpen,
  message,
  setMessage,
  errors,
}) {
  const [tagFields, setTagFields] = useState([])
  const [editingLabelIndex, setEditingLabelIndex] = useState(null)
  const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [entityType, setEntityType] = useState('') // State to hold entity_type
  const [submitFromRsc, setSubmitFromRsc] = useState(true)
  const dispatch = useDispatch()
  const [displayAsChips, setDisplayAsChips] = useState([])
  const [isSingleViewPopupRoute, setisSingleViewPopupRoute] = useState(false)
  const [fullRouteResponse, setFullRouteResponse] = useState(null)
   const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
   style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP, // Show 5 items with scroll
      width: 200,
    },
  },
};
const navigate=useNavigate()
  const selectionFrame = {
    vendor: {
      id: 1,
      name: 'vendor',
      image: vendorImg,
    },
    client: {
      id: 2,
      name: 'client',
      image: clientImg,
    },
  }

  useEffect(() => {
    const ply = 2
    setAddNewSkuData((prev) => ({ ...prev, ply }))
  }, [])

  useEffect(() => {
    if (editTag && Array.isArray(addNewSkuData?.tags)) {
      setTagInput(addNewSkuData.tags.join(''))
    }
  }, [editTag])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isopenval) {
        const message = "Don't refresh or else your data will be lost!"
        event.preventDefault()
        event.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isopenval])
  const handleAddField = () => {
    const newIndex = tagFields.length + 1
    const newLabel = `label${newIndex}`
    setTagFields((prev) => [...prev, { label: newLabel, value: '' }])
    updateTags([...tagFields, { label: newLabel, value: '' }])
  }

  const handleTagChange = (index, key, newValue) => {
    const updatedFields = [...tagFields]
    updatedFields[index][key] = newValue
    setTagFields(updatedFields)
    updateTags(updatedFields)
  }

  const handleLabelEdit = (index, newLabel) => {
    const updatedFields = [...tagFields]
    updatedFields[index].label = newLabel
    setTagFields(updatedFields)
    updateTags(updatedFields)
  }

  const handleRemoveField = (index) => {
    const updatedFields = [...tagFields]
    updatedFields.splice(index, 1)
    setTagFields(updatedFields)
    updateTags(updatedFields)
  }

  const updateTags = (fields) => {
    const tagsObj = fields.reduce((acc, curr) => {
      if (curr.label) acc[curr.label] = curr.value
      return acc
    }, {})
    setAddNewSkuData((prev) => ({ ...prev, tags: tagsObj }))
  }
  useEffect(() => {
    if (editTag && addNewSkuData.tags) {
      const initialFields = Object.entries(addNewSkuData.tags).map(([label, value]) => ({
        label,
        value,
      }))
      setTagFields(initialFields)
    }
  }, [editTag, addNewSkuData.tags])

  useEffect(() => {
    if (compositeSelect) {
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_type: compositeSelect,
      }))
    }
  }, [compositeSelect])

  //these are the fonctionalities for client create dropdown

  const handleSelectAction = (selection) => {
    setSelected(selection)
    setTriggerSelection(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }
  const refreshClients = () => {
    setReloadData((prev) => !prev)
  }

  useEffect(() => {
    if (triggerSelection) {
      handleSelection(selected)
      setTriggerSelection(false)
    }
  }, [selected, triggerSelection])

  const handleSelection = (selection) => {
    const optionValue = selectionFrame[selection].id

    if (optionValue === 2) {
      setEntityType('Client')
      setPopupOpen(false)
      setDrawerOpen(true)
    } else if (optionValue === 1) {
      setEntityType('Vendor')
      setPopupOpen(false)
      setDrawerOpen(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, []) // Runs once on mount

  const handleKeyDown = (event) => {
    if (!isPopupOpen) {
      return
    }
    if (event.key === 'ArrowRight') {
      handleSelectAction('client')
      setEntityType('Client')
    } else if (event.key === 'ArrowLeft') {
      handleSelectAction('vendor')
      setEntityType('Vendor')
    } else if (event.key === 'Enter') {
      setTriggerSelection(true)
    }
  }

  useEffect(() => {
    if (message) {
      setAlerts([{ severity: 'success', message }])

      const timer = setTimeout(() => {
        setAlerts([])
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message])

  //functionality for route chip
  useEffect(() => {
    const fetchRoutes = async () => {
      const params = {
        search: '',
        page: 1,
        limit: 10000,
      }

      try {
        const response = await machineApi.getRouteList(params)
        setFullRouteResponse(response)
        setDisplayAsChips(response.data.routes)
      } catch (err) {
        console.error('Error fetching routes:', err)
      }
    }

    fetchRoutes()
  }, [])

  const selectedRouteIds1 = useSelector((state) => state.routeprocess.selectedRouteIds || [])

  useEffect(() => {
    if (editTag && typeof addNewSkuData?.route === 'string') {
      try {
        const parsedRoutes = JSON.parse(addNewSkuData.route)
        if (Array.isArray(parsedRoutes) && parsedRoutes.length > 0) {
          dispatch({
            type: 'SET_SELECTED_ROUTE_IDS',
            payload: parsedRoutes,
          })

          setAddNewSkuData((prevData) => ({
            ...prevData,
            route: parsedRoutes,
          }))
        }
      } catch (err) {
        console.error('Invalid route format:', addNewSkuData.route)
      }
    }
  }, [editTag, addNewSkuData?.route, dispatch])

  // Optional: track Redux changes
  useEffect(() => {}, [selectedRouteIds1])

  const selectedChips = displayAsChips?.filter((item) => selectedRouteIds1?.includes(item.id))

  const chipNames = selectedChips?.map((chip) => chip?.route_name).join(', ')

  useEffect(() => {
    if (!editTag) {
      setAddNewSkuData((prevData) => ({
        ...prevData,
        route: selectedRouteIds1,
      }))
    }
  }, [selectedRouteIds1, editTag])

  const handleRemoveChip = (idToRemove) => {
    const updated = selectedRouteIds1.filter((id) => id !== idToRemove)

    dispatch({
      type: 'SET_SELECTED_ROUTE_IDS',
      payload: updated,
    })
  }
  useEffect(() => {
    setAddNewSkuData((prevData) => ({
      ...prevData,
      route: selectedRouteIds1,
    }))
  }, [selectedRouteIds1])
  const handleBrowseClickRoute = () => {
    setisSingleViewPopupRoute(true)
  }

  useEffect(() => {
    if (editTag && addNewSkuData?.gst_percentage) {
      setAddNewSkuData((prev) => ({
        ...prev,
        gst_percentage: addNewSkuData.gst_percentage,
      }))
    }
  }, [editTag, addNewSkuData?.gst_percentage])
  return (
    <div className="rounded-lg">
      {/* Top header fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">
            SKU Type
          </label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-1 h-8 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-blue-500 transition-colors"
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
                      className={`p-2 w-full cursor-pointer
        ${compositeSelect || editTag ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}
        ${compositeSelect === option.sku_type ? 'bg-gray-200 font-semibold' : ''}`}
                      onClick={
                        !compositeSelect && !editTag ? () => handleSelect(option) : undefined
                      }
                    >
                      {option.sku_type}
                    </li>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU Name
            <span className="text-red-500 ml-1">*</span>
            {/*{errors.sku_name && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
            )}*/}
          </label>
          <input
            id="sku_name"
            name="sku_name"
            value={addNewSkuData.sku_name}
            onChange={handleChange}
                                                className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.sku_name ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
          />
        </div>
    <div className="flex items-end gap-2 w-full max-w-md">
  {/* Select Input */}
  <div className="flex items-end gap-1 w-fit">
    {/* MUI Select with icon inside same box */}
    <div className="relative w-[200px]">
      {/* Aligned Label */}
      <label
        htmlFor="client"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Client <span className="text-red-500 ml-1">*</span>
      </label>

      <FormControl
        sx={{ width: '100%' }}
        error={errors.client_id ? true : false}
      >
        <Select
          IconComponent={() => null}
          labelId="client-select-label"
          id="client"
          name="client"
          disabled={clientDiasble}
          value={addNewSkuData.client_id}
          onChange={handleChange}
          MenuProps={MenuProps}
          displayEmpty
          sx={{
            height: '35px',
            '& .MuiOutlinedInput-root': {
              height: '50px',
              paddingRight: '40px',
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              height: '35px',
              paddingY: 0,
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Select</em>
          </MenuItem>
          {client?.map((item, index) => (
            <MenuItem key={index} value={item.client_id}>
              {item.display_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Add icon inside the select box */}
     <button
  type="button"
  onClick={() =>
    navigate('/clients/clientForm', {
      state: {
        fromSKU: true,
        sku_type_for_navigate: 'Custom Item',
      },
    })
  }
  className="absolute top-[calc(50%+13px)] right-2 -translate-y-1/2 text-blue-600 hover:text-blue-800 z-10"
  title="Add Client"
>
  <CIcon icon={cilPlus} size="lg" className="w-5 h-5 stroke-[2.5]" />
</button>

    </div>
  </div>
</div>
      </div>

      {/* Main content */}
      <div className="p-3 mt-6 border border-gray-200 rounded-lg">
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
  <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
       Estimate
            <span className="text-red-500 ml-1">*</span>
            {/*{errors.sku_name && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
            )}*/}
          </label>
          <input
            id="estimate_composite_item"
            name="estimate_composite_item"
            value={addNewSkuData.estimate_composite_item}
            readOnly={editTag}
            onChange={handleChange}
                                                className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.estimate_composite_item ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
          />
        </div>


            <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
    Default SKU Details
            <span className="text-red-500 ml-1">*</span>
            {/*{errors.sku_name && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
            )}*/}
          </label>
          <input
            id="default_sku_details"
            name="default_sku_details"
            value={addNewSkuData.default_sku_details}
            readOnly={editTag}
            onChange={handleChange}
                                                className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.default_sku_details ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
          />
        </div>

      <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
    Description
            <span className="text-red-500 ml-1">*</span>
            {/*{errors.sku_name && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
            )}*/}
          </label>
          <input
            id="description"
            name="description"
            value={addNewSkuData.description}
            readOnly={editTag}
            onChange={handleChange}
                                                className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.description ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
          />
        </div>

          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Master</label>
            <select
              id="gst_percentage"
              name="gst_percentage"
              value={addNewSkuData?.gst_percentage ? parseFloat(addNewSkuData.gst_percentage) : ''}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Tax</option>
              <option value={5}>5%</option>
              <option value={10}>10%</option>
              <option value={15}>15%</option>
            </select>
          </div>
        </div>

        <div className="col-span-4 mt-2 mb-2">
          <button
            type="button"
            onClick={handleAddField}
            className="bg-purple-500 text-white text-sm px-1 py-1 rounded-md shadow-md hover:bg-purple-400 transition-colors"
          >
            + Add Fields
          </button>
        </div>

        {/* Render Dynamic Tag Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tagFields.map((field, index) => (
            <div key={index} className="relative flex flex-col gap-1 w-[200px]">
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
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
      {/*popup for client create*/}
      {!isDrawerOpen && (
        <PopUp
          header={'Select Client/Vendor'}
          visible={isPopupOpen}
          setVisible={setPopupOpen}
          showCloseButton={true}
          width={'35vw'}
        >
          <SelectionCards
            selectionFrame={selectionFrame}
            selected={selected}
            onSelect={handleSelectAction}
          />
        </PopUp>
      )}

      <PopUp
        header={'Select Client/Vendor'}
        visible={isDrawerOpen}
        setVisible={setDrawerOpen}
        showCloseButton={true}
        width={'1200px'}
        height={'700px'}
      >
        {/* Pass handleCloseDrawer as a prop to ClientForm */}
        <ClientForm
          entity_type={entityType}
          refreshClients={refreshClients}
          closeDrawerDuringAdd={() => handleCloseDrawer(false)}
          resetForm={isDrawerOpen}
          submitFromRsc={submitFromRsc}
          setDrawerOpen={setDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          setMessage={setMessage}
        />
      </PopUp>

      <PopUp
        header={'Select Route'}
        visible={isSingleViewPopupRoute}
        setVisible={setisSingleViewPopupRoute}
        showCloseButton={true}
        width={'60vw'}
      >
        <RoutePopup
          editTag={editTag}
          addNewSkuData={addNewSkuData}
          fullRouteResponse={fullRouteResponse}
          setisSingleViewPopupRoute={setisSingleViewPopupRoute}
        />
      </PopUp>
    </div>
  )
}

export default CustomItem
