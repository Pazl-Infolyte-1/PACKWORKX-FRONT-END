import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import {
  cilChevronCircleDownAlt,
  cilChevronDoubleDown,
  cilPencil,
  cilPlus,
  cilTrash,
} from '@coreui/icons'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import CustomAlert from '../../components/New/CustomAlert'
import PlyToggle from '../../components/New/PlyToggle'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import { Drawer } from '@mui/material'
import ClientForm from '../Client/ClientForm'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import PopUp from '../../components/New/PopUp'
import ContactPersonsForm from '../Client/ContactPersonsForm'
import SelectionCards from '../../components/New/SelectionCards'
import RoutePopup from './RoutePopup'
import { useDispatch, useSelector } from 'react-redux'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import { setRscDeckleSize } from '../../action'
import { cilCloudUpload } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { machineApi } from '../../api/machine'
import { commonApi } from '../../api/common'

function RSCBox({
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
  locationvalue,
  onUnitChange,
  setBoardSizeError,
  onMeterDataChange,
  editTag,
  toThreeDecimalFixed,
  isopenval,
  compositeSelect,
  setPopupOpen,
  isPopupOpen,
  message,
  setMessage,
  errors,
  setErrors,
  setRscUnits,
  uploadedFiles,
  setUploadedFiles,
  rscUnits
}) {
  const [alerts, setAlerts] = useState([])
  const [unitTooltip, setUnitTooltip] = useState('Enter Millimeter')
  const [metricSign, setMetricsSign] = useState('mm')
  const [areaInM2, setAreaInM2] = useState(null)
  const [boarderr, setBoardErr] = useState(null)
  const [isRscOpen, setIsRscOpen] = useState(true)
  const [previousSkuType, setPreviousSkuType] = useState(null)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  //const [isPopupOpen, setPopupOpen] = useState(false)
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [entityType, setEntityType] = useState('') // State to hold entity_type
  const [selected, setSelected] = useState('vendor')
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [submitFromRsc, setSubmitFromRsc] = useState(true)
  const [isSingleViewPopupRoute, setisSingleViewPopupRoute] = useState(false)
  const [routeListData, setRouteListData] = useState({})
  const [selectedRoutes, setSelectedRoutes] = useState([])
  const [selectedRoutesVal, setSelectedRoutesVal] = useState([])
  const [fullRouteResponse, setFullRouteResponse] = useState(null)
  const [displayAsChips, setDisplayAsChips] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [helperBoard,setHelperBoard] = useState(0)
  //const [uploadedFiles, setUploadedFiles] = useState([]); // file URLs
  const [fileNames, setFileNames] = useState([])
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP, // Show 5 items with scroll
        width: 200,
      },
    },
  }

  const navigate = useNavigate()
  const deckleSize = useSelector((state) => state.deckleSize)

  const dispatch = useDispatch()

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

  const calculateBoardSize = (data) => {
    const length = parseFloat(data.length) || 0
    const width = parseFloat(data.width) || 0
    const height = parseFloat(data.height) || 0
    const lengthTrimmingTolerance = parseFloat(data.length_trimming_tolerance) || 0
    const widthTrimmingTolerance = parseFloat(data.width_trimming_tolerance) || 0
    const upsval = parseFloat(data.ups) || 0
    const flapWidth = Number(parseFloat(data.flap_width)) || 0

    const lengthBoardSize = ((length + width) * 2) + lengthTrimmingTolerance + flapWidth
    const widthBoardSize = ((width + height)*upsval) + widthTrimmingTolerance
        const widthBoardSizeHelper= ((width + height)*1) + widthTrimmingTolerance
setHelperBoard(widthBoardSizeHelper)
    const totalBoardSize = lengthBoardSize * widthBoardSize
    //const deckleSizeVal = widthBoardSize * upsval
    const EPSILON = 0.001
    //const deckleSize = parseFloat(data.deckle_size) || deckleSizeVal
    const deckleSize = parseFloat(data.deckle_size)
    if (lengthBoardSize && widthBoardSize) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.length_board_size_cm2
        delete newErrors.width_board_size_cm2
        return newErrors
      })
    }

    //if (deckleSize + EPSILON <= deckleSizeVal) {
    //  // throw error only if clearly smaller, allowing minor float diff
    //  return {
    //    length_board_size_cm2: Number(lengthBoardSize.toFixed(2)),
    //    width_board_size_cm2: Number(widthBoardSize.toFixed(2)),
    //    board_size_cm2: Number(totalBoardSize.toFixed(2)),
    //    deckle_size: Number(deckleSizeVal),
    //    ups: Number(upsval.toFixed()),
    //    error: `Deckle size must be greater than or equal to ${deckleSizeVal.toFixed(2)}.`,
    //  }
    //}

    return {
      length_board_size_cm2: Number(lengthBoardSize.toFixed(2)),
      width_board_size_cm2: Number(widthBoardSize.toFixed(2)),
      board_size_cm2: Number(totalBoardSize.toFixed(2)),
      //deckle_size: Number(deckleSize),
      ups: Number(upsval.toFixed()),
      error: '',
    }
  }

  const MM_TO_INCH = 0.039370078740157
  const INCH_TO_MM = 25.4
  const MM_TO_CM = 0.1
  const CM_TO_MM = 10
  const INCH_TO_CM = 2.54
  const CM_TO_INCH = 1 / INCH_TO_CM

  const modifiedHandleChange = (e) => {
    setBoardSizeError('')
    setAlerts([])

    const { name, value } = e.target
    let updatedValue = parseFloat(value)

    if (!isNaN(updatedValue)) {
      if (addNewSkuData.unit === 'mm') {
        updatedValue = parseFloat(updatedValue.toFixed(2))
      } else if (addNewSkuData.unit === 'in') {
        updatedValue = parseFloat((updatedValue * INCH_TO_MM).toFixed(2))
      } else if (addNewSkuData.unit === 'cm') {
        updatedValue = parseFloat((updatedValue * CM_TO_MM).toFixed(2))
      }
    }

    const updatedSkuData = { ...addNewSkuData, [name]: updatedValue }

    const boardSizeFields = [
      'length',
      'width',
      'height',
      'joints',
      'deckle_size',
      'length_trimming_tolerance',
      'width_trimming_tolerance',
      'ups',
      'flap_width',
      'length_board_size_cm2',
      'width_board_size_cm2',
      'board_size_cm2',
    ]

    if (boardSizeFields.includes(name)) {
      const boardSizeUpdates = calculateBoardSize(updatedSkuData)
      if (boardSizeUpdates.error) {
        console.error(boardSizeUpdates.error)
        setBoardErr(boardSizeUpdates)
        setAlerts([{ severity: 'error', message: boardSizeUpdates.error }])
        if (setBoardSizeError) {
          setBoardSizeError(boardSizeUpdates.error)
        }
      }
      setAddNewSkuData((prev) => ({
        ...prev,
        [name]: updatedValue,
        ...boardSizeUpdates,
      }))
    } else {
      setAddNewSkuData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }))
    }

    if (handleChange) {
      handleChange(e)
    }
  }

  const handleUnitChange = (e) => {
    const newUnit = e.target.value
    console.log('Unit changed to:', newUnit)
    setRscUnits(newUnit)
    console.log('Previous unit:', addNewSkuData.unit)
    setUnitTooltip(
      newUnit === 'mm'
        ? 'Enter Millimeter'
        : newUnit === 'in'
          ? 'Enter Inches'
          : 'Enter Centimeter',
    )
    setMetricsSign(newUnit === 'mm' ? 'mm' : newUnit === 'in' ? 'in' : 'cm')

    setAddNewSkuData((prev) => {
      const convertValue = (val) => {
        if (val === '' || val === null || typeof val === 'undefined') return ''

        const parsed = parseFloat(val)
        if (isNaN(parsed)) return ''

        let valueInMM = parsed

        if (prev.unit === 'in') valueInMM = parsed * INCH_TO_MM
        else if (prev.unit === 'cm') valueInMM = parsed * CM_TO_MM

        if (newUnit === 'in') return parseFloat(valueInMM / INCH_TO_MM)
        if (newUnit === 'cm') return parseFloat(valueInMM * MM_TO_CM)

        return parseFloat(valueInMM)
      }

      const length_board_size_cm2 = convertValue(prev.length_board_size_cm2)
      const width_board_size_cm2 = convertValue(prev.width_board_size_cm2)

      console.log('convert value', parseInt(convertValue(prev.length)))
      console.log('convert value', parseInt(convertValue(prev.width)))
      console.log('convert value', parseInt(convertValue(prev.height)))

      return {
        ...prev,
        unit: newUnit,
        length: Number(convertValue(prev.length)),
        width: Number(convertValue(prev.width)),
        height: Number(convertValue(prev.height)),
        flap_width: Number(convertValue(prev.flap_width)),
        length_trimming_tolerance: Number(convertValue(prev.length_trimming_tolerance)),
        width_trimming_tolerance: Number(convertValue(prev.width_trimming_tolerance)),
        joints: Number(convertValue(prev.joints)),
        deckle_size: Number(convertValue(prev.deckle_size)),
        length_board_size_cm2,
        width_board_size_cm2,
        board_size_cm2: Number(
          parseFloat((length_board_size_cm2 * width_board_size_cm2).toFixed(2)),
        ),
        ups: Number(convertValue(prev.ups)),
      }
    })
  }

  const handleClose = () => {
    setAlerts([])
  }

  useEffect(() => {
    let area = addNewSkuData.board_size_cm2
    //let convertedArea

    //switch (metricSign) {
    //  case 'mm':
    //    convertedArea = area / 1_000_000
    //    break
    //  case 'cm':
    //    convertedArea = area / 10_000
    //    break
    //  case 'in':
    //    convertedArea = area * 0.00064516
    //    break
    //  default:
    //    console.warn('Unknown metric sign:', metricSign)
    //    setAreaInM2(null)
    //    return
    //}

    onMeterDataChange(area)
    //setAreaInM2(convertedArea)
  }, [addNewSkuData?.board_size_cm2, metricSign])

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

  //functionality for route popup
  const handleBrowseClickRoute = () => {
    setisSingleViewPopupRoute(true)
  }

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
  useEffect(() => {
    setAddNewSkuData((prev) => {
      const updatedData = { ...prev }
      let changed = false

      if (prev.flap_tolerance === '') {
        updatedData.flap_tolerance = null
        changed = true
      }

      if (prev.composite_type === '') {
        updatedData.composite_type = null
        changed = true
      }

      if (prev.part_count === '') {
        updatedData.part_count = null
        changed = true
      }

      return changed ? updatedData : prev
    })
  }, [addNewSkuData.flap_tolerance, addNewSkuData.composite_type, addNewSkuData.part_count])

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

  //useEffect(() => {
  //  const { length, width, height } = addNewSkuData

  //  // Check all three values are present and not null
  //  if (length && width && height) {
  //    const lwhValue = `${length}X${width}X${height}`
  //    setAddNewSkuData((prev) => ({
  //      ...prev,
  //      lwh: lwhValue,
  //    }))
  //  }
  //}, [addNewSkuData.length, addNewSkuData.width, addNewSkuData.height])

  console.log('length height', addNewSkuData.length)
  console.log('length height', addNewSkuData.height)
  console.log('ups', addNewSkuData.ups)
  useEffect(() => {
    let { length, height, ups } = addNewSkuData

    // Convert to numbers if they are strings
    length = typeof length === 'string' ? Number(length) : length
    height = typeof height === 'string' ? Number(height) : height
    ups = typeof ups === 'string' ? Number(ups) : ups

    // Dispatch only if all are valid numbers
    if (!isNaN(length) && !isNaN(height) && !isNaN(ups)) {
      dispatch(setRscDeckleSize({ length, height, ups }))
    }
  }, [addNewSkuData.length, addNewSkuData.height, addNewSkuData.ups])

  useEffect(() => {
    if (deckleSize !== undefined && deckleSize !== null) {
      setAddNewSkuData((prev) => ({
        ...prev,
        deckle_size: deckleSize,
      }))
    }
  }, [deckleSize])
  console.log('deckle size', deckleSize)
  useEffect(() => {
    if (
      addNewSkuData.inner_outer_dimension === null ||
      addNewSkuData.inner_outer_dimension === undefined ||
      addNewSkuData.inner_outer_dimension === ''
    ) {
      setAddNewSkuData((prev) => ({
        ...prev,
        inner_outer_dimension: 'Inner',
      }))
    }
  }, [addNewSkuData.inner_outer_dimension])

  const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)

    const urls = [...uploadedFiles]
    const names = [...fileNames]

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await commonApi.uploadFile(formData)
        const fileUrl = response?.data?.data?.file_url

        if (fileUrl) {
          urls.push(fileUrl)
          names.push(file.name)
        }
      } catch (err) {
        console.error('File upload failed:', err)
      }
    }

    setUploadedFiles(urls)
    setAddNewSkuData((prev) => ({
      ...prev,
      documents: urls,
    }))
    setFileNames(names)

    setIsUploading(false)
    event.target.value = ''
  }

  // Add this function to handle file removal
  const removeFile = (indexToRemove) => {
    const updatedUrls = uploadedFiles.filter((_, index) => index !== indexToRemove)
    const updatedNames = fileNames.filter((_, index) => index !== indexToRemove)

    setUploadedFiles(updatedUrls)
    setAddNewSkuData((prev) => ({
      ...prev,
      documents: updatedUrls, // Keep documents in sync
    }))
    setFileNames(updatedNames)
  }

  //document edit
  useEffect(() => {
    // Clear files only if print_type is 'None' and documents are not already empty
    if (addNewSkuData.print_type === 'None') {
      if (uploadedFiles.length > 0 || addNewSkuData.documents.length > 0) {
        setUploadedFiles([])
        setFileNames([])

        // Only update documents if not already empty
        if (addNewSkuData.documents.length > 0) {
          setAddNewSkuData((prev) => ({
            ...prev,
            documents: [],
          }))
        }
      }
      return
    }

    // Load files only if editing and there are documents to load
    if (editTag && addNewSkuData.documents?.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles([...addNewSkuData.documents])
      setFileNames(
        addNewSkuData.documents.map((file) =>
          typeof file === 'string' ? file.split('/').pop() : file.name,
        ),
      )
    }
  }, [editTag, addNewSkuData.print_type]) // <- remove addNewSkuData.documents from deps


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


