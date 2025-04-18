import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import CustomAlert from '../../components/New/CustomAlert'
import PlyToggle from '../../components/New/PlyToggle'

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
  toThreeDecimalFixed,
  isopenval
}) {
  const [alerts, setAlerts] = useState([])
  const filteredClient = locationvalue
    ? client.find((client) => client.client_id === locationvalue)
    : null
  const [unitTooltip, setUnitTooltip] = useState('Enter Millimeter')
  const [metricSign, setMetricsSign] = useState('mm')
  const [areaInM2, setAreaInM2] = useState(null)
  const [boarderr, setBoardErr] = useState(null)


  const handleClose = () => {
    setAlerts([])
  }

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
    const convertValue = (value, fromUnit, toUnit) => {
      if (fromUnit === toUnit) return value;
    
      // Convert input value to mm first
      let valueInMm = value;
      switch (fromUnit) {
        case 'cm':
          valueInMm = value * 10;
          break;
        case 'in':
          valueInMm = value * 25.4;
          break;
        case 'mm':
        default:
          break;
      }
    
      // Convert from mm to desired unit
      switch (toUnit) {
        case 'cm':
          return valueInMm / 10;
        case 'in':
          return valueInMm / 25.4;
        case 'mm':
        default:
          return valueInMm;
      }
    };
    const handleUnitChange = (e) => {
      const newUnit = e.target.value;
      let tooltipMessage = '';
      switch (newUnit) {
        case 'cm':
          tooltipMessage = 'Enter Centimeter';
          break;
        case 'in':
          tooltipMessage = 'Enter Inches';
          break;
        case 'mm':
        default:
          tooltipMessage = 'Enter Millimeter';
          break;
      }
      setAddNewSkuData((prevData) => {
        const currentUnit = prevData.unit || 'mm';
    
        const widthConverted = convertValue(prevData.width_board_size_cm2, currentUnit, newUnit);
        const lengthConverted = convertValue(prevData.length_board_size_cm2, currentUnit, newUnit);
        const jointsConverted = convertValue(prevData.joints, currentUnit, newUnit);
        const upsConverted = convertValue(prevData.ups, currentUnit, newUnit);
        const flapwidthConverted = convertValue(prevData.flap_width, currentUnit, newUnit);
        const flapToleranceConverted = convertValue(prevData.flap_tolerance, currentUnit, newUnit);
        const lengthTrimmingToleranceConverted = convertValue(prevData.length_trimming_tolerance, currentUnit, newUnit);
        const decklesizeConverted = convertValue(prevData.deckle_size, currentUnit, newUnit);

    
        return {
          ...prevData,
          unit: newUnit,
          width_board_size_cm2: parseFloat(widthConverted.toFixed(2)),
          length_board_size_cm2: parseFloat(lengthConverted.toFixed(2)),
          joints:parseFloat(jointsConverted.toFixed(2)),
          ups:parseFloat(upsConverted.toFixed(2)),
          flap_width:parseFloat(flapwidthConverted.toFixed(2)),
          flap_tolerance:parseFloat(flapToleranceConverted.toFixed(2)),
          length_trimming_tolerance:parseFloat(lengthTrimmingToleranceConverted.toFixed(2)),
          deckle_size:parseFloat(decklesizeConverted.toFixed(2)),
        };
      });

      setUnitTooltip(tooltipMessage);

    };
        
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
            value={filteredClient ? filteredClient.client_id : addNewSkuData.client || ''}
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
      <div className="w-full flex justify-end mt-4">
  <div className="flex items-center space-x-2">
    <label className="text-sm text-gray-700 font-medium">Select Units:</label>
    <div className="relative w-28">
      <select
        value={addNewSkuData.unit || 'mm'}
        onChange={handleUnitChange}
        className="w-full appearance-none bg-gray-700 text-white py-1.5 px-2 pr-7 rounded-md text-sm hover:bg-gray-400 transition-colors focus:outline-none"
      >
        <option value="mm" className="bg-white text-gray-800">mm</option>
        <option value="cm" className="bg-white text-gray-800">cm</option>
        <option value="in" className="bg-white text-gray-800">in</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-white">
        <CIcon icon={cilChevronCircleDownAlt} size="sm" />
      </div>
    </div>
  </div>
</div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
        {/*<div>
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
        </div>*/}
        
               <PlyToggle
  value={addNewSkuData.ply}
  onChange={(selectedPly) => updateSkuValues(selectedPly)}
/>

        <Tooltip title={unitTooltip}>
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">Joints</label>
            <input
              id="joints"
              name="joints"
              type='number'
              value={addNewSkuData.joints}
              onChange={handleChange}
              //placeholder="Joints"
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
              type='number'
              value={addNewSkuData.ups}
              onChange={handleChange}
              //placeholder="UPS"
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
              type='number'
              //placeholder="Flap Width"
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
              type='number'
              //placeholder="Flap Tolerance"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Trimming Tolerance</label>
          <input
              id="length_trimming_tolerance"
              name="length_trimming_tolerance"
              value={addNewSkuData.length_trimming_tolerance}
              onChange={handleChange}
              type='number'
              //placeholder="Flap Width"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
        </div>
        </Tooltip>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Customer Reference</label>
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
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Reference #</label>
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
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Internal ID</label>
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
          {/*<div>
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
          </div>*/}

          <div>
                      <p className="block text-[16px] font-medium text-gray-700 mb-2">Board Size<span className="text-gray-500 text-sm">(W × L)</span></p>
                      <div className="h-10 border border-gray-300 rounded-md flex items-center bg-white">
                        <input
                          id="width_board_size_cm2"
                          name="width_board_size_cm2"
                          value={addNewSkuData.width_board_size_cm2}
                          onChange={handleChange}
                          type='number'
                          //placeholder="Width"
                          className="w-1/3 p-1 text-center focus:outline-none rounded-l-md bg-gray-50"
                          //title={unitTooltip}
                          //readOnly={true}
                        />
                        <span className="flex items-center justify-center text-gray-500">x</span>
                        <input
                          id="length_board_size_cm2"
                          name="length_board_size_cm2"
                          value={addNewSkuData.length_board_size_cm2}
                          onChange={handleChange}
                          type='number'
                          //placeholder="Length"
                          className="w-1/3 p-1 text-center focus:outline-none bg-gray-50"
                          //title={unitTooltip}
                          //readOnly={true}
                        />
                        {/*<div className="w-1/3 flex justify-end relative">
                          <select
                            value={addNewSkuData.unit || 'mm'}
                            className="w-full appearance-none bg-blue-600 text-white py-2 px-3 rounded-r-md hover:bg-blue-700 transition-colors focus:outline-none"
                          >
                            <option value="mm" className="bg-white text-gray-800">mm</option>
                            <option value="cm" className="bg-white text-gray-800">cm</option>
                            <option value="in" className="bg-white text-gray-800">in</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                            <CIcon icon={cilChevronCircleDownAlt} size="sm" />
                          </div>
                        </div>*/}
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
              type='number'
              //placeholder="Deckle Size"
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
            //placeholder="Minimum Order Level"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>


      </div>
    </div>
  )
}

export default CorrugatedSheet