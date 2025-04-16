import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import CustomAlert from '../../components/New/CustomAlert'

function CorrugatedSheet({
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
  locationvalue,
  onUnitChange,
  setBoardSizeError,
  onMeterDataChange,
  toThreeDecimalFixed
}) {
  const [alerts, setAlerts] = useState([])
  const filteredClient = locationvalue
    ? client.find((client) => client.client_id === locationvalue)
    : null
  const [unitTooltip, setUnitTooltip] = useState('Enter Millimeter')
  const [metricSign, setMetricsSign] = useState('mm')
  const [areaInM2, setAreaInM2] = useState(null)
  const [boarderr, setBoardErr] = useState(null)

  const MM_TO_INCH = 0.0393701
  const INCH_TO_MM = 25.4
  const MM_TO_CM = 0.1
  const CM_TO_MM = 10
  const INCH_TO_CM = 2.54
  const CM_TO_INCH = 1 / INCH_TO_CM

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

      return {
        ...prev,
        unit: newUnit,
        joints: convertValue(prev.joints),
        flap_width: convertValue(prev.flap_width),
        flap_tolerance: convertValue(prev.flap_tolerance),
        deckle_size: convertValue(prev.deckle_size),
        ups: convertValue(prev.ups),
      }
    })

    if (onUnitChange) {
      onUnitChange(e)
    }
  }

  const handleClose = () => {
    setAlerts([])
  }

  useEffect(() => {
    if (addNewSkuData?.board_size_cm2 && onMeterDataChange) {
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
    }
  }, [addNewSkuData?.board_size_cm2, metricSign])

  return (
    <div className="rounded-lg">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      
      {/* Top header fields */}
      <div className="grid grid-cols-3 gap-6 p-6 border border-gray-200 rounded-lg">
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 h-10 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-blue-500 transition-colors"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="text-gray-800">{addNewSkuData.sku_type || 'Select Type'}</span>
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
          value={addNewSkuData.sku_name}
          onChange={handleChange}
          placeholder="SKU Name"
        />

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={filteredClient ? filteredClient.client_id : addNewSkuData.client || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select Client
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.client_id}>
                {item.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData.ply}
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
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">Joints</label>
            <input
              id="joints"
              name="joints"
              value={addNewSkuData.joints}
              onChange={handleChange}
              placeholder="Joints"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">UPS</label>
            <input
              id="ups"
              name="ups"
              value={addNewSkuData.ups}
              onChange={handleChange}
              placeholder="UPS"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">Flap Width</label>
            <input
              id="flap_width"
              name="flap_width"
              value={addNewSkuData.flap_width}
              onChange={handleChange}
              placeholder="Flap Width"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">Flap Tolerance</label>
            <input
              id="flap_tolerance"
              name="flap_tolerance"
              value={addNewSkuData.flap_tolerance}
              onChange={handleChange}
              placeholder="Flap Tolerance"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Trimming Tolerance</label>
          <select
            name="length_trimming_tolerance"
            id="length_trimming_tolerance"
            value={addNewSkuData.length_trimming_tolerance}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>Select</option>
            <option value="0.2">0.2</option>
            <option value="0.1">0.1</option>
          </select>
        </div>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Customer Reference</label>
          <input
            id="customer_reference"
            name="customer_reference"
            value={addNewSkuData.customer_reference}
            onChange={handleChange}
            placeholder="Customer Reference"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Reference #</label>
          <input
            id="reference_number"
            name="reference_number"
            value={addNewSkuData.reference_number}
            onChange={handleChange}
            placeholder="Reference Number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Internal ID</label>
          <input
            id="internal_id"
            name="internal_id"
            value={addNewSkuData.internal_id}
            onChange={handleChange}
            placeholder="Internal ID"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">Board Size (cm²)</label>
            <div className="relative">
              <input
                id="board_size_cm2"
                name="board_size_cm2"
                value={toThreeDecimalFixed ? toThreeDecimalFixed(addNewSkuData.board_size_cm2) : addNewSkuData.board_size_cm2}
                onChange={handleChange}
                placeholder="Board Size"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500">{metricSign}²</span>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">Deckle Size</label>
            <input
              id="deckle_size"
              name="deckle_size"
              value={toThreeDecimalFixed ? toThreeDecimalFixed(addNewSkuData.deckle_size) : addNewSkuData.deckle_size}
              onChange={handleChange}
              placeholder="Deckle Size"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Minimum Order Level</label>
          <input
            id="minimum_order_level"
            name="minimum_order_level"
            type="number"
            value={addNewSkuData.minimum_order_level}
            onChange={handleChange}
            placeholder="Minimum Order Level"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>


      </div>
    </div>
  )
}

export default CorrugatedSheet