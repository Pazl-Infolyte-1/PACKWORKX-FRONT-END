import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import CustomAlert from '../../components/New/CustomAlert'
import PlyToggle from '../../components/New/PlyToggle'
import SelectionCards from '../../components/New/SelectionCards'
import PopUp from '../../components/New/PopUp'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import ClientForm from '../Client/ClientForm'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import { useDispatch, useSelector } from 'react-redux'
import RoutePopup from './RoutePopup'
import apiMethods from '../../api/config'



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
  isopenval,
  compositeSelect,
  setPopupOpen,
  isPopupOpen,
  message,
  setMessage,
  errors,
  setErrors
}) {
  const [alerts, setAlerts] = useState([])
  const filteredClient = locationvalue
    ? client.find((client) => client.client_id === locationvalue)
    : null
  const [unitTooltip, setUnitTooltip] = useState('Enter Millimeter')
  const [metricSign, setMetricsSign] = useState('mm')
  const [areaInM2, setAreaInM2] = useState(null)
  const [boarderr, setBoardErr] = useState(null)
  const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [entityType, setEntityType] = useState('') // State to hold entity_type
  const [submitFromRsc, setSubmitFromRsc] = useState(true)
  const dispatch = useDispatch()
  const [displayAsChips,setDisplayAsChips] = useState([])
  const [isSingleViewPopupRoute, setisSingleViewPopupRoute] = useState(false)
  const [fullRouteResponse, setFullRouteResponse] = useState(null);
  const [deckleError, setDeckleError] = useState('');



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
        
    useEffect(() => {
      if (compositeSelect) {
        setAddNewSkuData((prev) => ({
          ...prev,
          sku_type: compositeSelect,
        }));
      }
    }, [compositeSelect]);
    


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
    console.log(`Selected ID: ${optionValue}`)

    if (optionValue === 2) {
      setEntityType('Client')
      setPopupOpen(false)
      setDrawerOpen(true)
    } else if (optionValue === 1) {
      setEntityType('Vendor')
      setPopupOpen(false)
      setDrawerOpen(true)
    } else {
      console.log('option not selected')
    }
  }

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, []) // Runs once on mount

    const handleKeyDown = (event) => {
      if (!isPopupOpen) {
        return; // Disable arrow key functionality if the popup is not open
      }
      if (event.key === 'ArrowRight') {
        handleSelectAction('client')
        setEntityType('Client') // Update state
      } else if (event.key === 'ArrowLeft') {
        handleSelectAction('vendor')
        setEntityType('Vendor') // Update state
      } else if (event.key === 'Enter') {
        console.log('Enter Pressed: Executing Selection')
        setTriggerSelection(true) // Mark that Enter was pressed
      }
    }
  
    console.log("jjjj",message)

    useEffect(() => {
      if (message) {
        setAlerts([{ severity: 'success', message }]);
    
        const timer = setTimeout(() => {
          setAlerts([]); // Clear alerts after 3 seconds
        }, 3000);
    
        return () => clearTimeout(timer); // Cleanup on unmount or message change
      }
    }, [message]);
    
//functionality for route chip
 useEffect(() => {
      const fetchRoutes = async () => {
        const params = {
          search: '',
          page: 1,
          limit: 10000,
        };
    
        try {
          const response = await apiMethods.getRouteList(params);
          console.log('Full API Response:', response);
          setFullRouteResponse(response); // ✅ Save full response here
          setDisplayAsChips(response.data.routes)
        } catch (err) {
          console.error('Error fetching routes:', err);
        }
      };
    
      fetchRoutes();
    }, []);
    

const selectedRouteIds1 = useSelector((state) => state.routeprocess.selectedRouteIds || []);