console.log("unit///",rscUnits)
  return (
    <div className="rounded-lg ">
      <CustomAlert alerts={alerts} handleClose={handleClose} />

      {/* Top header fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-3 border border-gray-200 rounded-lg">
        <div className="w-[200px]">
          <label className="block text-sm  font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">
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
                      {option?.sku_type}
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
            value={addNewSkuData?.sku_name}
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
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Client <span className="text-red-500 ml-1">*</span>
              </label>

              <FormControl sx={{ width: '100%' }} error={errors.client_id ? true : false}>
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
                renderValue={(selected) => {
    // Show placeholder if none selected
    if (!selected) return <em>Select</em>;

    // Show display_name of matched client_id
    const selectedClient = client.find(
      (item) => item.client_id === selected
    );
    return selectedClient ? selectedClient.display_name : 'Unknown';
  }}
>
  <MenuItem value="" disabled>
    <em>Select</em>
  </MenuItem>
  {client.map((item) => (
    <MenuItem key={item.client_id} value={item.client_id}>
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
                      sku_type_for_navigate: 'RSC box',
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

        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Reference Code
          </label>
          <input
            id="customer_reference"
            name="customer_reference"
            value={addNewSkuData.customer_reference}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Reference #</label>
          <input
            id="reference_number"
            name="reference_number"
            //value={Number(addNewSkuData.reference_number) || null}
                value={addNewSkuData.reference_number || ''}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            readOnly
          />
        </div>
      </div>
      <div className="w-full flex justify-end mt-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 font-medium">Select Units:</label>
          <div className="relative w-28">
            <select
              value={addNewSkuData.unit || rscUnits}
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
        <div>
          <PlyToggle
            value={addNewSkuData?.ply}
            onChange={(selectedPly) => updateSkuValues(selectedPly)}
            errorMessage={errors.ply}
            editTag={editTag}
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimensions <span className="text-gray-500 text-xs">(L × W × H)</span>
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.width === 'Required' &&
                errors.length === 'Required' &&
                errors.height === 'Required' && (
                  <span className="text-red-500 text-xs ml-2 align-middle">Required</span>
                )}*/}
            </label>

            <div
              className={`h-8 w-[200px] rounded-md flex items-center bg-white ${
                errors.width === 'Required' ||
                errors.length === 'Required' ||
                errors.height === 'Required'
                  ? 'border-2 border-red-500'
                  : 'border border-gray-300'
              }`}
            >
              <input
                min="0"
                id="length"
                name="length"
                type="number"
                value={Math.round(Number(addNewSkuData.length) * 100) / 100 || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                    inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                className="w-[55px] p-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-l-md"
              />
              <span className="text-gray-500 px-1">x</span>
              <input
                id="width"
                name="width"
                type="number"
                value={Math.round(Number(addNewSkuData.width) * 100) / 100 || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                min="0"
                    inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                className="w-[55px] p-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-500 px-1">x</span>
              <input
                id="height"
                name="height"
                type="number"
                value={Math.round(Number(addNewSkuData.height) * 100) / 100 || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                    inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                className="w-[55px] p-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joints
                <span className="text-red-500 ml-1">*</span>
                {/*{errors.joints && (
                  <span className="text-red-500 text-xs ml-2 align-middle">{errors.joints}</span>
                )}*/}
              </label>
              <input
                id="joints"
                name="joints"
                value={addNewSkuData?.joints ?? ''}
                onChange={handleChange}
                readOnly={editTag}
                type="text"
                inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                className={`w-full h-8 p-1 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.joints ? 'border-2 border-red-500' : 'border border-gray-300'
                }`}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deckle Size
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="deckle_size"
                name="deckle_size"
                value={Number(toThreeDecimalFixed(addNewSkuData.deckle_size)) || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                    inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                //className="w-full h-8 p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                className={`w-full h-8 p-1 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.deckle_size ? 'border-2 border-red-500' : 'border border-gray-300'
                }`}
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {/*Deckle should be greater than (({Math.round(Number(addNewSkuData?.length) * 100) / 100 || ''} + {Math.round(Number(addNewSkuData?.height) * 100) / 100 || ''}) × {Math.round(Number(addNewSkuData?.ups) * 100) / 100 || ''}) + 20*/}
                Deckle should be greater than {deckleSize}
              </p>
            </div>
          </div>
        </Tooltip>

        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inner/Outer Dimension
            <span className="text-red-500 ml-1">*</span>
            {errors.inner_outer_dimension && (
              <span className="text-red-500 text-xs ml-2 align-middle">
                {errors.inner_outer_dimension}
              </span>
            )}
          </label>
          <div className="flex space-x-4 p-1 border border-gray-300 rounded-md h-9 items-center">
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Inner"
                // checked={addNewSkuData.inner_outer_dimension ? addNewSkuData.inner_outer_dimension === 'Inner' : true}
                checked={addNewSkuData.inner_outer_dimension === 'Inner'}
                onChange={handleChange}
                readOnly={editTag}
                className="mr-1 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">Inner</span>
            </label>
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Outer"
                checked={addNewSkuData.inner_outer_dimension === 'Outer'}
                onChange={handleChange}
                readOnly={editTag}
                className="mr-1 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">Outer</span>
            </label>
          </div>
        </div>

        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flap Width
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.flap_width && (
                <span className="text-red-500 text-sm ml-2 align-middle">{errors.flap_width}</span>
              )}*/}
            </label>
            <input
              id="flap_width"
              name="flap_width"
              value={Number(addNewSkuData.flap_width) || ""}
              onChange={modifiedHandleChange}
              readOnly={editTag}
              className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.flap_width ? 'border-2 border-red-500' : 'border border-gray-300'
              }`}
                  inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
            />
          </div>
        </Tooltip>

        {/* <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Internal Id
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="internal_id"
            name="internal_id"
            value={Number(addNewSkuData.internal_id) || null}
            onChange={handleChange}
            readOnly={editTag}
            className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.internal_id ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
          />
        </div> */}

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board Size <span className="text-gray-500 text-xs">(W × L)</span>
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.width_board_size_cm2 && errors.length_board_size_cm2 && (
                <span className="text-red-500 text-xs ml-2 align-middle">
                  {errors.width_board_size_cm2}
                </span>
              )}*/}
            </label>
            <div
              className={`h-8 w-[200px] rounded-md flex items-center bg-white ${
                errors.width_board_size_cm2 || errors.length_board_size_cm2
                  ? 'border-2 border-red-500'
                  : 'border border-gray-300'
              }`}
            >
              <input
                id="width_board_size_cm2"
                name="width_board_size_cm2"
                value={Number(toThreeDecimalFixed(addNewSkuData.width_board_size_cm2)) || ''}
                onChange={modifiedHandleChange}
                className="w-[50%] p-[2px] text-center text-sm focus:outline-none rounded-l-md bg-gray-50"
                title={unitTooltip}
                readOnly
              />
              <span className="flex items-center justify-center text-gray-500 text-sm">x</span>
              <input
                id="length_board_size_cm2"
                name="length_board_size_cm2"
                value={Number(toThreeDecimalFixed(addNewSkuData.length_board_size_cm2)) || ''}
                onChange={modifiedHandleChange}
                className="w-[50%] p-[2px] text-center text-sm focus:outline-none bg-gray-50"
                title={unitTooltip}
                readOnly
              />
            </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {/*Deckle should be greater than (({Math.round(Number(addNewSkuData?.length) * 100) / 100 || ''} + {Math.round(Number(addNewSkuData?.height) * 100) / 100 || ''}) × {Math.round(Number(addNewSkuData?.ups) * 100) / 100 || ''}) + 20*/}
                {/*Board width per UPS {Math.round((addNewSkuData.width_board_size_cm2)/(((addNewSkuData?.ups) * 100)/100))}*/}
                Board width per UPS {helperBoard}
              </p>
          </div>
        </Tooltip>

        <div className="w-[200px]">
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
            value={Math.round(Number(addNewSkuData?.ups) * 100) / 100 || ''}
            onChange={modifiedHandleChange}
            readOnly={editTag}
            className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.ups ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
                inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length Trimming Tolereance
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.length_trimming_tolerance && (
                <span className="text-red-500 text-sm ml-2 align-middle">
                  {errors.length_trimming_tolerance}
                </span>
              )}*/}
            </label>
            <input
              id="length_trimming_tolerance"
              name="length_trimming_tolerance"
              value={
                Math.round(Number(addNewSkuData.length_trimming_tolerance) * 100) / 100 || null
              }
              onChange={modifiedHandleChange}
              readOnly={editTag}
              className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.length_trimming_tolerance
                  ? 'border-2 border-red-500'
                  : 'border border-gray-300'
              }`}
                  inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width Trimming Tolereance
              <span className="text-red-500 ml-1">*</span>
              {/*{errors.width_trimming_tolerance && (
                <span className="text-red-500 text-sm ml-2 align-middle">
                  {errors.width_trimming_tolerance}
                </span>
              )}*/}
            </label>
            <input
              id="width_trimming_tolerance"
              name="width_trimming_tolerance"
              value={Math.round(Number(addNewSkuData.width_trimming_tolerance) * 100) / 100 || null}
              onChange={modifiedHandleChange}
              readOnly={editTag}
              className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.width_trimming_tolerance
                  ? 'border-2 border-red-500'
                  : 'border border-gray-300'
              }`}
                  inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
            />
          </div>
        </Tooltip>

        <div className="w-[200px]">
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
            type="number"
            min="0"
            value={Number(addNewSkuData.minimum_order_level) || ""}
            onChange={handleChange}
            className={`w-full p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.minimum_order_level ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
                inputMode="numeric"
                onKeyPress={(e) => {
                  // Only allow numbers 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
          />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Master</label>
          <select
            id="gst_percentage"
            name="gst_percentage"
            value={addNewSkuData?.gst_percentage || null}
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
            disabled={editTag}
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
                disabled={editTag}
                className="hidden"
              />

              {/* Uploading text */}
              {isUploading && <div className="text-sm text-blue-600 mt-2">Uploading files...</div>}

              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Uploaded files:</p>
                  <ul className="space-y-0.5">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center text-xs w-full max-w-[240px]">
                        <div className="flex-1 truncate text-gray-700">
                          {file.name ||
                            (typeof file === 'string'
                              ? file.split('/').pop()
                              : file.url.split('/').pop())}
                        </div>
                        <button
                          type="button"
                        disabled={editTag}
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

      {/*common popup for routes*/}
      <PopUp
        header={'Select SKU'}
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

export default RSCBox
