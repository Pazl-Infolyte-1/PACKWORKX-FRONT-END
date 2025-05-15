import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
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
import apiMethods from '../../api/config'
import { useDispatch, useSelector } from 'react-redux'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
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

    const lengthBoardSize = (length + width) * 2 + lengthTrimmingTolerance + flapWidth
    const widthBoardSize = width + height + widthTrimmingTolerance
    const totalBoardSize = lengthBoardSize * widthBoardSize
    const deckleSizeVal = widthBoardSize * upsval
    const EPSILON = 0.001
    const deckleSize = parseFloat(data.deckle_size) || deckleSizeVal

    if (lengthBoardSize && widthBoardSize) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.length_board_size_cm2
        delete newErrors.width_board_size_cm2
        return newErrors
      })
    }

    if (deckleSize + EPSILON <= deckleSizeVal) {
      // throw error only if clearly smaller, allowing minor float diff
      return {
        length_board_size_cm2: Number(lengthBoardSize.toFixed(2)),
        width_board_size_cm2: Number(widthBoardSize.toFixed(2)),
        board_size_cm2: Number(totalBoardSize.toFixed(2)),
        deckle_size: Number(deckleSizeVal),
        ups: Number(upsval.toFixed()),
        error: `Deckle size must be greater than or equal to ${deckleSizeVal.toFixed(2)}.`,
      }
    }

    return {
      length_board_size_cm2: Number(lengthBoardSize.toFixed(2)),
      width_board_size_cm2: Number(widthBoardSize.toFixed(2)),
      board_size_cm2: Number(totalBoardSize.toFixed(2)),
      deckle_size: Number(deckleSize),
      ups: Number(upsval.toFixed()),
      error: '',
    }
  }

  const MM_TO_INCH = 0.0393701
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

        if (newUnit === 'in') return parseFloat((valueInMM * MM_TO_INCH).toFixed(2))
        if (newUnit === 'cm') return parseFloat((valueInMM * MM_TO_CM).toFixed(2))

        return parseFloat(valueInMM.toFixed(2))
      }

      const length_board_size_cm2 = convertValue(prev.length_board_size_cm2)
      const width_board_size_cm2 = convertValue(prev.width_board_size_cm2)

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
    let convertedArea

    switch (metricSign) {
      case 'mm':
        convertedArea = area / 1_000_000
        break
      case 'cm':
        convertedArea = area / 10_000
        break
      case 'in':
        convertedArea = area * 0.00064516
        break
      default:
        console.warn('Unknown metric sign:', metricSign)
        setAreaInM2(null)
        return
    }

    onMeterDataChange(convertedArea)
    setAreaInM2(convertedArea)
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
        const response = await apiMethods.getRouteList(params)
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

  const selectedChips = displayAsChips.filter((item) => selectedRouteIds1.includes(item.id))

  const chipNames = selectedChips.map((chip) => chip.route_name).join(', ')

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

  useEffect(() => {
    const { length, width, height } = addNewSkuData

    // Check all three values are present and not null
    if (length && width && height) {
      const lwhValue = `${length}X${width}X${height}`
      setAddNewSkuData((prev) => ({
        ...prev,
        lwh: lwhValue,
      }))
    }
  }, [addNewSkuData.length, addNewSkuData.width, addNewSkuData.height])
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
            {errors.sku_name && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
            )}
          </label>
          <input
            id="sku_name"
            name="sku_name"
            value={addNewSkuData?.sku_name}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="w-[200px]">
          <label className="block text-sm  font-medium text-gray-700 mb-2">
            Client Name
            <span className="text-red-500 ml-1">*</span>
            {errors.client_id && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.client_id}</span>
            )}
          </label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData.client_id}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.client_id}>
                {item.display_name}
              </option>
            ))}
            <option value="add_client">➕ Add Client</option>
          </select>
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
            value={Number(addNewSkuData.reference_number) || null}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 mt-6 border border-gray-200 rounded-lg">
        <div>
          <PlyToggle
            value={addNewSkuData?.ply}
            onChange={(selectedPly) => updateSkuValues(selectedPly)}
            errorMessage={errors.ply}
            editTag={true}
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimensions <span className="text-gray-500 text-xs">(W × L × H)</span>
              <span className="text-red-500 ml-1">*</span>
              {errors.width === 'Required' &&
                errors.length === 'Required' &&
                errors.height === 'Required' && (
                  <span className="text-red-500 text-xs ml-2 align-middle">Required</span>
                )}
            </label>

            <div className="h-8 w-[260px] border border-gray-300 rounded-md flex items-center bg-white">
              <input
                id="length"
                name="length"
                type="number"
                value={Number(addNewSkuData.length) || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                className="w-[60px] p-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-l-md"
              />
              <span className="text-gray-500 px-1">x</span>
              <input
                id="width"
                name="width"
                type="number"
                value={Number(addNewSkuData.width) || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                className="w-[60px] p-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-500 px-1">x</span>
              <input
                id="height"
                name="height"
                type="number"
                value={Number(addNewSkuData.height) || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                className="w-[60px] p-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="w-[70px] relative">
                <select
                  value={addNewSkuData.unit || 'mm'}
                  onChange={handleUnitChange}
                  className="w-full appearance-none bg-blue-600 text-white py-1 px-2 text-sm rounded-r-md hover:bg-blue-700 focus:outline-none"
                  title="Select unit of measurement"
                  disabled={editTag}
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-white">
                  <CIcon icon={cilChevronCircleDownAlt} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joints
                <span className="text-red-500 ml-1">*</span>
                {errors.joints && (
                  <span className="text-red-500 text-xs ml-2 align-middle">{errors.joints}</span>
                )}
              </label>
              <input
                id="joints"
                name="joints"
                value={Number(addNewSkuData.joints) || ''}
                onChange={handleChange}
                readOnly={editTag}
                className="w-full h-8 p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deckle Size
                <span className="text-red-500 ml-1">*</span>
                {errors.deckle_size && (
                  <span className="text-red-500 text-xs ml-2 align-middle">
                    {errors.deckle_size}
                  </span>
                )}
              </label>
              <input
                id="deckle_size"
                name="deckle_size"
                value={Number(toThreeDecimalFixed(addNewSkuData.deckle_size)) || ''}
                onChange={modifiedHandleChange}
                readOnly={editTag}
                className="w-full h-8 p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Deckle should be greater than (BW × UPS)
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
              {errors.flap_width && (
                <span className="text-red-500 text-sm ml-2 align-middle">{errors.flap_width}</span>
              )}
            </label>
            <input
              id="flap_width"
              name="flap_width"
              value={Number(addNewSkuData.flap_width) || null}
              onChange={modifiedHandleChange}
              readOnly={editTag}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Internal Id
            <span className="text-red-500 ml-1">*</span>
            {errors.internal_id && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.internal_id}</span>
            )}
          </label>
          <input
            id="internal_id"
            name="internal_id"
            value={Number(addNewSkuData.internal_id) || null}
            onChange={handleChange}
            readOnly={editTag}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board Size <span className="text-gray-500 text-xs">(W × L)</span>
              <span className="text-red-500 ml-1">*</span>
              {errors.width_board_size_cm2 && errors.length_board_size_cm2 && (
                <span className="text-red-500 text-xs ml-2 align-middle">
                  {errors.width_board_size_cm2}
                </span>
              )}
            </label>
            <div className="h-8 w-[200px] border border-gray-300 rounded-md flex items-center bg-white">
              <input
                id="width_board_size_cm2"
                name="width_board_size_cm2"
                value={Number(toThreeDecimalFixed(addNewSkuData.width_board_size_cm2)) || ''}
                onChange={modifiedHandleChange}
                className="w-[30%] p-[2px] text-center text-sm focus:outline-none rounded-l-md bg-gray-50"
                title={unitTooltip}
                readOnly
              />
              <span className="flex items-center justify-center text-gray-500 text-sm">x</span>
              <input
                id="length_board_size_cm2"
                name="length_board_size_cm2"
                value={Number(toThreeDecimalFixed(addNewSkuData.length_board_size_cm2)) || ''}
                onChange={modifiedHandleChange}
                className="w-[30%] p-[2px] text-center text-sm focus:outline-none bg-gray-50"
                title={unitTooltip}
                readOnly
              />
              <div className="w-[40%] flex justify-end relative">
                <select
                  value={addNewSkuData.unit || 'mm'}
                  onChange={handleUnitChange}
                  disabled={editTag}
                  className="w-full text-sm appearance-none bg-blue-600 text-white py-[6px] px-2 rounded-r-md hover:bg-blue-700 focus:outline-none"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <CIcon icon={cilChevronCircleDownAlt} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </Tooltip>

        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UPS
            <span className="text-red-500 ml-1">*</span>
            {errors.ups && (
              <span className="text-red-500 text-sm ml-2 align-middle">{errors.ups}</span>
            )}
          </label>
          <input
            id="ups"
            name="ups"
            value={Number(addNewSkuData?.ups) || null}
            onChange={modifiedHandleChange}
            readOnly={editTag}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length Trimming Tolereance
              <span className="text-red-500 ml-1">*</span>
              {errors.length_trimming_tolerance && (
                <span className="text-red-500 text-sm ml-2 align-middle">
                  {errors.length_trimming_tolerance}
                </span>
              )}
            </label>
            <input
              id="length_trimming_tolerance"
              name="length_trimming_tolerance"
              value={Number(addNewSkuData.length_trimming_tolerance) || null}
              onChange={modifiedHandleChange}
              readOnly={editTag}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width Trimming Tolereance
              <span className="text-red-500 ml-1">*</span>
              {errors.width_trimming_tolerance && (
                <span className="text-red-500 text-sm ml-2 align-middle">
                  {errors.width_trimming_tolerance}
                </span>
              )}
            </label>
            <input
              id="width_trimming_tolerance"
              name="width_trimming_tolerance"
              value={Number(addNewSkuData.width_trimming_tolerance) || null}
              onChange={modifiedHandleChange}
              readOnly={editTag}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <div className="w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Order Level
            <span className="text-red-500 ml-1">*</span>
            {errors.minimum_order_level && (
              <span className="text-red-500 text-sm ml-2 align-middle">
                {errors.minimum_order_level}
              </span>
            )}
          </label>
          <input
            id="minimum_order_level"
            name="minimum_order_level"
            type="number"
            value={Number(addNewSkuData.minimum_order_level) || null}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
