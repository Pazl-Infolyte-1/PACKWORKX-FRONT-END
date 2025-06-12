import { useContext, useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { AuthContext } from '../../Context/AuthContext'
import RSCBox from './RSCBox'
import CorrugatedSheet from './CorrugatedSheet'
import DieCutBox from './DieCutBox'
import { FaEye } from 'react-icons/fa'
import PopUp from '../../components/New/PopUp'
import FluteTypeView from './FluteTypeView'
import Composite from './Composite'
import CustomItem from './CustomItem'
import { useDispatch } from 'react-redux'
import updown from '../../assets/images/updown.png'
import { version } from 'core-js'
import { setRscDeckleSize } from '../../action';
import { setSkuPartValue } from '../../action'
import { skuApi } from '../../api/sku'


function SkuAddEdit({
  isopenval,
  handleChange,
  strictAdherence,
  handleStrictAdherenceToggle,
  handleAddSkuSubmit,
  editTag,
  addNewSkuData,
  setAddNewSkuData,
  client,
  skuType,
  setSkuType,
  clientDiasble,
  refresh,
  locationvalue,
  setBoardSizeError,
  editedSkudata,
  handleClose,
  isSingleViewPopupForType,
  setisSingleViewPopupForType,
  setPopupOpen,
  isPopupOpen,
  message,
  setMessage,
  errors,
  setErrors,
  setSkuVariant,
     uploadedFiles,
          setUploadedFiles,
          validationErrors
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [meterSquareData, setMeterSquareData] = useState(null)
  const [compositeSelect, setCompositeSelect] = useState(null)
  const [isactivateRender, setIsActivateRender] = useState(false)
  const dispatch = useDispatch()
  const prevIsSingleViewRef = useRef(isSingleViewPopupForType)
  const [version, setVersion] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [defaultSkuValues, setDefaultSkuValues] = useState([])
  const [color,setColor]=useState([])
  const [fluteDropdown,setFluteDropdown]=useState([])
  const [rscUnits,setRscUnits] = useState("mm")
const [selectedFluteIndex, setSelectedFluteIndex] = useState(null);

console.log("data",rscUnits)
  const createInitialSkuData = () => ({
    client_id: null,
    sku_name: null,
    composite_type: null,
    ply: null,
    client: null,
    length: null,
    width: null,
    height: null,
    unit: null,
    joints: null,
    ups: null,
    inner_outer_dimension: 'Inner',
    flap_width: null,
    flap_tolerance: null,
    length_trimming_tolerance: 20,
    width_trimming_tolerance: 20,
    width_board_size_cm2: null,
    length_board_size_cm2: null,
    strict_adherence: strictAdherence,
    customer_reference: null,
    reference_number: null,
    internal_id: null,
    board_size_cm2: null,
    deckle_size: null,
    minimum_order_level: null,
    sku_type: 'RSC box',
    part_value: [],
    route: [],
    part_count: null,
    estimate_composite_item: null,
    description: null,
    default_sku_details: null,
    documents:[],
    print_type:null,
    tags: {},
    gst_percentage: null,
        total_weight:null,
total_bursting_strength:null,
    sku_values: [
      {
        layer_id:null,
        layer: null,
        gsm: null,
        bf: null,
        material: null,
        color: null,
        flute_type: null,
        weight: null,
        bursting_strength: null,
        layer_status:"ungrouped"
        //flute_ratio: null,
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (addNewSkuData?.id) {
          const response = await skuApi.getSkuVersions(addNewSkuData?.id)
          setVersion(response.data.data)
          // Set default values when editing
          setDefaultSkuValues(addNewSkuData.sku_values)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [addNewSkuData?.id])

  const handleMeterDataChange = (data) => {
    setMeterSquareData(data)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!editTag) {
      setAddNewSkuData(createInitialSkuData())
    }
  }, [editTag, refresh])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await skuApi.getSkuType()
        setSkuType(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])
  const handleSelect = (option) => {
dispatch(setRscDeckleSize({ length: null, height: null, ups: null }));

    dispatch({
      type: 'SET_SELECTED_ROUTE_IDS',
      payload: [],
    })
    dispatch({
      type: 'SET_DECKLE_SIZE',
      payload: {
        deckle_size: '',
        deckleError: '',
      },
    })
    dispatch({ type: 'RESET_DIECUT_CALCULATIONS' })
 
    setErrors({})
    if (option.value === 'addMore') {
      // Handle add more procedure logic if needed
      setIsOpen(false)
      return
    }
    setIsOpen(false)

    const baseSkuData = {
      ...createInitialSkuData(),
      client: addNewSkuData.client,
      sku_type: option.sku_type || option.value,
    }
    setSkuVariant(option.sku_type || option.value)
    setAddNewSkuData(baseSkuData)
  }
const calculateWeight = ({ gsm, isCorrugated, selectedFlute, areaInSquareMeters }) => {
  const numberOfFlutes = isCorrugated
    ? selectedFlute?.take_up_factor || 0
    : 1;

  if (!gsm || !areaInSquareMeters) return null;
console.log("values///",((gsm * areaInSquareMeters) * 0.001) * numberOfFlutes)
  return ((gsm * areaInSquareMeters) * 0.001) * numberOfFlutes;
};
const handleSkuValuesChange = (index, field, value) => {
  setAddNewSkuData((prevData) => {
    const updatedSkuValues = [...prevData.sku_values];
    const updatedItem = { ...updatedSkuValues[index], [field]: value };

    // Determine if layer is corrugated
    const isCorrugated = updatedItem.layer?.toLowerCase().includes('corrugated');


        if (field === 'flute_type') {
      updatedItem.flute_type = value;

      // Match the flute object by name
      const matchedFlute = fluteDropdown.find((flute) => flute.name === value);
      if (matchedFlute) {
        updatedItem.selected_flute = matchedFlute;
      }
    }

    // Store selectedFlute (or update if field was 'selected_flute')
    if (field === 'selected_flute') {
      updatedItem.selected_flute = value;
    }
    const selectedFlute = updatedItem.selected_flute;

    // Set default flute info if non-corrugated
    if (field === 'layer' && !isCorrugated) {
      updatedItem.flute_type = '--';
      updatedItem.selected_flute = { take_up_factor: 1 };
    }

    // Calculate area in square meters
    let areaInSquareMeters = 0;
    if (rscUnits === 'mm') areaInSquareMeters = meterSquareData * 1e-6;
    else if (rscUnits === 'cm') areaInSquareMeters = meterSquareData * 1e-4;
    else if (rscUnits === 'in') areaInSquareMeters = meterSquareData * 0.00064516;

    // Trigger weight recalculation
    if (['gsm', 'layer', 'selected_flute'].includes(field)) {
      updatedItem.weight = calculateWeight({
        gsm: field === 'gsm' ? value : updatedItem.gsm,
        isCorrugated,
        selectedFlute,
        areaInSquareMeters,
      });
    }

    
    updatedSkuValues[index] = updatedItem;
    return { ...prevData, sku_values: updatedSkuValues };
  });
};
useEffect(() => {
  // 1. First reset weights to ensure recalculation doesn't use stale data
  const resetWeights = addNewSkuData.sku_values.map((item) => ({
    ...item,
    weight: null,
  }));

  setAddNewSkuData((prevData) => ({
    ...prevData,
    sku_values: resetWeights,
  }));

  // 2. Now recalculate weights after a short delay to ensure reset completes
  // This avoids race condition with batched updates
  setTimeout(() => {
    let areaInSquareMeters = 0;
    if (rscUnits === 'mm') areaInSquareMeters = meterSquareData * 1e-6;
    else if (rscUnits === 'cm') areaInSquareMeters = meterSquareData * 1e-4;
    else if (rscUnits === 'in') areaInSquareMeters = meterSquareData * 0.00064516;

    const updatedSkuValues = addNewSkuData.sku_values.map((item) => {
      const isCorrugated = item.layer?.toLowerCase().includes('corrugated');
      const selectedFlute = item.selected_flute;

      return {
        ...item,
        weight: calculateWeight({
          gsm: item.gsm,
          isCorrugated,
          selectedFlute,
          areaInSquareMeters,
        }),
        ...(isCorrugated
          ? {}
          : {
              flute_type: "--",
              selected_flute: { take_up_factor: 1 },
            }),
      };
    });

    setAddNewSkuData((prevData) => ({
      ...prevData,
      sku_values: updatedSkuValues,
    }));
  }, 0); // Runs after reset
}, [
  addNewSkuData.length,
  addNewSkuData.width,
  addNewSkuData.height,
  rscUnits,
  addNewSkuData.width_board_size_cm2,
  addNewSkuData.length_board_size_cm2,
  meterSquareData,
  JSON.stringify(
    addNewSkuData.sku_values.map(
      (item) => item.selected_flute?.take_up_factor || 0
    )
  ),
]);


  //for updating the gsm calculations when dimension changes
  useEffect(() => {
    setAddNewSkuData((prevData) => {
      const updatedSkuValues = prevData.sku_values.map((item) => {
        if (item.gsm) {
          return {
            ...item,
            weight: item.gsm * meterSquareData,
          }
        }
        return item
      })
      return { ...prevData, sku_values: updatedSkuValues }
    })
  }, [meterSquareData])

  const plyLayerConfigurations = {
    2: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped" },
      { layer_id:2,layer: 'Corrugated Layer', type: 'Corrugated Layer',layer_status:"ungrouped" },
    ],
    3: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped" },
    ],
    5: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped" },
      { layer_id:4,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2',layer_status:"ungrouped" },
      { layer_id:5,layer: 'Liner Layer 2', type: 'Liner Layer 2',layer_status:"ungrouped" },
    ],
    7: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped" },
      { layer_id:4,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2',layer_status:"ungrouped" },
      { layer_id:5,layer: 'Liner Layer 2', type: 'Liner Layer 2',layer_status:"ungrouped" },
      { layer_id:6,layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3',layer_status:"ungrouped" },
      { layer_id:7,layer: 'Liner Layer 3', type: 'Liner Layer 3',layer_status:"ungrouped" },
    ],
    9: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped" },
      { layer_id:4,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2',layer_status:"ungrouped" },
      { layer_id:5,layer: 'Liner Layer 2', type: 'Liner Layer 2',layer_status:"ungrouped" },
      { layer_id:6,layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3',layer_status:"ungrouped" },
      { layer_id:7,layer: 'Liner Layer 3', type: 'Liner Layer 3',layer_status:"ungrouped" },
      { layer_id:8,layer: 'Corrugated Layer 4', type: 'Corrugated Layer 4',layer_status:"ungrouped" },
      { layer_id:9,layer: 'Liner Layer 4', type: 'Liner Layer 4',layer_status:"ungrouped" },
    ],
  }

  const updateSkuValues = (plyCount) => {
    const layerConfig = plyLayerConfigurations[plyCount] || []

    const newSkuValues = layerConfig.map((layer) => ({
      layer_id:layer.layer_id,
      layer: layer.layer,
      gsm: '',
      bf: '',
      material: '',
      color: '',
      flute_type: layer.layer.toLowerCase().includes('corrugated') ? '' : 'N/A',
      weight: '',
      bursting_strength: '',
      //flute_ratio: '',
      layer_status:layer.layer_status
    }))

    setAddNewSkuData((prevData) => ({
      ...prevData,
      ply: plyCount,
      sku_values: newSkuValues,
    }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.ply
      return newErrors
    })
  }

  const toThreeDecimalFixed = (value) => {
    if (value === null || value === undefined || value === '') return ''
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return ''
    if (Number.isInteger(numValue)) {
      return numValue.toString()
    }
    return parseFloat(numValue.toFixed(3)).toString()
  }

  const skuComponents = {
    'RSC box': (
      <RSCBox
         uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          rscUnits={rscUnits}
      setRscUnits={setRscUnits}
        isopenval={isopenval}
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
        locationvalue={locationvalue}
        //onUnitChange={handleUnitChange}
        setBoardSizeError={setBoardSizeError}
        onMeterDataChange={handleMeterDataChange}
        editTag={editTag}
        toThreeDecimalFixed={toThreeDecimalFixed}
        compositeSelect={compositeSelect}
        //for client fropdown create popup
        setPopupOpen={setPopupOpen}
        isPopupOpen={isPopupOpen}
        message={message}
        setMessage={setMessage}
        errors={errors}
        setErrors={setErrors}
      />
    ),
    //'Corrugated Sheet': (
    Board: (
      <CorrugatedSheet
        onMeterDataChange={handleMeterDataChange}
            setRscUnits={setRscUnits}
        uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        isopenval={isopenval}
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
        editTag={editTag}
        compositeSelect={compositeSelect}
        //for client fropdown create popup
        setPopupOpen={setPopupOpen}
        isPopupOpen={isPopupOpen}
        message={message}
        setMessage={setMessage}
        errors={errors}
        setErrors={setErrors}
      />
    ),
    'Die Cut box': (
      <DieCutBox
             onMeterDataChange={handleMeterDataChange}
        setRscUnits={setRscUnits}
              uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        isopenval={isopenval}
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
        editTag={editTag}
        compositeSelect={compositeSelect}
        //for client fropdown create popup
        setPopupOpen={setPopupOpen}
        isPopupOpen={isPopupOpen}
        message={message}
        setMessage={setMessage}
        errors={errors}
        setErrors={setErrors}
      />
    ),
    Composite: (
      <Composite
      validationErrors={validationErrors}
        isopenval={isopenval}
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
        editedSkudata={editedSkudata}
        editTag={editTag}
        setCompositeSelect={setCompositeSelect}
        isSingleViewPopupForType={isSingleViewPopupForType}
        isactivateRender={isactivateRender}
        //for client fropdown create popup
        setPopupOpen={setPopupOpen}
        isPopupOpen={isPopupOpen}
        message={message}
        setMessage={setMessage}
        errors={errors}
        setErrors={setErrors}
      />
    ),
    'Custom Item': (
      <CustomItem
        isopenval={isopenval}
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
        editedSkudata={editedSkudata}
        editTag={editTag}
        compositeSelect={compositeSelect}
        //for client fropdown create popup
        setPopupOpen={setPopupOpen}
        isPopupOpen={isPopupOpen}
        message={message}
        setMessage={setMessage}
        errors={errors}
      />
    ),
  }
  const openViewCard = (data) => {
    setisSingleViewPopup(true)
  }

  const handleCloseSingleViewPopup = () => {
    setisSingleViewPopup(false)
  }


  const handleCancel = () => {
  dispatch(setSkuPartValue([]))
    setAddNewSkuData(createInitialSkuData())
    handleClose()
  }
  const handleCancelPopup = () => {
    //setAddNewSkuData(createInitialSkuData())
    //handleClose()
    setisSingleViewPopup(false)
  }
  useEffect(() => {
    if (compositeSelect) {
      setisSingleViewPopupForType(true)
      //setIsCompositePopupCreate(true)
    } else {
      //setIsCompositePopupCreate(false)
      setisSingleViewPopupForType(false)
      setCompositeSelect(null)
    }
  }, [compositeSelect])

  useEffect(() => {
    if (!isSingleViewPopupForType) {
      setAddNewSkuData(createInitialSkuData())
      setCompositeSelect(null)
    }
  }, [isSingleViewPopupForType])
  useEffect(() => {
    if (isSingleViewPopupForType || !isSingleViewPopupForType) {
      dispatch({
        type: 'SET_SELECTED_ROUTE_IDS',
        payload: [],
      })
    }
    setErrors({})
  }, [isSingleViewPopupForType])

  useEffect(() => {
    if (prevIsSingleViewRef.current && !isSingleViewPopupForType) {
      // transitioned from true to false
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_type: 'Composite',
      }))
    }
    setIsActivateRender(true)
    // Update the ref after checking
    prevIsSingleViewRef.current = isSingleViewPopupForType
  }, [isSingleViewPopupForType])

  useEffect(() => {
      const updatedSkuValues = addNewSkuData.sku_values.map((item) => {
    const { gsm, bf, selected_flute, layer } = item;

    if (gsm && bf) {
      const isCorrugated = layer?.toLowerCase().includes('corrugated');

      // Choose divisor based on corrugated status
      const divisor = isCorrugated ? 2000 : 1000;

      const calculatedBS = Number(((gsm * bf) / divisor).toFixed(3));
      console.log("calculated bursting strength:", calculatedBS);

      // Only update if the calculated bursting strength is different
      if (item.bursting_strength !== calculatedBS) {
        return { ...item, bursting_strength: calculatedBS };
      }
    }

    return item;
  });
    const hasChanged = updatedSkuValues.some(
      (item, index) => item.bursting_strength !== addNewSkuData.sku_values[index].bursting_strength,
    )

    if (hasChanged) {
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_values: updatedSkuValues,
      }))
    }
  }, [JSON.stringify(addNewSkuData.sku_values)])
  const handleAutofillRow = (currentIndex) => {
    if (currentIndex === 0) return

    const previousRow = addNewSkuData.sku_values[currentIndex - 1]
    const updatedRow = { ...addNewSkuData.sku_values[currentIndex] }

    // Copy selected fields
    const fieldsToCopy = ['gsm', 'bf', 'color', 'material', 'weight', 'bursting_strength']
    fieldsToCopy.forEach((field) => {
      updatedRow[field] = previousRow[field]
    })

    const updatedSkuValues = [...addNewSkuData.sku_values]
    updatedSkuValues[currentIndex] = updatedRow

    setAddNewSkuData((prev) => ({
      ...prev,
      sku_values: updatedSkuValues,
    }))
  }
  useEffect(() => {
    if (addNewSkuData?.sku_values && !editTag) {
      setDefaultSkuValues(addNewSkuData.sku_values)
    }
  }, [addNewSkuData?.sku_values, editTag])

  const handleVersionSelect = async (e) => {
    const selectedValue = e.target.value

    if (selectedValue === 'default') {
      setSelectedVersion(null)
      // Reset to the original values from the API response
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_values: defaultSkuValues.map((item) => ({
          layer: item.layer,
          gsm: item.gsm,
          bf: item.bf,
          material: item.material,
          color: item.color,
          flute_type: item.flute_type,
          weight: item.weight,
          bursting_strength: item.bursting_strength,
        })),
      }))
      return
    }

    if (!selectedValue) {
      setSelectedVersion(null)
      return
    }

    const selected = version.find((v) => v.sku_version === selectedValue)
    setSelectedVersion(selected)

    if (selected) {
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_values: selected.sku_values.map((item) => ({
          layer: item.layer,
          gsm: item.gsm,
          bf: item.bf,
          material: item.material,
          color: item.color,
          flute_type: item.flute_type,
          weight: item.weight,
          bursting_strength: item.bursting_strength,
        })),
      }))
    }
  }

