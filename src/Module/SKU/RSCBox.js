import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
//import { Tooltip } from "react-tooltip";
import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import CustomAlert from '../../components/New/CustomAlert';
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
  onMeterDataChange
}) {
    const [alerts, setAlerts] = useState([]);
  const filteredClient = locationvalue 
  ? client.find(client => client.client_id === locationvalue) 
  : null;
  const [unitTooltip, setUnitTooltip] = useState("Enter Millimeter");
  const [metricSign, setMetricsSign] = useState("mm");
  const [areaInM2, setAreaInM2] = useState(null);

const calculateBoardSize = (data) => {
  const length = parseFloat(data.length) || 0;
  const width = parseFloat(data.width) || 0;
  const height = parseFloat(data.height) || 0;
  const lengthTrimmingTolerance = parseFloat(data.length_trimming_tolerance) || 0;
  const widthTrimmingTolerance = parseFloat(data.width_trimming_tolerance) || 0;
  const upsval = parseFloat(data.ups) || 0;
  const flapWidth = parseFloat(data.flap_width) || 0;
  const deckleSize = parseFloat(data.deckle_size) || 0;

  //const lengthBoardSize = (length * width * 2 )+ lengthTrimmingTolerance + flapWidth
  //const widthBoardSize =( width * height) + widthTrimmingTolerance
  const lengthBoardSize = ((length + width) * 2 )+ lengthTrimmingTolerance + flapWidth
  const widthBoardSize =( width + height) + widthTrimmingTolerance
//  7.1 Length of the board (across glue lines) = ((Box Length + Box Width) X 2 ) + Flap + Trimming Tolerance length (default 20)
//7.2 Width of the board (along glue lines)= (Box Depth +Box Width) + Trimming Tolerance Width (default 20)
  const totalBoardSize = lengthBoardSize * widthBoardSize;
  const deckleSizeVal=widthBoardSize*upsval;

  if (deckleSize < deckleSizeVal) {
    return {
      length_board_size_cm2: lengthBoardSize.toFixed(2),
      width_board_size_cm2: widthBoardSize.toFixed(2),
      board_size_cm2: totalBoardSize.toFixed(2),
      deckle_size: deckleSizeVal.toFixed(2),
      ups: upsval.toFixed(),
      error: `Deckle size must be greater than or equal (${deckleSizeVal.toFixed(2)}).`,
    };
  }

  return {
    length_board_size_cm2: lengthBoardSize.toFixed(2),
    width_board_size_cm2: widthBoardSize.toFixed(2),
    board_size_cm2: totalBoardSize.toFixed(2),
    deckle_size:deckleSizeVal.toFixed(2),
    ups: upsval.toFixed(),
    error: "", // No error
  };
};


const MM_TO_INCH = 0.0393701;
const INCH_TO_MM = 25.4;
const MM_TO_CM = 0.1;
const CM_TO_MM = 10;
const INCH_TO_CM = 2.54;
const CM_TO_INCH = 1 / INCH_TO_CM;

const modifiedHandleChange = (e) => {
  setBoardSizeError("")
  setAlerts([]);

  const { name, value } = e.target;
  let updatedValue = parseFloat(value);

  
  if (!isNaN(updatedValue)) {
      if (addNewSkuData.unit === "mm") {
          updatedValue = parseFloat(updatedValue.toFixed(2));
      } else if (addNewSkuData.unit === "in") {
          updatedValue = parseFloat((updatedValue * INCH_TO_MM).toFixed(2)); // Store as mm
      } else if (addNewSkuData.unit === "cm") {
          updatedValue = parseFloat((updatedValue * CM_TO_MM).toFixed(2)); // Store as mm
      }
  }

  const updatedSkuData = { ...addNewSkuData, [name]: updatedValue };

  const boardSizeFields = [
      "length",
      "width",
      "height",
      "joints",
      "deckle_size",
      "length_trimming_tolerance",
      "width_trimming_tolerance",
      "ups",
      "flap_width",
      "length_board_size_cm2",
      "width_board_size_cm2",
      "board_size_cm2",
  ];

  if (boardSizeFields.includes(name)) {
      const boardSizeUpdates = calculateBoardSize(updatedSkuData);
      if (boardSizeUpdates.error) {
        // Show error to user
        console.error(boardSizeUpdates.error);
        // Optionally: toast(boardSizeUpdates.error) or setError(boardSizeUpdates.error)
        setAlerts([{ severity: "error", message: boardSizeUpdates.error}]);
        if (setBoardSizeError) {
          setBoardSizeError(boardSizeUpdates.error); // Pass error to parent
        }
//setTimeout(()=>{
//  setAlerts([])
//},3000)
      }
      setAddNewSkuData((prev) => ({
          ...prev,
          [name]: updatedValue,
          ...boardSizeUpdates,
      }));
  } else {
      setAddNewSkuData((prev) => ({
          ...prev,
          [name]: updatedValue,
      }));
  }

  if (handleChange) {
      handleChange(e);
  }
};


  // Handle Unit Change (Convert Both Dimensions & Board Size)
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnitTooltip(newUnit === "mm" ? "Enter Millimeter" : newUnit === "in" ? "Enter Inches" : "Enter Centimeter");
    setMetricsSign(newUnit === "mm" ? "mm" : newUnit === "in" ? "in" : "cm");

    setAddNewSkuData((prev) => {
        const convertValue = (val) => {
  // If val is empty, undefined, null, or not a number → skip conversion
  if (val === "" || val === null || typeof val === "undefined") return "";

  const parsed = parseFloat(val);
  if (isNaN(parsed)) return "";

  let valueInMM = parsed;

  // Step 1: Convert previous unit → mm
  if (prev.unit === "in") valueInMM = parsed * INCH_TO_MM;
  else if (prev.unit === "cm") valueInMM = parsed * CM_TO_MM;

  // Step 2: Convert mm → new unit
  if (newUnit === "in") return parseFloat((valueInMM * MM_TO_INCH).toFixed(2));
  if (newUnit === "cm") return parseFloat((valueInMM * MM_TO_CM).toFixed(2));
  
  // Default is mm
  return parseFloat(valueInMM.toFixed(2));
};


        const length_board_size_cm2 = convertValue(prev.length_board_size_cm2);
        const width_board_size_cm2 = convertValue(prev.width_board_size_cm2);

        return {
            ...prev,
            unit: newUnit,
            length: convertValue(prev.length),
            width: convertValue(prev.width),
            height: convertValue(prev.height),
            flap_width: convertValue(prev.flap_width),
            length_trimming_tolerance: convertValue(prev.length_trimming_tolerance),
            width_trimming_tolerance: convertValue(prev.width_trimming_tolerance),
            joints:convertValue(prev.joints),
            deckle_size:convertValue(prev.deckle_size),
            length_board_size_cm2,
            width_board_size_cm2,
            board_size_cm2: parseFloat((length_board_size_cm2 * width_board_size_cm2).toFixed(2)),
            ups: convertValue(prev.ups)
        };
    });
};

  //const modifiedHandleChange1 = (e) => {
  //  const { name, value } = e.target;
  //  setAddNewSkuData((prev) => ({
  //    ...prev,
  //    [name]: value,
  //  }));
  //};

