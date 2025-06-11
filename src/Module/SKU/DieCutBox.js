import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilCloudUpload, cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import DiePopupTable from './DiePopupTable'
import PopUp from '../../components/New/PopUp'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import PlyToggle from '../../components/New/PlyToggle'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import ClientForm from '../Client/ClientForm'
import SelectionCards from '../../components/New/SelectionCards'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import RoutePopup from './RoutePopup'
import { useDispatch, useSelector } from 'react-redux'
import apiMethods from '../../api/config'
import { useNavigate } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { machineApi } from '../../api/machine'
import { commonApi } from '../../api/common'

function DieCutBox({
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
  setErrors,
         uploadedFiles,
          setUploadedFiles,
          onMeterDataChange,
          setRscUnits
}) {
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [selectedDiePopup, setSelectedDiePopup] = useState(null)
  const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [entityType, setEntityType] = useState('') // State to hold entity_type
  const [submitFromRsc, setSubmitFromRsc] = useState(true)
  const dispatch = useDispatch()
  const [displayAsChips, setDisplayAsChips] = useState([])
  const [isSingleViewPopupRoute, setisSingleViewPopupRoute] = useState(false)
  const [fullRouteResponse, setFullRouteResponse] = useState(null)
  const [unitTooltip, setUnitTooltip] = useState('Enter Millimeter')
    const [isUploading, setIsUploading] = useState(false);
//const [uploadedFiles, setUploadedFiles] = useState([]); // file URLs
const [fileNames, setFileNames] = useState([]); 
const navigate=useNavigate()
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
  const handleBrowseClick = () => {
    setisSingleViewPopup(true)
  }

  useEffect(() => {
    if (selectedDiePopup) {
      setAddNewSkuData((prev) => ({
        ...prev,
        select_dies: selectedDiePopup.name,
        width_board_size_cm2: selectedDiePopup.board_width,
        length_board_size_cm2: selectedDiePopup.board_length,
      }))
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.select_dies
        delete newErrors.width_board_size_cm2
        delete newErrors.length_board_size_cm2
        return newErrors
      })
    }
  }, [selectedDiePopup])
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isopenval) {
        const message = "Don't refresh or else your data will be lost!"
        event.preventDefault() // For most browsers
        event.returnValue = message // For Chrome
        return message // For Firefox
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isopenval])

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
    setTriggerSelection(true) // Ensures it runs handleSelection
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }
  const refreshClients = () => {
    setReloadData((prev) => !prev) //  Toggle state to trigger `useEffect`
  }

  useEffect(() => {
    if (triggerSelection) {
      handleSelection(selected)
      setTriggerSelection(false) // Reset trigger
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
      return // Disable arrow key functionality if the popup is not open
    }
    if (event.key === 'ArrowRight') {
      handleSelectAction('client')
      setEntityType('Client') // Update state
    } else if (event.key === 'ArrowLeft') {
      handleSelectAction('vendor')
      setEntityType('Vendor') // Update state
    } else if (event.key === 'Enter') {
      setTriggerSelection(true) // Mark that Enter was pressed
    }
  }

  useEffect(() => {
    if (message) {
      setAlerts([{ severity: 'success', message }])

      const timer = setTimeout(() => {
        setAlerts([]) // Clear alerts after 3 seconds
      }, 3000)

      return () => clearTimeout(timer) // Cleanup on unmount or message change
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
        setFullRouteResponse(response) // ✅ Save full response here
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

  const handleUnitChange = (e) => {
    const newUnit = e.target.value
          setRscUnits(newUnit);
    let tooltipMessage = ''
    switch (newUnit) {
      case 'cm':
        tooltipMessage = 'Enter Centimeter'
        break
      case 'in':
        tooltipMessage = 'Enter Inches'
        break
      case 'mm':
      default:
        tooltipMessage = 'Enter Millimeter'
        break
    }
    setAddNewSkuData((prevData) => {
      const currentUnit = prevData.unit || 'mm'

      const widthConverted = convertValue(prevData.width_board_size_cm2, currentUnit, newUnit)
      const lengthConverted = convertValue(prevData.length_board_size_cm2, currentUnit, newUnit)
      const jointsConverted = convertValue(prevData.joints, currentUnit, newUnit)
      const upsConverted = convertValue(prevData.ups, currentUnit, newUnit)
      const flapwidthConverted = convertValue(prevData.flap_width, currentUnit, newUnit)
      const flapToleranceConverted = convertValue(prevData.flap_tolerance, currentUnit, newUnit)
      const lengthTrimmingToleranceConverted = convertValue(
        prevData.length_trimming_tolerance,
        currentUnit,
        newUnit,
      )
      const decklesizeConverted = convertValue(prevData.deckle_size, currentUnit, newUnit)

      return {
        ...prevData,
        unit: newUnit,
        width_board_size_cm2: parseFloat(widthConverted.toFixed(2)),
        length_board_size_cm2: parseFloat(lengthConverted.toFixed(2)),
        //joints:parseFloat(jointsConverted.toFixed(2)),
        ups: parseFloat(upsConverted.toFixed(2)),
        //flap_width:parseFloat(flapwidthConverted.toFixed(2)),
        //flap_tolerance:parseFloat(flapToleranceConverted.toFixed(2)),
        //length_trimming_tolerance:parseFloat(lengthTrimmingToleranceConverted.toFixed(2)),
        deckle_size: parseFloat(decklesizeConverted.toFixed(2)),
      }
    })

    setUnitTooltip(tooltipMessage)
  }

  const convertValue = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value

    // Convert input value to mm first
    let valueInMm = value
    switch (fromUnit) {
      case 'cm':
        valueInMm = value * 10
        break
      case 'in':
        valueInMm = value * 25.4
        break
      case 'mm':
      default:
        break
    }

    // Convert from mm to desired unit
    switch (toUnit) {
      case 'cm':
        return valueInMm / 10
      case 'in':
        return valueInMm / 25.4
      case 'mm':
      default:
        return valueInMm
    }
  }
  useEffect(() => {
    const { length_board_size_cm2, width_board_size_cm2, ups } = addNewSkuData || {}

    if (length_board_size_cm2 && width_board_size_cm2 && ups) {
      dispatch({
        type: 'SET_DIECUT_DECKLE_SIZE',
        payload: {
          lengthBoard: length_board_size_cm2,
          widthBoard: width_board_size_cm2,
          ups: ups,
        },
      })
    }
  }, [addNewSkuData, dispatch])

  const diecutCalculations = useSelector((state) => state.diecutCalculations)

  useEffect(() => {
    // Ensure all the required values exist
    if (addNewSkuData) {
      dispatch({
        type: 'SET_DIECUT_DECKLE_SIZE',
        payload: {
          lengthBoard: addNewSkuData.length_board_size_cm2,
          widthBoard: addNewSkuData.width_board_size_cm2,
          ups: addNewSkuData.ups,
          deckle_size: addNewSkuData.deckle_size, // passed from form or calculated elsewhere
        },
      })
    }
  }, [addNewSkuData, addNewSkuData.deckle_size, dispatch]) // This runs when `addNewSkuData` changes

  useEffect(() => {
    if (diecutCalculations.calculatedMin) {
      setAddNewSkuData((prev) => ({
        ...prev,
        deckle_size: diecutCalculations.calculatedMin,
      }))
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.deckle_size
        return newErrors
      })
    }
  }, [diecutCalculations.calculatedMin])

  const selectedRouteIds2 = useSelector((state) => state.routeprocess?.selectedRouteIds || [])

  useEffect(() => {
    if (selectedRouteIds2.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.route
        return newErrors
      })
    }
  }, [selectedRouteIds2])



    const handleFileUpload = async (event) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;
    
      setIsUploading(true);
    
      const urls = [...uploadedFiles];
      const names = [...fileNames];
    
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await commonApi.uploadFile(formData);
          const fileUrl = response?.data?.data?.file_url;
    
          if (fileUrl) {
            urls.push(fileUrl);
            names.push(file.name);
          }
        } catch (err) {
          console.error('File upload failed:', err);
        }
      }
    
      setUploadedFiles(urls);
        setAddNewSkuData(prev => ({
        ...prev,
        documents: urls
      }));
      setFileNames(names);
    
      setIsUploading(false);
      event.target.value = '';
    };
    
    // Add this function to handle file removal
    const removeFile = (indexToRemove) => {
      const updatedUrls = uploadedFiles.filter((_, index) => index !== indexToRemove);
      const updatedNames = fileNames.filter((_, index) => index !== indexToRemove);
    
      setUploadedFiles(updatedUrls);
        setAddNewSkuData((prev) => ({
        ...prev,
        documents: updatedUrls, // Keep documents in sync
      }));
      setFileNames(updatedNames);
    };
    
    //document edit
   useEffect(() => {
    // Clear files only if print_type is 'None' and documents are not already empty
    if (addNewSkuData.print_type === 'None') {
      if (uploadedFiles.length > 0 || addNewSkuData.documents.length > 0) {
        setUploadedFiles([]);
        setFileNames([]);
  
        // Only update documents if not already empty
        if (addNewSkuData.documents.length > 0) {
          setAddNewSkuData((prev) => ({
            ...prev,
            documents: [],
          }));
        }
      }
      return;
    }
  
    // Load files only if editing and there are documents to load
    if (editTag && addNewSkuData.documents?.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles([...addNewSkuData.documents]);
      setFileNames(
        addNewSkuData.documents.map((file) =>
          typeof file === 'string' ? file.split('/').pop() : file.name
        )
      );
    }
  }, [editTag, addNewSkuData.print_type]); // <- remove addNewSkuData.documents from deps
  

  useEffect(() => {
    let area = addNewSkuData.width_board_size_cm2*addNewSkuData.width_board_size_cm2

    onMeterDataChange(area)
    //setAreaInM2(convertedArea)
  }, [addNewSkuData.width_board_size_cm2*addNewSkuData.width_board_size_cm2])

      useEffect(() => {
  if (addNewSkuData.sku_name && addNewSkuData.customer_reference) {
    setAddNewSkuData((prev) => ({
      ...prev,
      reference_number: `${prev.sku_name}/${prev.customer_reference}`,
    }));
  } else {
    setAddNewSkuData((prev) => ({
      ...prev,
      reference_number: '',
    }));
  }
}, [addNewSkuData.sku_name, addNewSkuData.customer_reference]);

  return (
    <div className="rounded-lg">
      {/* Top header fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-3 border border-gray-200 rounded-lg">
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
        sku_type_for_navigate: 'Die Cut box',
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

        <div>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Reference Code
            </label>
            <input
              id="customer_reference"
              name="customer_reference"
              min={0}
              value={addNewSkuData.customer_reference}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference #</label>
            <input
              id="reference_number"
              name="reference_number"
              min={0}
               value={addNewSkuData.reference_number || ''}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end mt-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 font-medium">Select Units:</label>
          <div className="relative w-28">
            <select
              value={addNewSkuData.unit || 'mm'}
              onChange={handleUnitChange}
              className="w-full appearance-none bg-gray-700 text-white py-1.5 px-2 pr-7 rounded-md text-sm hover:bg-gray-400 transition-colors focus:outline-none"
            >
              <option value="mm" className="bg-white text-gray-800">
                mm
              </option>
              <option value="cm" className="bg-white text-gray-800">
                cm
              </option>
              <option value="in" className="bg-white text-gray-800">
                in
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-white">
              <CIcon icon={cilChevronCircleDownAlt} size="sm" />
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 mt-6 border border-gray-200 rounded-lg">
        <PlyToggle
          value={addNewSkuData.ply}
          onChange={(selectedPly) => updateSkuValues(selectedPly)}
          errorMessage={errors.ply}
          editTag={editTag}
        />
        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPS
                <span className="text-red-500 ml-1">*</span>
                {/*{errors.ups && (
                  <span className="text-red-500 text-sm ml-2 align-middle">{errors.ups}</span>
                )}*/}
              </label>
              <input
                id="ups"
                name="ups"
                type="number"
                min={0}
                value={addNewSkuData.ups}
                onChange={handleChange}
                readOnly={editTag}
                     inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                  className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.ups ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
              />
            </div>
          </div>
        </Tooltip>
        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Die
            <span className="text-red-500 ml-1">*</span>
            {/*{errors.select_dies && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.select_dies}</span>
            )}*/}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="select_dies"
              id="select_dies"
              value={addNewSkuData.select_dies || ''}
              onChange={handleChange}
             className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
    errors?.select_dies ? 'border-2 border-red-500' : 'border border-gray-300'
  }`}
              placeholder="Select"
              readOnly={true}
            />
            <button
              type="button"
              className="bg-gray-400 text-white text-sm px-1 py-1 rounded-md shadow-md hover:bg-gray-500 transition-colors"
              onClick={handleBrowseClick}
            >
              Browse
            </button>
          </div>
        </div>

        {/* <div>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internal ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="internal_id"
              name="internal_id"
              value={addNewSkuData.internal_id}
              onChange={handleChange}
              readOnly={editTag}
               className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.internal_id ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
            />
          </div>
        </div> */}

        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board Size <span className="text-gray-500 text-sm">(L × W)</span>
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.width_board_size_cm2 && errors.length_board_size_cm2 && (
                <span className="text-red-500 text-sm ml-2 align-middle">
                  {errors.width_board_size_cm2}
                </span>
              )}*/}
            </label>
            <div className={`h-8 rounded-md flex items-center bg-white ${
      errors.width_board_size_cm2 || errors.length_board_size_cm2
        ? 'border-2 border-red-500'
        : 'border border-gray-300'
    }`}>
    <input
                id="length_board_size_cm2"
                name="length_board_size_cm2"
                value={addNewSkuData.length_board_size_cm2 || null}
                onChange={handleChange}
                readOnly
                type="number"
                className="w-[50%] p-[2px] text-center focus:outline-none bg-gray-50"
                min="0"
              />
              <span className="flex items-center justify-center text-gray-500">x</span>
                            <input
                id="width_board_size_cm2"
                name="width_board_size_cm2"
                value={addNewSkuData.width_board_size_cm2 || null}
                onChange={handleChange}
                readOnly
                type="number"
                className="w-[50%] p-[2px] text-center focus:outline-none rounded-l-md bg-gray-50"
                min="0"
              />
          
            </div>
          </div>
        </Tooltip>

        <div>
          <Tooltip title={unitTooltip}>
            <div className="w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deckle Size
                <span className="text-red-500 ml-1">*</span>
                {/*{errors.deckle_size && (
                  <span className="text-red-500 text-sm ml-2 align-middle">
                    {errors.deckle_size}
                  </span>
                )}*/}
              </label>
              <input
                id="deckle_size"
                name="deckle_size"
                type="number"
                value={addNewSkuData.deckle_size}
                min="0"
                readOnly={editTag}
                onChange={handleChange}
                     inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                //className={`w-full p-1 border rounded-md focus:ring-2 transition-colors ${
                //  diecutCalculations.deckleError
                //    ? 'border-red-500 ring-red-400'
                //    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                //}`}
                           className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.deckle_size|| diecutCalculations.deckleError ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
                
              />
              {diecutCalculations.deckleError && (
                <p className="mt-1 text-sm text-red-600">{diecutCalculations.deckleError}</p>
              )}
            </div>
          </Tooltip>
        </div>

        <div className="w-[200px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Level
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.minimum_order_level && (
                <span className="text-red-500 text-sm ml-2 align-middle">
                  {errors.minimum_order_level}
                </span>
              )}*/}
            </label>
            <input
              id="minimum_order_level"
              name="minimum_order_level"
              value={addNewSkuData.minimum_order_level}
                   inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              onChange={handleChange}
                             className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.minimum_order_level ? 'border-2 border-red-500' : 'border border-gray-300'
    }`}
            />
          </div>
        </div>

        <ChipSelectorWithBrowse
          label="Route"
          required={true}
          selectedIds={selectedRouteIds1}
          allOptions={displayAsChips}
          onRemoveChip={handleRemoveChip}
          onBrowseClick={handleBrowseClickRoute}
          errors={errors}
        />
        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Master
            {/*<span className="text-red-500 ml-1">*</span>
    {errors.tax_master && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.tax_master}</span>
    )}*/}
          </label>
          <select
            id="gst_percentage"
            name="gst_percentage"
            value={addNewSkuData?.gst_percentage || ''}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Tax</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
          </select>
        </div>


        
      <div className="w-[200px]">
  <label className="block text-sm font-medium text-gray-700 mb-2">Print Type</label>
  <select
    id="print_type"
    name="print_type"
    value={addNewSkuData?.print_type || ''}
    onChange={handleChange}
    className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
  >
    <option value="">Select Type</option>
    <option value="None">None</option>
    <option value="Offset">Offset</option>
    <option value="Flexo">Flexo</option>
  </select>
</div>

{(addNewSkuData?.print_type === 'Offset' || addNewSkuData?.print_type === 'Flexo') && (
  <div className="flex w-[200px]">
    <div className="flex flex-col flex w-[200px]">
      {/* Custom styled file input */}
         <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
     <label
          htmlFor="file-upload"
          className="cursor-pointer inline-block hover:bg-gray-200 text-sm px-4 py-1 rounded-md shadow-sm transition-colors duration-200"
        >
          <CIcon icon={cilCloudUpload} size="sm" className="text-gray-700" /> Upload Files
        </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        multiple
        className="hidden"
      />

      {/* Uploading text */}
      {isUploading && (
        <div className="text-sm text-blue-600 mt-2">Uploading files...</div>
      )}

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">Uploaded files:</p>
       <ul className="space-y-0.5">
  {uploadedFiles.map((file, index) => (
    <li key={index} className="flex items-center text-xs w-full max-w-[240px]">
      <div className="flex-1 truncate text-gray-700">
        {file.name || (typeof file === 'string' ? file.split('/').pop() : file.url.split('/').pop())}
      </div>
      <button
        type="button"
        onClick={() => removeFile(index)}
        className="ml-1 text-red-500 hover:text-red-700 text-sm"
      >
        ✕
      </button>
    </li>
  ))}
</ul>

        </div>
      )}
    </div>
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
        <DiePopupTable
          setSelectedDiePopup={setSelectedDiePopup}
          selectedDiePopup={selectedDiePopup}
          setisSingleViewPopup={setisSingleViewPopup}
          client={client}
        />
      </PopUp>

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

export default DieCutBox