useEffect(() => {
  if (editTag && typeof addNewSkuData?.route === 'string') {
    try {
      const parsedRoutes = JSON.parse(addNewSkuData.route);
      if (Array.isArray(parsedRoutes) && parsedRoutes.length > 0) {
        dispatch({
          type: 'SET_SELECTED_ROUTE_IDS',
          payload: parsedRoutes,
        });

        setAddNewSkuData((prevData) => ({
          ...prevData,
          route: parsedRoutes, // ✅ use parsedRoutes instead of selectedRouteIds1
        }));
      }
    } catch (err) {
      console.error('Invalid route format:', addNewSkuData.route);
    }
  }
}, [editTag, addNewSkuData?.route, dispatch]);



// Optional: track Redux changes
useEffect(() => {
  console.log("Redux -> routeprocess.selectedRouteIds:", selectedRouteIds1);
}, [selectedRouteIds1]);

const selectedChips = displayAsChips.filter((item) =>
  selectedRouteIds1.includes(item.id)
);

const chipNames = selectedChips.map((chip) => chip.route_name).join(', ');

useEffect(() => {
  if (!editTag) {
    setAddNewSkuData((prevData) => ({
      ...prevData,
      route: selectedRouteIds1,
    }));
  }
}, [selectedRouteIds1, editTag]);


const handleRemoveChip = (idToRemove) => {
  console.log("Removing chip with id:", idToRemove);

  const updated = selectedRouteIds1.filter((id) => id !== idToRemove);
  console.log("update", updated);

  dispatch({
    type: 'SET_SELECTED_ROUTE_IDS',
    payload: updated,
  });
};
useEffect(() => {
  setAddNewSkuData((prevData) => ({
    ...prevData,
    route: selectedRouteIds1,
  }));
}, [selectedRouteIds1]);
const handleBrowseClickRoute = () => {
  setisSingleViewPopupRoute(true)
}
//useEffect(() => {
//  const boardWidth = Number(addNewSkuData.width_board_size_cm2);
//  const ups = Number(addNewSkuData.ups);
//  const deckleSize = Number(addNewSkuData.deckle_size);
//  const minDeckleSize = boardWidth * ups;

//  if (!isNaN(deckleSize) && !isNaN(minDeckleSize)) {
//    if (deckleSize < minDeckleSize) {
//      dispatch({
//        type: 'SET_DECKLE_SIZE',
//        payload: {
//          deckle_size: minDeckleSize,
//          deckleError: `Deckle size must be greater than or equal to ${minDeckleSize}`,
//        },
//      });
//    } else {
//      dispatch({
//        type: 'SET_DECKLE_SIZE',
//        payload: {
//          deckle_size: deckleSize,
//          deckleError: '',
//        },
//      });
//    }
//  }
//}, [
//  addNewSkuData.width_board_size_cm2,
//  addNewSkuData.ups,
//  addNewSkuData.deckle_size,
//  dispatch,
//]);
//const boardCalculations = useSelector(state => state.boardCalculations);
//useEffect(() => {
//  if (boardCalculations.deckle_size) {
//    setAddNewSkuData((prev) => ({
//      ...prev,
//      deckle_size: boardCalculations.deckle_size,
//    }));
//  }
//}, [boardCalculations.deckle_size]);


//useEffect(()=>{
//  if(editTag && addNewSkuData )
//  setAddNewSkuData((prev) => ({
//    ...prev,
//    width_board_size_cm2: Number(addNewSkuData.width_board_size_cm2),
//    length_board_size_cm2: Number(addNewSkuData.length_board_size_cm2),

//  }));
//},[editTag,addNewSkuData.width_board_size_cm2,addNewSkuData.length_board_size_cm2])
useEffect(() => {
  const { length_board_size_cm2, width_board_size_cm2, ups } = addNewSkuData || {};

  if (length_board_size_cm2 && width_board_size_cm2 && ups) {
    dispatch({
      type: 'SET_DIECUT_DECKLE_SIZE',
      payload: {
        lengthBoard: length_board_size_cm2,
        widthBoard: width_board_size_cm2,
        ups: ups,
      },
    });
  }
}, [addNewSkuData, dispatch]);