useEffect(() => {
  const colorData = async () => {
    try {
      const response = await apiMethods.getColors();
      setColor(response.data.data); // ✅ use response.data.data
      console.log("color data", response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  colorData();
}, []);

console.log("shared unitr form rsc",rscUnits)
console.log("composite",compositeSelect)
console.log("sku values...",JSON.stringify(addNewSkuData.sku_values))
useEffect(() => {
  const totalWeight = addNewSkuData.sku_values.reduce(
    (acc, item) => acc + (Number(item.weight) || 0),
    0
  )

  const totalBurstingStrength = addNewSkuData.sku_values.reduce(
    (acc, item) => acc + ((item.gsm && item.bf) ? (item.gsm * item.bf) / 1000 : 0),
    0
  )

  setAddNewSkuData((prevData) => ({
    ...prevData,
    total_weight: Math.round(totalWeight * 1000) / 1000,
    total_bursting_strength: Math.round(totalBurstingStrength * 1000) / 1000,
  }))
}, [addNewSkuData.sku_values])

  useEffect(() => {
    fetchFluteList()
  }, [])

  const fetchFluteList = async () => {
    try {
      const response = await apiMethods.getFluteType()
      setFluteDropdown(response.data.data)
      console.log("flute",response.data.data)
      console.log("flute type",JSON.stringify(response.data.data))
    } catch (error) {
      console.error(error)
    }
  }


const handleFluteSelection = (selectedFlute, fluteIndex) => {
  console.log("selected flute",selectedFlute)
  if (fluteIndex !== null) {
    handleSkuValuesChange(fluteIndex, 'flute_type', selectedFlute.name);
    handleSkuValuesChange(fluteIndex, 'selected_flute', selectedFlute);
    setSelectedFluteIndex(null);
    setisSingleViewPopup(false);
  }
};

console.log("addnedwskudata unit",rscUnits)
console.log("add sku data",addNewSkuData.client)
console.log("add sku data",addNewSkuData.client_id)

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* conditional rendring according to sku_type */}
      {skuComponents[addNewSkuData.sku_type] || null}

      {addNewSkuData.sku_type !== 'Custom Item' && addNewSkuData.sku_type !== 'Composite' && (
        <div className="flex items-center gap-5">
          <div className="flex items-center my-3 space-x-2">
            <span className="text-[14px] font-medium">Strict Adherence for All Layers</span>
            <button
              className={`w-11 h-[23px] flex items-center border border-blue-600 rounded-full p-1 cursor-pointer 
              ${strictAdherence ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={!editTag && handleStrictAdherenceToggle}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out 
                ${strictAdherence ? 'translate-x-5' : '-translate-x-[2px]'}`}
              ></div>
            </button>
          </div>
          {editTag && (
            <select
              onChange={handleVersionSelect}
              value={selectedVersion?.sku_version || ''}
              className="h-8 px-3 text-[14px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option hidden value="">
                Select Version
              </option>
              <option value="default">Default Version</option>
              {version.length > 0 ? (
                version.map((item) => (
                  <option key={item.sku_version} value={item.sku_version}>
                    {item.sku_version}
                  </option>
                ))
              ) : (
                <option disabled>No Version Available</option>
              )}
            </select>
          )}
        </div>
      )}

      {addNewSkuData.ply && addNewSkuData.sku_type !== 'Custom Item' && (
        <div className="mt-6 mb-6">
          <div className="border rounded-lg overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-gray-500 text-center">
                  <th className="p-2">Layer</th>
                  <th className="p-2">GSM</th>
                  <th className="p-2">BF</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Flute Type</th>
                  {/*<th className="p-2">Flute Ratio</th>*/}
                  <th className="p-2">Mills</th>
                  <th className="p-2">Weight (Kg)</th>
                  <th className="p-2">
                    Bursting Strength <br />{' '}
                    <span className="text-xs">
                      (Kg Per Cm<sup>2</sup>
                    </span>
                    )
                  </th>
                </tr>
              </thead>
              <tbody>
                {addNewSkuData?.sku_values?.map((item, index) => (
                  <tr key={index} className="flex-wrap">
                    <td className="p-2 text-center w-full sm:w-2/12 md:w-2/12 lg:w-2/12">
                      <div className="relative w-full">
                        <input
                          type="text"
                          placeholder="Layers"
                          className="p-1 pr-8 border rounded w-full bg-gray-100 cursor-not-allowed"
                          value={item.layer}
                          onChange={(e) => handleSkuValuesChange(index, 'layer', e.target.value)}
                          readOnly="true"

                        />
                        <img
                          src={updown}
                          alt="Autofill from above"
                          title="Autofill from above"
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            index === 0
                              ? 'opacity-50 cursor-not-allowed pointer-events-none'
                              : 'cursor-pointer hover:opacity-80'
                          }`}
                          onClick={() => index !== 0 && handleAutofillRow(index)}
                        />
                      </div>
                    </td>

                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                    <input
  type="number"
  className={`p-1 rounded text-center w-full transition-colors ${
    errors.sku_values?.[index]?.gsm
      ? 'border-2 border-red-500'
      : 'border border-gray-300'
  }`}
  value={item.gsm || ''}
  placeholder="gsm"
  onChange={(e) =>
    handleSkuValuesChange(index, 'gsm', Number(e.target.value))
  }
  readOnly={editTag}
/>

                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="number"
                      className={`p-1 rounded text-center w-full transition-colors ${
    errors.sku_values?.[index]?.bf
      ? 'border-2 border-red-500'
      : 'border border-gray-300'
  }`}
                        value={item.bf || ''}
                        placeholder="bf"
                        onChange={(e) => handleSkuValuesChange(index, 'bf', Number(e.target.value))}
                        readOnly={editTag}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
<select
     className={`p-1 rounded w-full transition-colors ${
      errors.sku_values?.[index]?.color
        ? 'border-2 border-red-500'
        : 'border border-gray-300'
    }`}
  value={item.color}
  onChange={(e) => handleSkuValuesChange(index, 'color', e.target.value)}
  disabled={editTag} // use disabled for select instead of readOnly
>
  <option value="">Select Color</option>
  {color.map((c) => (
    <option key={c.id} value={c.color_name}>
      {c.color_name}
    </option>
  ))}
</select>

                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
                      {item?.layer?.toLowerCase().includes('corrugated') ? (
                        <div className="relative w-full flex items-center">
                          <select
                              className={`p-1 rounded w-full pr-8 appearance-none transition-colors ${
          errors.sku_values?.[index]?.flute_type
            ? 'border-2 border-red-500'
            : 'border border-gray-300'
        }`}
                            value={item.flute_type}
                            onChange={(e) =>
                              handleSkuValuesChange(index, 'flute_type', e.target.value)
                            }
                            disabled={editTag}
                          >
                            <option hidden>Select</option>
  {fluteDropdown.map((flute) => (
    <option key={flute.id} value={flute.name}>
      {flute.name}
    </option>
  ))}
                          </select>
                          <FaEye
                            className="absolute right-2 text-gray-500 cursor-pointer"
                           onClick={() => {
    setSelectedFluteIndex(index);
    setisSingleViewPopup(true);
  }}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500">--</p>
                      )}


                    </td>

                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="text"
                        placeholder="Mills"
                        className="p-1 border rounded w-full"
                        value={item.material}
                        onChange={(e) => handleSkuValuesChange(index, 'material', e.target.value)}
                        readOnly={editTag}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <p>{toThreeDecimalFixed(item.weight) || 'N/A'}</p>
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <p>{Math.round(item.bursting_strength)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}
{addNewSkuData.ply && addNewSkuData.sku_type !== 'Custom Item' && (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4 mt-4 mb-6">
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Weight:{' '}
 {addNewSkuData.total_weight}
    </p>
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Bursting Strength:{' '}
{addNewSkuData.total_bursting_strength}
    </p>
  </div>
)}


      {/*{addNewSkuData.ply && addNewSkuData.sku_type !== 'Custom Item' && (
        <tr className="bg-gray-100 font-semibold text-center">
          <td colSpan={6} className="p-2 text-right">
            Total Weight:
          </td>
          <td className="p-2 text-center">
            {toThreeDecimalFixed(
              addNewSkuData.sku_values?.reduce((acc, item) => acc + (Number(item.weight) || 0), 0),
            )}
          </td>
          <td></td> 
        </tr>
      )}*/}

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t pt-4 pb-6 px-4 flex justify-end space-x-4 z-20">
{/*<button   className="p-1.5 border border-gray-300 rounded w-20 text-sm" onClick={handleCancel}>
  Cancel
</button>

  <ActionButton
    onClick={handleAddSkuSubmit}
    label={editTag ? 'Update' : 'Submit'}
    variant="save"
    className="bg-[#079b54] text-white px-1 py-1 rounded-md"
  />*/}
        <button
            className="p-1.5 border border-gray-300 rounded w-20 text-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
     <button
            className="p-1.5 rounded w-20 mr-3 text-white bg-purple-600 hover:bg-purple-700 text-sm disabled:bg-gray-400"
      onClick={handleAddSkuSubmit}
          >
           {editTag ? 'Update' : 'Submit'}
          </button>

  
</div>

      <PopUp
        visible={isSingleViewPopup}
        setVisible={handleCloseSingleViewPopup}
        showCloseButton={true}
        width={'50vw'}
        header={'Add Flute'}
      >
 <FluteTypeView
    onSelect={(selectedFlute) =>
      handleFluteSelection(selectedFlute, selectedFluteIndex)
    }
  />
      </PopUp>

      <PopUp
        header="Selected SKU"
        visible={isSingleViewPopupForType}
        setVisible={setisSingleViewPopupForType}
        showCloseButton={true}
        width="80vw"
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {skuComponents[compositeSelect] || (
            <div className="text-gray-500">No view available for this SKU type</div>
          )}

          {/* Strict Adherence Toggle */}
          {compositeSelect !== 'Custom Item' && (
            <div className="flex gap-5">
              <div className="flex items-center my-3 space-x-2">
                <span className="text-[14px] font-medium">Strict Adherence for All Layers</span>
                <button
                  className={`w-11 h-[23px] flex items-center border border-blue-600 rounded-full p-1 cursor-pointer 
            ${strictAdherence ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={handleStrictAdherenceToggle}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out 
              ${strictAdherence ? 'translate-x-5' : '-translate-x-[2px]'}`}
                  ></div>
                </button>
              </div>
            </div>
          )}
          {/* SKU Values Table */}
          {addNewSkuData.ply && compositeSelect !== 'Custom Item' && (
            <div className="mt-6">
              <div className="border rounded-lg overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr className="text-gray-500 text-center">
                      <th className="p-2">Layer</th>
                      <th className="p-2">GSM</th>
                      <th className="p-2">BF</th>
                      <th className="p-2">Color</th>
                      <th className="p-2">Flute Type</th>
                      <th className="p-2">Mill</th>
                      <th className="p-2">Weight (Kg)</th>
                      <th className="p-2">
                        Bursting Strength <br />
                        <span className="text-xs">
                          (Kg Per Cm<sup>2</sup>)
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {addNewSkuData?.sku_values?.map((item, index) => (
                      <tr key={index} className="flex-wrap">
                        <td className="p-2 text-center w-full sm:w-2/12">
                          <input
                            type="text"
                            placeholder="Layers"
                            className="p-1 border rounded w-full"
                            value={item.layer}
                            onChange={(e) => handleSkuValuesChange(index, 'layer', e.target.value)}
                            readOnly="true"
                          />
                        </td>
                        <td className="p-2 text-center w-full sm:w-1/12">
                          <input
                            type="number"
                            className="p-1 border rounded text-center w-full"
                            value={item.gsm || ''}
                            placeholder="gsm"
                            onChange={(e) =>
                              handleSkuValuesChange(index, 'gsm', Number(e.target.value))
                            }
                          />
                        </td>
                        <td className="p-2 text-center w-full sm:w-1/12">
                          <input
                            type="number"
                            className="p-1 border rounded text-center w-full"
                            value={item.bf || ''}
                            placeholder="bf"
                            onChange={(e) =>
                              handleSkuValuesChange(index, 'bf', Number(e.target.value))
                            }
                          />
                        </td>
                     <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
<select
     className={`p-1 rounded w-full transition-colors ${
      errors.sku_values?.[index]?.color
        ? 'border-2 border-red-500'
        : 'border border-gray-300'
    }`}
  value={item.color}
  onChange={(e) => handleSkuValuesChange(index, 'color', e.target.value)}
  disabled={editTag} // use disabled for select instead of readOnly
>
  <option value="">Select Color</option>
  {color.map((c) => (
    <option key={c.id} value={c.color_name}>
      {c.color_name}
    </option>
  ))}
</select>

                    </td>
                        <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
                      {item?.layer?.toLowerCase().includes('corrugated') ? (
                        <div className="relative w-full flex items-center">
                          <select
                              className={`p-1 rounded w-full pr-8 appearance-none transition-colors ${
          errors.sku_values?.[index]?.flute_type
            ? 'border-2 border-red-500'
            : 'border border-gray-300'
        }`}
                            value={item.flute_type}
                            onChange={(e) =>
                              handleSkuValuesChange(index, 'flute_type', e.target.value)
                            }
                            disabled={editTag}
                          >
                            <option hidden>Select</option>
  {fluteDropdown.map((flute) => (
    <option key={flute.id} value={flute.name}>
      {flute.name}
    </option>
  ))}
                          </select>
                          <FaEye
                            className="absolute right-2 text-gray-500 cursor-pointer"
                           onClick={() => {
    setSelectedFluteIndex(index);
    setisSingleViewPopup(true);
  }}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500">--</p>
                      )}


                    </td>
                        <td className="p-2 text-center w-full sm:w-1/12">
                          <input
                            type="text"
                            placeholder="Mill"
                            className="p-1 border rounded w-full"
                            value={item.material}
                            onChange={(e) =>
                              handleSkuValuesChange(index, 'material', e.target.value)
                            }
                          />
                        </td>
 <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <p>{toThreeDecimalFixed(item.weight) || 'N/A'}</p>
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <p>{Math.round(item.bursting_strength)}</p>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {addNewSkuData.ply && addNewSkuData.sku_type !== 'Custom Item' && (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4 mt-4 mb-6">
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Weight:{' '}
 {addNewSkuData.total_weight}
    </p>
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Bursting Strength:{' '}
{addNewSkuData.total_bursting_strength}
    </p>
  </div>
)}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="p-2 border border-gray-300 rounded w-24"
              onClick={() => {
                setisSingleViewPopupForType(false)
                // setIsCompositePopupCreate(false)
                setCompositeSelect(null)
                setAddNewSkuData(createInitialSkuData())
                
              }}
            >
              Cancel
            </button>
            <ActionButton
              onClick={handleAddSkuSubmit}
              label={editTag ? 'Update' : 'Submit'}
              variant="save"
              className="bg-[#079b54] text-white px-4 py-2 rounded-md"
            />
          </div>
        </div>
      </PopUp>
    </div>
  )
}

export default SkuAddEdit
