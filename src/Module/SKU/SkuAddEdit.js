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
import { useDispatch, useSelector } from 'react-redux'
import updown from '../../assets/images/updown.png'
import { version } from 'core-js'
import { setRscDeckleSize } from '../../action';
import { setSkuPartValue } from '../../action'
import { skuApi } from '../../api/sku'
import { commonApi } from '../../api/common'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
//import { saveSkuFormState } from '../../action'
import { clientApi } from '../../api/client'


function SkuAddEdit({
  isopenval,
  //handleChange,
  //strictAdherence,
  //handleStrictAdherenceToggle,
  //handleAddSkuSubmit,
  //editTag,
  //addNewSkuData,
  //setAddNewSkuData,
  //client,
  //skuType,
  //setSkuType,
  //clientDiasble,
  refresh,
  locationvalue,
  //setBoardSizeError,
  //editedSkudata,
  handleClose,
  //isSingleViewPopupForType,
  //setisSingleViewPopupForType,
  //setPopupOpen,
  //isPopupOpen,
  //message,
  //setMessage,
  //errors,
  //setErrors,
  //setSkuVariant,
    // uploadedFiles,
          //setUploadedFiles,
          //validationErrors
}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const skuFormData = useSelector((state) => state.skuForm)
             const deckleSize = useSelector((state) => state.deckleSize)
     
  //    const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(skuFormData.isSingleViewPopupForType || {})
  //      const [client, setClient] = useState(skuFormData.client || null)
  //const [uploadedFiles, setUploadedFiles] = useState(skuFormData.uploadedFiles || [])
  //const [addNewSkuData, setAddNewSkuData] = useState(skuFormData.addNewSkuData || {})
  //const [strictAdherence, setStrictAdherence] = useState(skuFormData.strictAdherence || false)
  //const [skuType, setSkuType] = useState(skuFormData.skuType || null)
  //const [message, setMessage] = useState(skuFormData.message || '')
  //const [errors, setErrors] = useState(skuFormData.errors || {})
  const [isOpen, setIsOpen] = useState(false)
    const [alerts, setAlerts] = useState([])
      const [validationErrors, setValidationErrors] = useState({})
  
      const [editTag, setEditTag] = useState(false)
    
  
    const [skuVariant, setSkuVariant] = useState('RSC Box')
  
  const dropdownRef = useRef(null)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [meterSquareData, setMeterSquareData] = useState(null)
  const [compositeSelect, setCompositeSelect] = useState(null)
  const [isactivateRender, setIsActivateRender] = useState(false)
  const [boardSizeError, setBoardSizeError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([]); // file URLs
  const [strictAdherence, setStrictAdherence] = useState(false)
  const [client, setClient] = useState([])
  const [clientDiasble, setClientDisable] = useState(false)
  const [skuType, setSkuType] = useState([])
    const [taxMaster, setTaxmaster] = useState([])
  const location = useLocation()
  const [editedSkudata, setEditedSkuData] = useState(null)
  const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
const prevValueRef = useRef(isSingleViewPopupForType);

  const prevIsSingleViewRef = useRef(isSingleViewPopupForType)
  const [version, setVersion] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [defaultSkuValues, setDefaultSkuValues] = useState([])
  const [color,setColor]=useState([])
  const [fluteDropdown,setFluteDropdown]=useState([])
  const [rscUnits,setRscUnits] = useState("mm")
const [selectedFluteIndex, setSelectedFluteIndex] = useState(null);
const [isCompositePopupCreate,setIsCompositePopupCreate]=useState(false)
  const skuTypeFromClient = location?.state?.sku_type_for_navigate_from_client;
const [compositeSkuMessage,setCompositeSkuMessage]=useState("")

const [addNewSkuData, setAddNewSkuData] = useState({
    sku_name: null,
    client_id: null,
    client: null,
    ply: null,
    length: null,
    width: null,
    height: null,
    lwh: null,
    unit: 'mm',
    joints: null,
    ups: null,
    select_dies: null,
    no_of_parts: null,
    composite_type: null,
    inner_outer_dimension: 'Inner',
    flap_width: null,
    flap_tolerance: null,
    length_trimming_tolerance: 20,
    width_board_size_cm2: null,
    length_board_size_cm2: null,
    width_trimming_tolerance: 20,
    strict_adherence: strictAdherence,
    customer_reference: null,
    reference_number: null,
    // internal_id: null,
    board_size_cm2: null,
    deckle_size: null,
    minimum_order_level: null,
    sku_type:location?.state?.sku_type_for_navigate_from_client || 'RSC box',
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
        flute_ratio: null,
        layer_status:"ungrouped",
        production_status:" pending"
      },
    ],
  })
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

    useEffect(() => {
    const taxData = async () => {
      try {
        const response = await skuApi.getTaxMaster()
        setTaxmaster(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    taxData()
  }, [])

console.log("taxxx",taxMaster)
  useEffect(() => {
console.log("old data",skuTypeFromClient)
  if (skuTypeFromClient) {
    setAddNewSkuData((prev) => ({
      ...prev,
      sku_type: skuTypeFromClient,
    }));
  }
}, [location?.state?.sku_type_for_navigate_from_client]);
   const fetchData = async () => {

      try {
  const clientResponse = await clientApi.getSkuClients({ limit: 10000 }) 
  
        //setSkuData(response.data)
        setClient(clientResponse.data)
console.log("client res",clientResponse)
      } catch (error) {
        console.error('Error fetching data:', error)
      }finally {
      //setLoading(false); // Always called, even if error occurs or early return
    }
    }
    useEffect(() => {
      fetchData()
    }, [
      //refresh,
      //selectedClient,
      //selectedDisplayName,
      //clientName,
      //searchQuery,
      //pagination?.currentPage,
      //selectedSkuType,
      //limit,
      //+location.state?.skipInitialFetch,
      //message,
    ])
const { id } = useParams();
   useEffect(() => {
    if (id) {
      handleSkuEdit(id);
    }
  }, [id]);
 const handleChange = (event) => {
    const { name, value } = event.target

  if (name === 'client' && value === 'add_client') {
    setPopupOpen(true);
    setAddNewSkuData((prev) => ({
      ...prev,
      client: null,
      client_id: null,
    }));
    return;
  }
    if (name === 'gst_percentage') {
      setAddNewSkuData((prev) => ({
        ...prev,
        gst_percentage: value,
      }))
      return
    }

    setAddNewSkuData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Find the selected client based on the client_id
   if (name === 'client') {
    const selectedClient = client?.find(
      (item) => item?.client_id === parseInt(value)
    );

    if (selectedClient) {
      setAddNewSkuData((prev) => ({
        ...prev,
        client_id: selectedClient.client_id,
        client: selectedClient.company_name,
      }));

      // Clear validation error
      if (selectedClient.client_id?.toString().trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.client_id;
          return newErrors;
        });
      }
    }
    return; // Prevent further updates for 'client'
  }
    if (value?.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

  }


console.log("data",rscUnits)
  const createInitialSkuData = () => ({
    client_id: null,
    sku_name: null,
    composite_type: null,
    ply: null,
    client: "",
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
    sku_type:location?.state?.sku_type_for_navigate_from_client || 'RSC box',
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
        layer_status:"ungrouped",
        production_status:"pending"
        //flute_ratio: null,
      },
    ],
  })