const diecutCalculations = useSelector((state) => state.diecutCalculations);

useEffect(() => {
  console.log('diecutCalculations:', diecutCalculations);
}, [diecutCalculations]);

useEffect(() => {
  console.log('Width Board:', diecutCalculations.widthBoard);
  console.log('Length Board:', diecutCalculations.lengthBoard);
  console.log('UPS:', diecutCalculations.ups);
  console.log('Deckle Size:', diecutCalculations.deckle_size);
  console.log('calculatedMin Size:', diecutCalculations.calculatedMin);
}, [diecutCalculations.widthBoard, diecutCalculations.lengthBoard, diecutCalculations.ups, diecutCalculations.deckle_size]);

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
    });
  }
}, [addNewSkuData, dispatch]); // This runs when `addNewSkuData` changes

useEffect(() => {
  if (diecutCalculations.calculatedMin) {
    setAddNewSkuData((prev) => ({
      ...prev,
      deckle_size: diecutCalculations.calculatedMin,
    }));
  }
}, [diecutCalculations.calculatedMin]);

useEffect(() => {
  if (addNewSkuData.flap_tolerance === "") {
    setAddNewSkuData((prev) => {
      // Only update if it's not already null
      if (prev.flap_tolerance !== null) {
        return { ...prev, flap_tolerance: null };
      }
      return prev; // No update needed
    });
  }
}, [addNewSkuData.flap_tolerance]);

const selectedRouteIds2 = useSelector(
  (state) => state.routeprocess?.selectedRouteIds || []
);