const handleClose = () => {
  setAlerts([]);
};

//conversion for meter square
useEffect(() => {
  //if (!addNewSkuData?.board_size_cm2 || !metricSign) return;

  let area = addNewSkuData.board_size_cm2;
  let convertedArea;

  switch (metricSign) {
    case "mm":
      convertedArea = area / 1_000_000; // mm² to m²
      break;
    case "cm":
      convertedArea = area / 10_000; // cm² to m²
      break;
    case "in":
      convertedArea = area * 0.00064516; // in² to m²
      break;
    default:
      console.warn("Unknown metric sign:", metricSign);
      setAreaInM2(null);
      return;
  }


onMeterDataChange(convertedArea)
  setAreaInM2(convertedArea);
}, [addNewSkuData?.board_size_cm2, metricSign]);

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <label className="block text-[16px] font-medium">SKU Type1</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span>{addNewSkuData.sku_type || 'Select Type'}</span>
              <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <ul
                className={`absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-30`}
              >
                {skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-100">
                    <li className="p-2 cursor-pointer w-full" onClick={() => handleSelect(option)}>
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
          <label className="block text-[16px] font-medium mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData.ply}
            onChange={(e) => {
              const selectedPly = Number(e.target.value)
              updateSkuValues(selectedPly)
            }}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
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

        {/*<div>
          <label className="block text-[16px] font-medium mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData.client || ''}
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
        </div>*/}
        <div>
  <label className="block text-[16px] font-medium mb-2">Client Name</label>
  <select
    name="client"
    id="client"
    disabled={clientDiasble}
    value={filteredClient ? filteredClient.client_id : addNewSkuData.client || ''}
    onChange={handleChange}
    className="w-full p-2 shadow-md border-l-2 rounded-md"
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

<Tooltip title={unitTooltip}>
        <div className="">
          <p className="text-[16px] font-medium">Dimensions</p>
          <div className="h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">
            <input
              id="length"
              name="length"
              type='number'
              value={addNewSkuData.length}
              onChange={modifiedHandleChange}
              placeholder="Length"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
              //title={unitTooltip}
            ></input>{' '}
            x
            <input
              id="width"
              name="width"
              type='number'
              value={addNewSkuData.width}
              onChange={modifiedHandleChange}
              placeholder="Width"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
              //title={unitTooltip}
            ></input>{' '}
            x
            <input
              id="height"
              name="height"
              type='number'
              value={addNewSkuData.height}
              onChange={modifiedHandleChange}
              placeholder="Depth"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
              //title={unitTooltip}
            ></input>
            <div className="w-1/4 flex justify-end relative">
            <select
  value={addNewSkuData.unit || "mm"}
  onChange={handleUnitChange} 
  className="w-3/4 appearance-none bg-blue-500 text-white py-2 px-3 rounded-r-md focus:outline-none"
    title="Select unit of measurement"
>
  <option value="mm" className="bg-white text-black">mm</option>
  <option value="cm" className="bg-white text-black">cm</option>
  <option value="in" className="bg-white text-black">in</option>
</select>

              <div className="pointer-events-none absolute inset-y-1 right-0 flex items-center px-2 text-black">
                <CIcon icon={cilChevronCircleDownAlt} size="small" className="text-white" />
              </div>
            </div>
          </div>
        </div>
        </Tooltip>
<Tooltip title={unitTooltip}>
        <div className="flex gap-3">
          <Input
            skuName="Joints"
            id="joints"
            name="joints"
            value={addNewSkuData.joints}
            onChange={handleChange}
            placeholder="joints"
          />

          <Input
            skuName="Deckle Size"
            id="deckle_size"
            name="deckle_size"
            value={addNewSkuData.deckle_size}
            onChange={modifiedHandleChange}
            placeholder="deckle size"
          />
        </div>
        </Tooltip>
        <div>
          <label className="block text-[16px] font-medium mb-2">Inner/Outer Dimension</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Inner"
                checked={addNewSkuData.inner_outer_dimension === 'Inner'}
                onChange={handleChange}
                className="mr-2"
              />
              Inner
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Outer"
                checked={addNewSkuData.inner_outer_dimension === 'Outer'}
                onChange={handleChange}
                className="mr-2"
              />
              Outer
            </label>
          </div>
        </div>

        {/* <div className="flex gap-3"> */}
        <Tooltip title={unitTooltip}>
          <div>
          <Input
          skuName="Flap Width"
          id="flap_width"
          name="flap_width"
          value={addNewSkuData.flap_width}
          onChange={modifiedHandleChange}
          placeholder="flap width"
          //title={unitTooltip}
        />
          </div>
        </Tooltip>
   
        <Tooltip title={unitTooltip}>
          <div>
          <Input
          skuName="Length Trimming tolerance"
          id="length_trimming_tolerance"
          name="length_trimming_tolerance"
          value={addNewSkuData.length_trimming_tolerance}
          onChange={modifiedHandleChange}
          placeholder="trimming tolerance"
            // title={unitTooltip}
        />
          </div>
       
</Tooltip>

<Tooltip title={unitTooltip}>
          <div>
          <Input
          skuName="Width Trimming tolerance"
          id="width_trimming_tolerance"
          name="width_trimming_tolerance"
          value={addNewSkuData.width_trimming_tolerance}
          onChange={modifiedHandleChange}
          placeholder="Width Trimming Tolerance"
            // title={unitTooltip}
        />
          </div>
       
</Tooltip>

     
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          skuName="Customer Reference"
          id="customer_reference"
          name="customer_reference"
          value={addNewSkuData.customer_reference}
          onChange={handleChange}
          placeholder="customer reference"
        />
        <Input
          skuName="Reference #"
          id="reference_number"
          name="reference_number"
          value={addNewSkuData.reference_number}
          onChange={handleChange}
          placeholder="reference number"
        />
        <Input
          skuName="Internal ID"
          id="internal_id"
          name="internal_id"
          value={addNewSkuData.internal_id}
          onChange={handleChange}
          placeholder="internal id"
        />

<Tooltip title={unitTooltip}>
         <div className="">
  <p className="text-[16px] font-medium">Board Size</p>
  <div className="h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">
    <input
      id="width_board_size_cm2"
      name="width_board_size_cm2"
      value={addNewSkuData.width_board_size_cm2}
      onChange={modifiedHandleChange}
      placeholder="Width"
      className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
      title={unitTooltip}
      readOnly={true}
    /> 
    x
    <input
      id="length_board_size_cm2"
      name="length_board_size_cm2"
      value={addNewSkuData.length_board_size_cm2}
      onChange={modifiedHandleChange}
      placeholder="Length"
      className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
      title={unitTooltip}
      readOnly={true}
    /> 
    =
    <input
      id="board_size_cm2"
      name="board_size_cm2"
      value={addNewSkuData.board_size_cm2}
      onChange={modifiedHandleChange}
      placeholder="Total "
      readOnly={true}
      className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
    />
    
    <div className="w-1/4 flex justify-end relative">
      <select
        value={addNewSkuData.unit || "mm"}
        onChange={handleUnitChange} 
        className="w-3/4 appearance-none bg-blue-500 text-white py-2 px-3 rounded-r-md focus:outline-none"
      >
        <option value="mm" className="bg-white text-black">mm</option>
        <option value="cm" className="bg-white text-black">cm</option>
        <option value="in" className="bg-white text-black">in</option>
      </select>
      <div className="pointer-events-none absolute inset-y-1 right-0 flex items-center px-2 text-black">
        <CIcon icon={cilChevronCircleDownAlt} size="small" className="text-white" />
      </div>
    </div>
  </div>
</div>
</Tooltip>


        <Input
          skuName="UPS"
          id="ups"
          name="ups"
          value={addNewSkuData?.ups}
          onChange={modifiedHandleChange}
          //readOnly={true}
          placeholder="ups"
        />

        <Input
          skuName="Minimum Order Level"
          id="minimum_order_level"
          name="minimum_order_level"
          type="number"
          value={addNewSkuData.minimum_order_level}
          onChange={handleChange}
          placeholder="minimum order level"
        />
      </div>
    </>
  )
}

export default RSCBox