// const skuFormData = useSelector((state) => state.skuForm)


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (addNewSkuData?.id) {
          const response = await skuApi.getSkuVersions(addNewSkuData?.id)
          setVersion(response.data.data)
          // Set default values when editing
          setDefaultSkuValues(addNewSkuData?.sku_values)
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

  //useEffect(() => {
  //  if (!editTag) {
  //    setAddNewSkuData(createInitialSkuData())
  //  }
  //}, [editTag, refresh])


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
      client: addNewSkuData?.client,
      sku_type: option?.sku_type || option?.value,
    }
    setSkuVariant(option?.sku_type || option?.value)
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
  const resetWeights = addNewSkuData?.sku_values?.map((item) => ({
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

    const updatedSkuValues = addNewSkuData?.sku_values?.map((item) => {
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
  addNewSkuData?.length,
  addNewSkuData?.width,
  addNewSkuData?.height,
  rscUnits,
  addNewSkuData?.width_board_size_cm2,
  addNewSkuData?.length_board_size_cm2,
  meterSquareData,
  JSON.stringify(
    addNewSkuData?.sku_values?.map(
      (item) => item.selected_flute?.take_up_factor || 0
    )
  ),
]);


  //for updating the gsm calculations when dimension changes
  useEffect(() => {
    setAddNewSkuData((prevData) => {
      const updatedSkuValues = prevData.sku_values?.map((item) => {
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
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:2,layer: 'Corrugated Layer', type: 'Corrugated Layer',layer_status:"ungrouped", production_status: "pending" },
    ],
    3: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped", production_status: "pending" },
    ],
    5: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:4,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:5,layer: 'Liner Layer 2', type: 'Liner Layer 2',layer_status:"ungrouped", production_status: "pending" },
    ],
    7: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:4,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:5,layer: 'Liner Layer 2', type: 'Liner Layer 2',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:6,layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:7,layer: 'Liner Layer 3', type: 'Liner Layer 3',layer_status:"ungrouped", production_status: "pending" },
    ],
    9: [
      { layer_id:1,layer: 'Top Layer', type: 'Top Layer',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:4,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:5,layer: 'Liner Layer 2', type: 'Liner Layer 2',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:6,layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:7,layer: 'Liner Layer 3', type: 'Liner Layer 3',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:8,layer: 'Corrugated Layer 4', type: 'Corrugated Layer 4',layer_status:"ungrouped", production_status: "pending" },
      { layer_id:9,layer: 'Liner Layer 4', type: 'Liner Layer 4',layer_status:"ungrouped", production_status: "pending" },
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
      layer_status:layer.layer_status,
      production_status:layer.production_status
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
        taxMaster={taxMaster}
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
                taxMaster={taxMaster}

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
                taxMaster={taxMaster}

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
        compositeSkuMessage={compositeSkuMessage}
                taxMaster={taxMaster}

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
                taxMaster={taxMaster}

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
    //handleClose()
    // dispatch(saveSkuFormState({}))
    navigate('/sku')
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
        //sku_type: 'Composite',
        sku_type: 'Composite',
      }))
    }
    setIsActivateRender(true)
    // Update the ref after checking
    prevIsSingleViewRef.current = isSingleViewPopupForType
  }, [isSingleViewPopupForType])

  useEffect(() => {
      const updatedSkuValues = addNewSkuData?.sku_values?.map((item) => {
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
    const hasChanged = updatedSkuValues?.some(
      (item, index) => item.bursting_strength !== addNewSkuData?.sku_values[index].bursting_strength,
    )

    if (hasChanged) {
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_values: updatedSkuValues,
      }))
    }
  }, [JSON.stringify(addNewSkuData?.sku_values)])
  const handleAutofillRow = (currentIndex) => {
    if (currentIndex === 0) return

    const previousRow = addNewSkuData?.sku_values[currentIndex - 1]
    const updatedRow = { ...addNewSkuData?.sku_values[currentIndex] }

    // Copy selected fields
    const fieldsToCopy = ['gsm', 'bf', 'color', 'material', 'weight', 'bursting_strength']
    fieldsToCopy.forEach((field) => {
      updatedRow[field] = previousRow[field]
    })

    const updatedSkuValues = [...addNewSkuData?.sku_values]
    updatedSkuValues[currentIndex] = updatedRow

    setAddNewSkuData((prev) => ({
      ...prev,
      sku_values: updatedSkuValues,
    }))
  }
  useEffect(() => {
    if (addNewSkuData?.sku_values && !editTag) {
      setDefaultSkuValues(addNewSkuData?.sku_values)
    }
  }, [addNewSkuData?.sku_values, editTag])

  const handleVersionSelect = async (e) => {
    const selectedValue = e.target.value

    if (selectedValue === 'default') {
      setSelectedVersion(null)
      // Reset to the original values from the API response
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_values: defaultSkuValues?.map((item) => ({
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
      const response = await commonApi.getColors();
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
console.log("sku values...",JSON.stringify(addNewSkuData?.sku_values))
useEffect(() => {
  const totalWeight = addNewSkuData?.sku_values?.reduce(
    (acc, item) => acc + (Number(item.weight) || 0),
    0
  )

const totalBurstingStrength = addNewSkuData?.sku_values?.reduce((acc, item) => {
  const gsm = Number(item.gsm);
  const bf = Number(item.bf);
  const isCorrugated = item.layer?.toLowerCase().includes('corrugated');

  if (gsm && bf) {
    const divisor = isCorrugated ? 2000 : 1000;
    return acc + (gsm * bf) / divisor;
  }
  return acc;
}, 0);


  setAddNewSkuData((prevData) => ({
    ...prevData,
    total_weight: Math.round(totalWeight * 1000) / 1000,
    total_bursting_strength: Math.round(totalBurstingStrength * 1000) / 1000,
  }))
}, [addNewSkuData?.sku_values])

  useEffect(() => {
    fetchFluteList()
  }, [])

  const fetchFluteList = async () => {
    try {
      const response = await skuApi.getFluteType()
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
console.log("add sku data",addNewSkuData?.client)
console.log("add sku data",addNewSkuData?.client_id)

  const deckleError = useSelector((state) => state.boardCalculations.deckleError)
  const dieError = useSelector((state) => state.diecutCalculations.deckleError)

  const handleAddSkuSubmit = async () => {
    let newErrors = {}
    if (addNewSkuData.sku_type === 'Custom Item') {
      // Validate only for Custom Item
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.estimate_composite_item) newErrors.estimate_composite_item = 'Required'
      if (!addNewSkuData.default_sku_details) newErrors.default_sku_details = 'Required'
      if (!addNewSkuData.description) newErrors.description = 'Required'
    } else if (addNewSkuData.sku_type === 'Composite') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.composite_type) newErrors.composite_type = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
 const partValueErrors = addNewSkuData.part_value.map((part) => {
  const errors = {}
  if (!part.sku_id || !part.sku_name) errors.sku = 'SKU is required'
  if (!part.ratio) errors.ratio = 'Ratio is required'
  return Object.keys(errors).length > 0 ? errors : undefined
})

// Only assign part_value errors if there are any non-undefined entries
if (partValueErrors.some((entry) => entry !== undefined)) {
  newErrors.part_value = partValueErrors
}

    } else if (addNewSkuData.sku_type === 'Die Cut box') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.ply) newErrors.ply = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.select_dies) newErrors.select_dies = 'Required'
      // if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
      // if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      // if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
            if (Array.isArray(addNewSkuData.sku_values)) {
    addNewSkuData.sku_values.forEach((layer, index) => {
      const layerErrors = {}

      if (!layer.gsm) layerErrors.gsm = 'GSM is required'
      if (!layer.bf) layerErrors.bf = 'BF is required'
      if (!layer.color) layerErrors.color = 'Color is required'
      if (
        layer?.layer?.toLowerCase()?.includes('corrugated') &&
        !layer.flute_type
      ) {
        layerErrors.flute_type = 'Flute Type is required'
      }

      if (Object.keys(layerErrors).length > 0) {
        if (!newErrors.sku_values) newErrors.sku_values = {}
        newErrors.sku_values[index] = layerErrors
      }
    })
  }
    } else if (addNewSkuData.sku_type === 'Board') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.ply) newErrors.ply = 'Required'
      if (!addNewSkuData.joints) newErrors.joints = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
      if (!addNewSkuData.flap_tolerance) newErrors.flap_tolerance = 'Required'
      if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
      // if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
      // if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      // if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
            if (Array.isArray(addNewSkuData.sku_values)) {
    addNewSkuData.sku_values.forEach((layer, index) => {
      const layerErrors = {}

      if (!layer.gsm) layerErrors.gsm = 'GSM is required'
      if (!layer.bf) layerErrors.bf = 'BF is required'
      if (!layer.color) layerErrors.color = 'Color is required'
      if (
        layer?.layer?.toLowerCase()?.includes('corrugated') &&
        !layer.flute_type
      ) {
        layerErrors.flute_type = 'Flute Type is required'
      }

      if (Object.keys(layerErrors).length > 0) {
        if (!newErrors.sku_values) newErrors.sku_values = {}
        newErrors.sku_values[index] = layerErrors
      }
    })
  }
    }
    //if (!addNewSkuData.gst_percentage) newErrors.gst_percentage = 'Required'
    else if (addNewSkuData.sku_type === 'RSC box') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.ply) newErrors.ply = 'Required'

      if (!addNewSkuData.joints) newErrors.joints = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.length) newErrors.length = 'Required'
      if (!addNewSkuData.width) newErrors.width = 'Required'
      if (!addNewSkuData.height) newErrors.height = 'Required'
      if (!addNewSkuData.joints) newErrors.joints = 'Required'
      //if (!addNewSkuData.deckle_size &&  deckleSize>addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!addNewSkuData.deckle_size) {
  newErrors.deckle_size = 'Deckle size is required';
} else if (Number(addNewSkuData.deckle_size) < deckleSize) {
  newErrors.deckle_size = `Deckle size must be greater than ${deckleSize.toFixed(3)}`;
}

      //if (!addNewSkuData.inner_outer_dimension) newErrors.inner_outer_dimension = 'Required'
      if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
      if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
      if (!addNewSkuData.width_trimming_tolerance) newErrors.width_trimming_tolerance = 'Required'
      // if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
      // if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      // if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
      if (Array.isArray(addNewSkuData.sku_values)) {
    addNewSkuData.sku_values.forEach((layer, index) => {
      const layerErrors = {}

      if (!layer.gsm) layerErrors.gsm = 'GSM is required'
      if (!layer.bf) layerErrors.bf = 'BF is required'
      if (!layer.color) layerErrors.color = 'Color is required'
      if (
        layer?.layer?.toLowerCase()?.includes('corrugated') &&
        !layer?.flute_type
      ) {
        layerErrors.flute_type = 'Flute Type is required'
      }

      if (Object.keys(layerErrors).length > 0) {
        if (!newErrors.sku_values) newErrors.sku_values = {}
        newErrors.sku_values[index] = layerErrors
      }
    })
  }
    } else {
      newErrors = {}
    }
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      if (dieError) {
        setAlerts([{ severity: 'error', message: dieError || '1' }])
        return null
      }
      if (deckleError) {
        setAlerts([{ severity: 'error', message: deckleError || '3' }])
        return null
      }
      if (boardSizeError) {
        console.warn('Blocked submission due to board size error:', boardSizeError)
        setAlerts([{ severity: 'error', message: boardSizeError || '4' }])
        return null
      }

      const numberSkuData = {
        ...addNewSkuData,
         unit: addNewSkuData.unit?.trim() ? addNewSkuData.unit : "mm",
        width_board_size_cm2: Number(addNewSkuData.width_board_size_cm2),
        length_board_size_cm2: Number(addNewSkuData.length_board_size_cm2),
        deckle_size: Number(addNewSkuData.deckle_size),
        gst_percentage: Number(addNewSkuData.gst_percentage),
            length: Number(addNewSkuData.length),
             width: Number(addNewSkuData.width),
             height: Number(addNewSkuData.height)
      }
      //console.log("numberSkuData",JSON.stringify(numberSkuData))
 const numberSkuDataFixed = {
  ...numberSkuData,
  sku_values: numberSkuData.sku_values.map(({ selected_flute, flute_type, ...rest }) => ({
    ...rest,
    flute_type: flute_type === "--" ? null : flute_type,
  })),
};