useEffect(() => {
  console.log('Selected Route IDs in comp:', selectedRouteIds2);

  if (selectedRouteIds2.length > 0) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.route;
      return newErrors;
    });
  }
}, [selectedRouteIds2]);


  return (
    <div className="rounded-lg">
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
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
    SKU Name
    <span className="text-red-500 ml-1">*</span>
    {errors.sku_name && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
    )}
  </label>
            <input
              id="sku_name"
              name="sku_name"
              value={addNewSkuData.sku_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

        <div>
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
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
            //value={filteredClient ? filteredClient.client_id : addNewSkuData.client || ''}
            value={addNewSkuData.client_id || null}
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
  errorMessage={errors.ply}
/>

        <Tooltip title={unitTooltip}>
          <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
    Joints
    <span className="text-red-500 ml-1">*</span>
    {errors.joints && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.joints}</span>
    )}
  </label>
            <input
              id="joints"
              name="joints"
              type='number'
                     min="0"
              value={addNewSkuData.joints}
              onChange={handleChange}
              //placeholder="Joints"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
    UPS
    <span className="text-red-500 ml-1">*</span>
    {errors.ups && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.ups}</span>
    )}
  </label>
            <input
              id="ups"
              name="ups"
              type='number'
              value={addNewSkuData.ups}
                     min="0"
              onChange={handleChange}
              //placeholder="UPS"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
    Flap Width
    <span className="text-red-500 ml-1">*</span>
    {errors.flap_width && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.flap_width}</span>
    )}
  </label>
            <input
              id="flap_width"
              name="flap_width"
              value={addNewSkuData.flap_width}
                     min="0"
              onChange={handleChange}
              type='number'
              //placeholder="Flap Width"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
          <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
    Flap Tolerance
    <span className="text-red-500 ml-1">*</span>
    {errors.flap_tolerance && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.flap_tolerance}</span>
    )}
  </label>
            <input
              id="flap_tolerance"
              name="flap_tolerance"
              value={addNewSkuData.flap_tolerance ?? ""}
              //value={Number(addNewSkuData.flap_tolerance)}
              onChange={handleChange}
                     min="0"
              type='number'
              //placeholder="Flap Tolerance"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </Tooltip>

        <Tooltip title={unitTooltip}>
        <div>
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
    Trimming Tolereance
    <span className="text-red-500 ml-1">*</span>
    {errors.length_trimming_tolerance && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.length_trimming_tolerance}</span>
    )}
  </label>
          <input
              id="length_trimming_tolerance"
              name="length_trimming_tolerance"
              value={addNewSkuData.length_trimming_tolerance}
              onChange={handleChange}
                     min="0"
              type='number'
              //placeholder="Flap Width"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
        </div>
        </Tooltip>

        <div>
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
   Customer Reference
    <span className="text-red-500 ml-1">*</span>
    {errors.customer_reference && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.customer_reference}</span>
    )}
  </label>
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
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
   Reference #
    <span className="text-red-500 ml-1">*</span>
    {errors.reference_number && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.reference_number}</span>
    )}
  </label>
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
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
  Internal Id
    <span className="text-red-500 ml-1">*</span>
    {errors.internal_id && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.internal_id}</span>
    )}
  </label>
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
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
        Board Size <span className="text-gray-500 text-sm">(W × L)</span>
    <span className="text-red-500 ml-1">*</span>
    {errors.width_board_size_cm2 && errors.length_board_size_cm2 &&(
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.width_board_size_cm2}</span>
    )}
        {/*{errors.length_board_size_cm2 && (
      <span className="text-red-500 text-sm ml-2 align-middle">Length is {errors.length_board_size_cm2}</span>
    )}*/}
  </label>
                      <div className="h-10 border border-gray-300 rounded-md flex items-center bg-white">
                        <input
                          id="width_board_size_cm2"
                          name="width_board_size_cm2"
                          value={addNewSkuData.width_board_size_cm2 ||null}
                          onChange={handleChange}
                          type='number'
                          //placeholder="Width"
                          className="w-1/2 p-1 text-center focus:outline-none rounded-l-md bg-gray-50"
                          min="0"
                          //title={unitTooltip}
                          //readOnly={true}
                        />
                        <span className="flex items-center justify-center text-gray-500">x</span>
                        <input
                          id="length_board_size_cm2"
                          name="length_board_size_cm2"
                          value={addNewSkuData.length_board_size_cm2 ||null}
                          onChange={handleChange}
                          type='number'
                          //placeholder="Length"
                          className="w-1/2 p-1 text-center focus:outline-none bg-gray-50"
                                 min="0"
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
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
        Deckle Size
    <span className="text-red-500 ml-1">*</span>
    {errors.deckle_size && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.deckle_size}</span>
    )}
  </label>  
  <input
  id="deckle_size"
  name="deckle_size"
  type="number"
  value={addNewSkuData.deckle_size}
         min="0"
  onChange={handleChange}
  className={`w-full p-2 border rounded-md focus:ring-2 transition-colors ${
    diecutCalculations.deckleError ? 'border-red-500 ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  }`}
/>
{diecutCalculations.deckleError && (
  <p className="mt-1 text-sm text-red-600">{diecutCalculations.deckleError}</p>
)}
</div>

        </Tooltip>

        <div>
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
        Minimum Order Level
    <span className="text-red-500 ml-1">*</span>
    {errors.minimum_order_level && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.minimum_order_level}</span>
    )}
  </label>  
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


<ChipSelectorWithBrowse
  label="Route"
  required={true}
  selectedIds={selectedRouteIds1}
  allOptions={displayAsChips}
  onRemoveChip={handleRemoveChip}
  onBrowseClick={handleBrowseClickRoute}
  errors={errors}
/>


      </div>

      {/*client create drop down option popup*/}
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
                        height={"700px"}
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
        <RoutePopup  editTag={editTag} addNewSkuData={addNewSkuData}   fullRouteResponse={fullRouteResponse} setisSingleViewPopupRoute={setisSingleViewPopupRoute} />
      </PopUp>


    </div>
  )
}

export default CorrugatedSheet