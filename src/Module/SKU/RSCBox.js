import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import CustomAlert from '../../components/New/CustomAlert'
import PlyToggle from '../../components/New/PlyToggle'

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
  compositeSelect
}) {
  const [alerts, setAlerts] = useState([])
  const filteredClient = locationvalue
    ? client.find((client) => client.client_id === locationvalue)
    : null
  const [unitTooltip, setUnitTooltip] = useState('Enter Millimeter')
  const [metricSign, setMetricsSign] = useState('mm')
  const [areaInM2, setAreaInM2] = useState(null)
  const [boarderr, setBoardErr] = useState(null)
  const [isRscOpen, setIsRscOpen] = useState(true)
const [previousSkuType, setPreviousSkuType] = useState(null);

  const calculateBoardSize = (data) => {
    const length = parseFloat(data.length) || 0
    const width = parseFloat(data.width) || 0
    const height = parseFloat(data.height) || 0
    const lengthTrimmingTolerance = parseFloat(data.length_trimming_tolerance) || 0
    const widthTrimmingTolerance = parseFloat(data.width_trimming_tolerance) || 0
    const upsval = parseFloat(data.ups) || 0
    const flapWidth = parseFloat(data.flap_width) || 0

    const lengthBoardSize = (length + width) * 2 + lengthTrimmingTolerance + flapWidth
    const widthBoardSize = width + height + widthTrimmingTolerance
    const totalBoardSize = lengthBoardSize * widthBoardSize
    const deckleSizeVal = widthBoardSize * upsval
    const EPSILON = 0.001
    const deckleSize = parseFloat(data.deckle_size) || deckleSizeVal

    if (deckleSize + EPSILON <= deckleSizeVal) {
      // throw error only if clearly smaller, allowing minor float diff
      return {
        length_board_size_cm2: lengthBoardSize.toFixed(2),
        width_board_size_cm2: widthBoardSize.toFixed(2),
        board_size_cm2: totalBoardSize.toFixed(2),
        deckle_size: deckleSizeVal,
        ups: upsval.toFixed(),
        error: `Deckle size must be greater than or equal to ${deckleSizeVal.toFixed(2)}.`,
      }
    }
    

    return {
      length_board_size_cm2: lengthBoardSize.toFixed(2),
      width_board_size_cm2: widthBoardSize.toFixed(2),
      board_size_cm2: totalBoardSize.toFixed(2),
      deckle_size: deckleSize,
      ups: upsval.toFixed(),
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
        length: convertValue(prev.length),
        width: convertValue(prev.width),
        height: convertValue(prev.height),
        flap_width: convertValue(prev.flap_width),
        length_trimming_tolerance: convertValue(prev.length_trimming_tolerance),
        width_trimming_tolerance: convertValue(prev.width_trimming_tolerance),
        joints: convertValue(prev.joints),
        deckle_size: convertValue(prev.deckle_size),
        length_board_size_cm2,
        width_board_size_cm2,
        board_size_cm2: parseFloat((length_board_size_cm2 * width_board_size_cm2).toFixed(2)),
        ups: convertValue(prev.ups),
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

console.log("is open",isopenval)
console.log("area in m2",areaInM2)
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

useEffect(() => {
  if (compositeSelect) {
    setAddNewSkuData((prev) => ({
      ...prev,
      sku_type: compositeSelect,
    }));
  }
}, [compositeSelect]);

  return (
    <div className="rounded-lg ">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      
      {/* Top header fields */}
      <div className="grid grid-cols-3 gap-6 p-6 border border-gray-200 rounded-lg">
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">SKU Type</label>
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
                {/*{skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-50">
                    <li
                      className={`p-2 cursor-pointer w-full ${editTag ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}`}
                      onClick={!editTag ? () => handleSelect(option) : undefined}
                    >
                      {option.sku_type}
                    </li>
                  </div>
                ))}*/}
          {skuType.map((option) => (
  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-50">
    <li
      className={`p-2 w-full cursor-pointer
        ${
          compositeSelect || editTag
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-800'
        }
        ${compositeSelect === option.sku_type ? 'bg-gray-200 font-semibold' : ''}`
      }
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

 <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">SKU Name</label>
            <input
              id="sku_name"
              name="sku_name"
              value={addNewSkuData?.sku_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={filteredClient ? filteredClient.client_id : addNewSkuData?.client || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
      <div>
  <PlyToggle
  value={addNewSkuData?.ply}
  onChange={(selectedPly) => updateSkuValues(selectedPly)}
/>
</div>


        <Tooltip title={unitTooltip}>
          <div>
          <p className="block text-[16px] font-medium text-gray-700 mb-2">
  Dimensions <span className="text-gray-500 text-sm after:content-['*'] after:text-red-500 after:ml-1">(L × W × H)</span>
</p>          
  <div className="h-10 border border-gray-300 rounded-md flex items-center bg-white">
              <input
                id="length"
                name="length"
                type="number"
                value={addNewSkuData.length}
                onChange={modifiedHandleChange}
                //placeholder="Length"
                className="w-1/4 p-1 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-l-md"
              />
              <span className="flex items-center justify-center text-gray-500">x</span>
              <input
                id="width"
                name="width"
                type="number"
                value={addNewSkuData.width}
                onChange={modifiedHandleChange}
                //placeholder="Width"
                className="w-1/4 p-1 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="flex items-center justify-center text-gray-500">x</span>
              <input
                id="height"
                name="height"
                type="number"
                value={addNewSkuData.height}
                onChange={modifiedHandleChange}
                //placeholder="Depth"
                className="w-1/4 p-1 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="w-1/4 flex justify-end relative">
                <select
                  value={addNewSkuData.unit || 'mm'}
                  onChange={handleUnitChange}
                  className="w-full appearance-none bg-blue-600 text-white py-2 px-3 rounded-r-md hover:bg-blue-700 transition-colors focus:outline-none"
                  title="Select unit of measurement"
                >
                  <option value="mm" className="bg-white text-gray-800">mm</option>
                  <option value="cm" className="bg-white text-gray-800">cm</option>
                  <option value="in" className="bg-white text-gray-800">in</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <CIcon icon={cilChevronCircleDownAlt} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </Tooltip>
        
        <Tooltip title={unitTooltip}>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Joints</label>
              <input
                id="joints"
                name="joints"
                value={addNewSkuData.joints}
                onChange={handleChange}
                //placeholder="Joints"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Deckle Size</label>
              <input
                id="deckle_size"
                name="deckle_size"
                value={toThreeDecimalFixed(addNewSkuData.deckle_size)}
                onChange={modifiedHandleChange}
                //placeholder="Deckle Size"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </Tooltip>
        
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Inner/Outer Dimension</label>
          <div className="flex space-x-4 p-2 border border-gray-300 rounded-md h-10 items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Inner"
                checked={addNewSkuData.inner_outer_dimension === 'Inner'}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">Inner</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Outer"
                checked={addNewSkuData.inner_outer_dimension === 'Outer'}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">Outer</span>
            </label>
          </div>
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Flap Width</label>
            <input
              id="flap_width"
              name="flap_width"
              value={addNewSkuData.flap_width}
              onChange={modifiedHandleChange}
              //placeholder="Flap Width"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Length Trimming Tolerance</label>
            <input
              id="length_trimming_tolerance"
              name="length_trimming_tolerance"
              value={addNewSkuData.length_trimming_tolerance}
              onChange={modifiedHandleChange}
              //placeholder="Length Trimming Tolerance"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Width Trimming Tolerance</label>
            <input
              id="width_trimming_tolerance"
              name="width_trimming_tolerance"
              value={addNewSkuData.width_trimming_tolerance}
              onChange={modifiedHandleChange}
              //placeholder="Width Trimming Tolerance"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>
        
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Customer Reference</label>
          <input
            id="customer_reference"
            name="customer_reference"
            value={addNewSkuData.customer_reference}
            onChange={handleChange}
            //placeholder="Customer Reference"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Reference #</label>
          <input
            id="reference_number"
            name="reference_number"
            value={addNewSkuData.reference_number}
            onChange={handleChange}
            //placeholder="Reference Number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Internal ID</label>
          <input
            id="internal_id"
            name="internal_id"
            value={addNewSkuData.internal_id}
            onChange={handleChange}
            //placeholder="Internal ID"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <p className="block text-[16px] font-medium text-gray-700 mb-2">Board Size<span className="text-gray-500 text-sm after:content-['*'] after:text-red-500 after:ml-1">(W × L)</span></p>
            <div className="h-10 border border-gray-300 rounded-md flex items-center bg-white">
              <input
                id="width_board_size_cm2"
                name="width_board_size_cm2"
                value={toThreeDecimalFixed(addNewSkuData.width_board_size_cm2)}
                onChange={modifiedHandleChange}
                //placeholder="Width"
                className="w-1/3 p-1 text-center focus:outline-none rounded-l-md bg-gray-50"
                title={unitTooltip}
                readOnly={true}
              />
              <span className="flex items-center justify-center text-gray-500">x</span>
              <input
                id="length_board_size_cm2"
                name="length_board_size_cm2"
                value={toThreeDecimalFixed(addNewSkuData.length_board_size_cm2)}
                onChange={modifiedHandleChange}
                //placeholder="Length"
                className="w-1/3 p-1 text-center focus:outline-none bg-gray-50"
                title={unitTooltip}
                readOnly={true}
              />
              <div className="w-1/3 flex justify-end relative">
                <select
                  value={addNewSkuData.unit || 'mm'}
                  onChange={handleUnitChange}
                  className="w-full appearance-none bg-blue-600 text-white py-2 px-3 rounded-r-md hover:bg-blue-700 transition-colors focus:outline-none"
                >
                  <option value="mm" className="bg-white text-gray-800">mm</option>
                  <option value="cm" className="bg-white text-gray-800">cm</option>
                  <option value="in" className="bg-white text-gray-800">in</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <CIcon icon={cilChevronCircleDownAlt} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </Tooltip>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">UPS</label>
          <input
            id="ups"
            name="ups"
            value={addNewSkuData?.ups}
            onChange={modifiedHandleChange}
            //placeholder="UPS"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Minimum Order Level</label>
          <input
            id="minimum_order_level"
            name="minimum_order_level"
            type="number"
            value={addNewSkuData.minimum_order_level}
            onChange={handleChange}
            //placeholder="Minimum Order Level"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}

export default RSCBox