console.log("numberSkuDataFixed", JSON.stringify(numberSkuDataFixed, null, 2));

      try {
        let response

        if (editTag) {
          response = await skuApi.updateSku(numberSkuDataFixed)
        } else {
          response = await skuApi.addSku(numberSkuDataFixed)
        }

        if (response?.data?.message) {
          //setRefresh((prev) => !prev)
          if (isSingleViewPopupForType) {
            setisSingleViewPopupForType(false)
                      setAlerts([{ severity: 'success', message: response.data.message }])
                      setCompositeSkuMessage(response.data.message)
          } else {
            //setDrawerOpen(false)
                        navigate('/SKU', {
  state: {
    successMessage: response.data.message
  }
});

          }
          setEditTag(false)
          if(addNewSkuData.sku_type==="Composite"){
           dispatch(setSkuPartValue([]))
          }

        }
      } catch (error) {
        console.error('Error adding SKU:', error)
        if (error?.response?.data?.error) {
          setAlerts([{ severity: 'error', message: error?.response?.data?.error }])
        } else {
          setAlerts([{ severity: 'error', message: error?.response?.data?.message }])
        }
      } finally {
        setTimeout(() => {
          setAlerts([])
        }, 3000)
      }
    }
  }


  const handleStrictAdherenceToggle = () => {
    const newStrictAdherence = !strictAdherence
    setStrictAdherence(newStrictAdherence)

    setAddNewSkuData((prevData) => ({
      ...prevData,
      strict_adherence: newStrictAdherence,
    }))
  }


  console.log("sku tyoe000000",skuType)
  console.log("edit datas",addNewSkuData)

  const handleSkuEdit = async (id) => {
  if (!id) return;

  try {
    console.log("editing id", id);
    const selectedSku  = await skuApi.singleSku(id); // Make sure skuApi.singleSku returns a promise
    console.log("sku single data", selectedSku);

    //setSelectedSku(data);
    setEditTag(true);
    setClientDisable(true);
    setEditedSkuData(selectedSku); // Use `data`, not `selectedSku`

     setAddNewSkuData({
      id: selectedSku.id || null,
      sku_name: selectedSku.sku_name || null,
      client_id: selectedSku?.client_id || null,
      client: selectedSku?.company_name || null,
      ply: selectedSku.ply || null,
      length: selectedSku.length || null,
      width: selectedSku.width || null,
      height: selectedSku.height || null,
      lwh: selectedSku.lwh || null,
      unit: selectedSku.unit || null,
      joints: selectedSku.joints || null,
      ups: selectedSku.ups || null,
      select_dies: selectedSku.select_dies || null,
      no_of_parts: selectedSku?.no_of_parts || null,
      composite_type: selectedSku?.composite_type || null,
      inner_outer_dimension: selectedSku.inner_outer_dimension || null,
      flap_width: selectedSku.flap_width ?? null,
      flap_tolerance: selectedSku.flap_tolerance || null,
      length_trimming_tolerance: selectedSku.length_trimming_tolerance || null,
      width_trimming_tolerance: selectedSku.width_trimming_tolerance || null,
      strict_adherence: selectedSku.strict_adherence || false,
      customer_reference: selectedSku.customer_reference || null,
      reference_number: selectedSku.reference_number || null,
      // internal_id: selectedSku.internal_id || null,
      board_size_cm2: selectedSku.board_size_cm2 || null,
      deckle_size: selectedSku.deckle_size || null,
      minimum_order_level: selectedSku.minimum_order_level ?? null,
      sku_type: selectedSku.sku_type || null,
      part_value: selectedSku.part_value || [],
      route: selectedSku.route || [],
      part_count: selectedSku.part_count,
      width_board_size_cm2: selectedSku.width_board_size_cm2 || null,
      length_board_size_cm2: selectedSku.length_board_size_cm2 || null,
      estimate_composite_item: selectedSku.estimate_composite_item || null,
      description: selectedSku.description || null,
      default_sku_details: selectedSku.default_sku_details || null,
          documents: selectedSku.documents || [],
    print_type:selectedSku.print_type || null,
      tags: selectedSku.tags || {},
      gst_percentage: selectedSku.gst_percentage || null,
      total_weight:selectedSku.total_weight || null,
total_bursting_strength:selectedSku.total_bursting_strength ||null,
      sku_values: selectedSku.sku_values || [
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
          flute_ratio: null,
          layer_status: null,
          production_status: "pending",
        },
      ],
    })


    setStrictAdherence(data.strict_adherence ?? false);
    

  } catch (error) {
    console.error('Error fetching SKU:', error);
  }
};

console.log("editinggg data",addNewSkuData)
 useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // required for Chrome to show the confirmation dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <div className="p-6 bg-white rounded-lg">
      {/* conditional rendring according to sku_type */}
      <h4 className="text-lg font-semibold mb-4">
  {editTag ? 'Edit' : 'Add'} Sku Details
</h4>

      {skuComponents[addNewSkuData?.sku_type] || null}

      {addNewSkuData?.sku_type !== 'Custom Item' && addNewSkuData?.sku_type !== 'Composite' && (
        <div className="flex items-center gap-5 mb-3">
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

      {addNewSkuData?.ply && addNewSkuData?.sku_type !== 'Custom Item' && (
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
{addNewSkuData?.ply && addNewSkuData?.sku_type !== 'Custom Item' && (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4 mt-4 mb-6">
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Weight:{' '}
 {addNewSkuData?.total_weight}
    </p>
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Bursting Strength:{' '}
{addNewSkuData?.total_bursting_strength}
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

    {/*<div className="fixed bottom-0 left-0 right-0 bg-white border-t pt-4 pb-6 px-4 flex justify-end space-x-4 z-20">
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

  
</div>*/}
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
          <div className="pr-3 mx-auto flex justify-end">
            <div className='flex gap-2'>
              <ActionButton
                onClick={handleCancel}
                variant="cancel"
                label={"cancel"}
              />

              <ActionButton
                label={"Submit"}
                variant=''
               onClick={handleAddSkuSubmit}
              />
            </div>
          </div>
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
          {addNewSkuData?.ply && compositeSelect !== 'Custom Item' && (
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
          {addNewSkuData?.ply && addNewSkuData?.sku_type !== 'Custom Item' && (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4 mt-4 mb-6">
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Weight:{' '}
 {addNewSkuData?.total_weight}
    </p>
    <p className="text-sm font-medium text-gray-700 mb-10">
      Total Bursting Strength:{' '}
{addNewSkuData?.total_bursting_strength}
    </p>
  </div>
)}

          <div className="flex justify-end space-x-4 mt-6">
           <ActionButton
                 onClick={() => {

                setisSingleViewPopupForType(false)
                // setIsCompositePopupCreate(false)
                //setCompositeSelect('Composite')
                setAddNewSkuData(createInitialSkuData())

              }}
                variant="cancel"
                label={"cancel"}
              />
          <ActionButton
                label={"Submit"}
                variant=''
               onClick={handleAddSkuSubmit}
              />
          </div>
         
        </div>
      </PopUp>
    </div>
  )
}

export default SkuAddEdit
