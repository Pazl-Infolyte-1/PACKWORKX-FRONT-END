import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import {
  MdTakeoutDining,
  MdOutlineSettingsInputComposite,
  MdCheckroom,
  MdClearAll,
  MdFavorite
} from 'react-icons/md'
import { AiFillCarryOut, AiFillCodeSandboxCircle } from "react-icons/ai";

import Drawer from '../../components/Drawer/Drawer'
import apiMethods from '../../api/config'
import CommonPagination from '../../components/New/Pagination'
import SkuPopup from './SkuPopup'
import SkuTable from './SkuTable'
import { useLocation } from 'react-router-dom'
import SkuAddEdit from './SkuAddEdit'
import ActionButton from '../../components/New/ActionButton'
import SearchBar from '../../components/New/SearchBar'
import { AuthContext } from '../../Context/AuthContext'
import { useSearch } from '../../components/New/SearchContext'
import CustomAlert from '../../components/New/CustomAlert'
import createInitialSkuData from './CreateInitialSkuData'
import { bottom } from '@popperjs/core'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Drawer1 from '../../components/Drawer/Drawer1';


function SkuList() {
  const [skuType, setSkuType] = useState([])
  const [client, setClient] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedDisplayName, setSelectedDisplayName] = useState("")
  const [selectedSkuType, setSelectedSkuType] = useState('')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [skudata, setSkuData] = useState([])
  const [editedSkudata, setEditedSkuData] = useState(null)
  const [strictAdherence, setStrictAdherence] = useState(false)
  const [editTag, setEditTag] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [clientDiasble, setClientDisable] = useState(false)
  const [limit, setLimit] = useState(10)
  const [alerts, setAlerts] = useState([])
  const { user } = useContext(AuthContext)
  const { searchQuery, setSearchQuery, filteredSearchData } = useSearch()
  const location = useLocation()
  const searchBarRef = useRef(null)
  const [boardSizeError, setBoardSizeError] = useState('')
  const navigate = useNavigate();
  const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [message, setMessage] = useState("")
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [skuVariant, setSkuVariant] = useState("RSC Box")
  //const isDrawerOpenroute = location.pathname === '/SKU/add-edit';

  //useEffect(() => {
  //  if (isDrawerOpenroute) {
  //    console.log('Drawer opened');
  //    // You can trigger analytics, focus a field, etc.
  //  } else {
  //    console.log('Drawer closed');
  //  }
  //}, [isDrawerOpenroute]);
console.log("suuuuu",user)
  const [addNewSkuData, setAddNewSkuData] = useState({
    sku_name: null,
    client_id: null,
    client: null,
    ply: null,
    length: null,
    width: null,
    height: null,
    unit: 'mm',
    joints: null,
    ups: null,
    select_dies: null,
    no_of_parts: null,
    composite_type: null,
    inner_outer_dimension: null,
    flap_width: null,
    flap_tolerance: null,
    length_trimming_tolerance: 20,
    width_board_size_cm2: null,
    length_board_size_cm2: null,
    width_trimming_tolerance: 20,
    strict_adherence: strictAdherence,
    customer_reference: null,
    reference_number: null,
    internal_id: null,
    board_size_cm2: null,
    deckle_size: null,
    minimum_order_level: null,
    sku_type: 'RSC box',
    part_value: [],
    route:[],
    part_count: null,
    estimate_composite_item: null,
    description: null,
    default_sku_details: null,
    tags: {},
    sku_values: [
      {
        layer: null,
        gsm: null,
        bf: null,
        material: null,
        color: null,
        flute_type: null,
        weight: null,
        flute_ratio: null,
      },
    ],
  })
  useEffect(() => {
    if (location.state?.initialRender) {
      setDrawerOpen(true)
      setClientDisable(true)
    }
    if (location.state?.clientdata) {
      setClient(location.state?.clientdata)
    }
    if (location.state?.client_id) {
      setAddNewSkuData((prevState) => ({
        ...prevState,
        client: location.state?.client_id,
      }))
    }

    // Clear the location state after using it to prevent side effects on refresh
    if (location.state) {
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'client' && value === 'add_client') {
      setPopupOpen(true);
  
      // Don't set 'add_client' as the selected value
      setAddNewSkuData((prev) => ({
        ...prev,
        client: null,
      }));
      return;
    }
   
    setAddNewSkuData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Find the selected client based on the client_id
    const selectedClient = client.find(item => item.client_id === parseInt(value)); // Ensure value is an integer
  
    if (selectedClient) {
      console.log("company_name", selectedClient.company_name);
      console.log("client_id", selectedClient.client_id);
      console.log("client_ui_id", selectedClient.client_ui_id);
      console.log("client_ref_id", selectedClient.client_ref_id);
      console.log("gst_status", selectedClient.gst_status);
      setAddNewSkuData((prev) => ({
        ...prev,
        client_id: selectedClient.client_id, // Set client_id
        client: selectedClient.company_name,   // Set company_name as client
      }));
      if (selectedClient.client_id?.toString().trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.client_id;
          return newErrors;
        });
      }
    } else {
      console.log("No client found for the selected client_id");
    }
 

    if (value?.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    console.log("name", name);
    console.log("val", value);
  };

  const handleStrictAdherenceToggle = () => {
    const newStrictAdherence = !strictAdherence
    setStrictAdherence(newStrictAdherence)

    setAddNewSkuData((prevData) => ({
      ...prevData,
      strict_adherence: newStrictAdherence,
    }))
  }

  //useEffect(() => {
  //  if (user?.id) {
  //    setAddNewSkuData((prevData) => ({
  //      ...prevData,
  //      client_id: user.id,
  //    }));
  //  }
  //}, [user?.id]);
  const deckleError = useSelector((state) => state.boardCalculations.deckleError);
  const dieError = useSelector((state) => state.diecutCalculations.deckleError);


//  const handleAddSkuSubmit = async () => {
//    try {
//      if (editTag) {
//        if(dieError){
//          setAlerts([{ severity: 'error', message: dieError || "1" }])
//          return  null
//        }
//        const numberSkuData={
//          ...addNewSkuData,
//          width_board_size_cm2: Number(addNewSkuData.width_board_size_cm2),
//          length_board_size_cm2: Number(addNewSkuData.length_board_size_cm2),
//          deckle_size: Number(addNewSkuData.deckle_size),
//        }
//        const response = await apiMethods.updateSku(numberSkuData)
//        if (response?.status === 200) {
//          setEditTag(false)
//          setRefresh((prev) => !prev)
//          setAlerts([
//            {
//              severity: 'success',
//              message: response?.data?.message || 'Sku updated successfully!',
//            },
//          ])
//        } else {
//          setAlerts([{ severity: 'error', message: response.error || 'Something went wrong' }])
//        }
//      } else {
//        if(dieError){
//          setAlerts([{ severity: 'error', message: dieError || "2"  }])
//          return  null
//        }
//        if(deckleError){
//          setAlerts([{ severity: 'error', message: deckleError|| "3"  }])
//          return  null
//        }
//        if (boardSizeError) {
//          console.warn('Blocked submission due to board size error:', boardSizeError)
//          setAlerts([{ severity: 'error', message: boardSizeError || "4" }])
//          return null 
//        }
//        console.log("addskkkk",addNewSkuData)
//        const numberSkuData={
//          ...addNewSkuData,
//          width_board_size_cm2: Number(addNewSkuData.width_board_size_cm2),
//          length_board_size_cm2: Number(addNewSkuData.length_board_size_cm2),
//          deckle_size: Number(addNewSkuData.deckle_size),
//        }
//        const response = await apiMethods.addSku(numberSkuData)
//        if (response?.status===201) {
//          console.log("success res",JSON.stringify(response))
    
//          setRefresh((prev) => !prev)
//          setAlerts([{ severity: 'success', message: response?.data?.message }])


//setTimeout(() => {
//  setAlerts([]);
//}, 3000);
//          if(isSingleViewPopupForType){
//            setisSingleViewPopupForType(false)
//          }else{
//            setDrawerOpen(false)
//          }
//        } else {
//console.log("resss eeee",response.error)
//        }
//      }
//    } catch (error) {
  
//    }

//    setTimeout(() => {
//      setAlerts([]);
//    }, 3000);
//    setBoardSizeError('')
//  }

const handleAddSkuSubmit = async () => {
  console.log("skuVariant type",skuVariant)
  console.log("skuVariant typeddd",addNewSkuData.sku_type)

  let newErrors = {};
  if (addNewSkuData.sku_type === "Custom Item") {
    // Validate only for Custom Item
    if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required';
    if (!addNewSkuData.client_id) newErrors.client_id = 'Required';
    if (!addNewSkuData.estimate_composite_item) newErrors.estimate_composite_item = 'Required';
    if (!addNewSkuData.default_sku_details) newErrors.default_sku_details = 'Required';
    if (!addNewSkuData.description) newErrors.description = 'Required';
  } 
  
  else if (addNewSkuData.sku_type === "Composite") {
    // Validate only for Composite
    if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required';
    if (!addNewSkuData.client_id) newErrors.client_id = 'Required';
    if (!addNewSkuData.composite_type) newErrors.composite_type = 'Required';
    if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required';
    if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
      newErrors.route = 'Required';
    }}
    
    else if (addNewSkuData.sku_type === "Die Cut box") {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required';
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required';
      if (!addNewSkuData.ply) newErrors.ply = 'Required'
 if (!addNewSkuData.ups) newErrors.ups = 'Required'
   if (!addNewSkuData.select_dies) newErrors.select_dies = 'Required'
     if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
       if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required';
      if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
        if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required';
      }}
      
      else if (addNewSkuData.sku_type === "Board") {
        // Validate only for Composite
        if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required';
        if (!addNewSkuData.client_id) newErrors.client_id = 'Required';
        if (!addNewSkuData.ply) newErrors.ply = 'Required'
        if (!addNewSkuData.joints) newErrors.joints = 'Required'
   if (!addNewSkuData.ups) newErrors.ups = 'Required'
       if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
  if (!addNewSkuData.flap_tolerance) newErrors.flap_tolerance = 'Required'
  if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
       if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
         if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
        if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
        if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
        if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
        if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
        if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
          if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required';
        if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
          newErrors.route = 'Required';
        }}
        
        else if (addNewSkuData.sku_type === "RSC box") {
          // Validate only for Composite
          if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required';
          if (!addNewSkuData.client_id) newErrors.client_id = 'Required';
          if (!addNewSkuData.ply) newErrors.ply = 'Required'

          if (!addNewSkuData.joints) newErrors.joints = 'Required'
     if (!addNewSkuData.ups) newErrors.ups = 'Required'
            if (!addNewSkuData.length) newErrors.length = 'Required'
  if (!addNewSkuData.width) newErrors.width = 'Required'
  if (!addNewSkuData.height) newErrors.height = 'Required'
    if (!addNewSkuData.joints) newErrors.joints = 'Required'
      if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
       if (!addNewSkuData.inner_outer_dimension) newErrors.inner_outer_dimension = 'Required'
        if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
    if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
      if (!addNewSkuData.width_trimming_tolerance) newErrors.width_trimming_tolerance = 'Required'
         if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
           if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
          if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
          if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
          if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
  if (!addNewSkuData.ups) newErrors.ups = 'Required'
          if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
          if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
            newErrors.route = 'Required';
          }}

    else {
      // All other skuVariants: No validation required
      newErrors = {};
    }
  //if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
  //if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
  //if (!addNewSkuData.estimate_composite_item) newErrors.estimate_composite_item = 'Required'
  //if (!addNewSkuData.default_sku_details) newErrors.default_sku_details = 'Required'
  //if (!addNewSkuData.description) newErrors.description = 'Required'
  //if (!addNewSkuData.composite_type) newErrors.composite_type = 'Required'
  //if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
  //if (!addNewSkuData.ups) newErrors.ups = 'Required'
  //if (!addNewSkuData.joints) newErrors.joints = 'Required'
  //  if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
  //if (!addNewSkuData.flap_tolerance) newErrors.flap_tolerance = 'Required'
  //if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
  //if (!addNewSkuData.width_trimming_tolerance) newErrors.width_trimming_tolerance = 'Required'
  //if (!addNewSkuData.select_dies) newErrors.select_dies = 'Required'
  //if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
  //if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
  //if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
  //if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
  //if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
  //  if (!addNewSkuData.length) newErrors.length = 'Required'
  //if (!addNewSkuData.width) newErrors.width = 'Required'
  //if (!addNewSkuData.height) newErrors.height = 'Required'
  //if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
  //  if (!addNewSkuData.inner_outer_dimension) newErrors.inner_outer_dimension = 'Required'
  //if (!addNewSkuData.ply) newErrors.ply = 'Required'
  //if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
  //  newErrors.route = 'Required';
  //}

  setErrors(newErrors)
 

console.log("erroexxx",newErrors)
  if (Object.keys(newErrors).length === 0) {
    console.log("gggghhhg",)
    if(dieError){
      setAlerts([{ severity: 'error', message: dieError || "1" }])
      return  null
    }
            if(deckleError){
  setAlerts([{ severity: 'error', message: deckleError|| "3"  }])
  return  null
}
if (boardSizeError) {
  console.warn('Blocked submission due to board size error:', boardSizeError)
  setAlerts([{ severity: 'error', message: boardSizeError || "4" }])
  return null 
}

console.log("addskkkk", addNewSkuData);

const numberSkuData = {
...addNewSkuData,
width_board_size_cm2: Number(addNewSkuData.width_board_size_cm2),
length_board_size_cm2: Number(addNewSkuData.length_board_size_cm2),
deckle_size: Number(addNewSkuData.deckle_size),
};
console.log("su data",numberSkuData)
try {
let response;

if (editTag) {
response = await apiMethods.updateSku(numberSkuData);
} else {
response = await apiMethods.addSku(numberSkuData);
}

console.log("SKU request successful:", response);
if (response?.data?.message) {
setAlerts([{ severity: 'success', message: response.data.message }]);
setRefresh((prev) => !prev)
if(isSingleViewPopupForType){
            setisSingleViewPopupForType(false)
          }else{
            setDrawerOpen(false)
          }
          setEditTag(false)
}
} catch (error) {
console.error("Error adding SKU:", error);
console.log(JSON.stringify(error))
if(error?.response?.data?.error){
setAlerts([{ severity: 'error', message: error?.response?.data?.error}]);
}else{
setAlerts([{ severity: 'error', message: error?.response?.data?.message}]);

}

}
finally {
setTimeout(() => {
setAlerts([]);
}, 3000);
}
  }
};



  const handleSkuEdit = (id) => {
    const selectedSku = skudata.find((sku) => sku.id === id)
    setEditTag(true)
    setEditedSkuData(selectedSku)
    setAddNewSkuData({
      id: selectedSku.id || null,
      sku_name: selectedSku.sku_name || null,
      client_id: selectedSku.client_id || null,
      client: selectedSku.company_name || null,
      ply: selectedSku.ply || null,
      length: selectedSku.length || null,
      width: selectedSku.width || null,
      height: selectedSku.height || null,
      unit: selectedSku.unit || null,
      joints: selectedSku.joints || null,
      ups: selectedSku.ups || null,
      select_dies: selectedSku.select_dies || null,
      no_of_parts: selectedSku?.no_of_parts || null,
      composite_type: selectedSku?.composite_type || null,
      inner_outer_dimension: selectedSku.inner_outer_dimension || null,
      flap_width: selectedSku.flap_width || null,
      flap_tolerance: selectedSku.flap_tolerance || null,
      length_trimming_tolerance: selectedSku.length_trimming_tolerance || null,
      width_trimming_tolerance: selectedSku.width_trimming_tolerance || null,
      strict_adherence: selectedSku.strict_adherence || false,
      customer_reference: selectedSku.customer_reference || null,
      reference_number: selectedSku.reference_number || null,
      internal_id: selectedSku.internal_id || null,
      board_size_cm2: selectedSku.board_size_cm2 || null,
      deckle_size: selectedSku.deckle_size || null,
      minimum_order_level: selectedSku.minimum_order_level || null,
      sku_type: selectedSku.sku_type || null,
      part_value: selectedSku.part_value || [],
      route: selectedSku.route || [],
      part_count: selectedSku.part_count,
      width_board_size_cm2:selectedSku.width_board_size_cm2 || null,
      length_board_size_cm2:selectedSku.length_board_size_cm2 || null,
      estimate_composite_item: selectedSku.estimate_composite_item || null,
      description: selectedSku.description || null,
      default_sku_details: selectedSku.default_sku_details || null,
      tags: selectedSku.tags || {},
      sku_values: selectedSku.sku_values || [
        {
          layer: null,
          gsm: null,
          bf: null,
          material: null,
          color: null,
          flute_type: null,
          weight: null,
          flute_ratio: null,
        },
      ],
    })

    setStrictAdherence(selectedSku.strict_adherence || false)
  }
  const fetchData = async () => {
    // skip sku get call
    if (location.state?.skipInitialFetch && !refresh) {
      return
    }
    try {
      const response = await apiMethods.getSkuList({
        search: searchQuery || '',
        client: selectedDisplayName || '',
        sku_type: selectedSkuType || '',
        page: pagination?.currentPage || 1,
        limit: message ? 10000 : limit,
      })
      const clientResponse = await apiMethods.getClients()

      setSkuData(response.data)
      setClient(clientResponse.data)
      setPagination(response.pagination)
      setDashboard(response.dashboard)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
 
    fetchData()
  }, [
    refresh,
    selectedClient,
    selectedDisplayName,
    searchQuery,
    pagination?.currentPage,
    selectedSkuType,
    limit,
    location.state?.skipInitialFetch,
    message,
  ])

  // Clear all filters
  const handleClearFilters = () => {
    // Clear the search input using the ref
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
    setSelectedSkuType('')
    setSelectedClient('')
    setSelectedDisplayName("")
  }

  const handleSkuExelExport = async () => {
    await apiMethods.getSkuExcelExport({
      search: searchQuery,
      sku_type: selectedSkuType,
      client: selectedClient,
      status: 'active',
    })
  }

  const handleClose = () => {
    setAlerts([])
  }
console.log("client data",client)
console.log("dashboard",dashboard)
console.log("mess",message)

  return (
    <div>
      {/* Header */}
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex items-center justify-between flex-wrap gap-x-2 -my-2">
        <h1 className="sm:text-[32px] text-[#424242]">SKU</h1>
        {/* <span className="sm:text-[18px] font-semibold text-[#424242] ">
          Total SKU Count: {pagination?.totalCount}
        </span> */}
        <h3>Total Count:{pagination?.totalCount || 0}</h3>
        <div className="flex gap-2 items-center justify-between w-full sm:w-auto">
          {['Add SKU', 'Bulk Upload', 'Export to Excel'].map((text, index) => (
            <ActionButton
              key={index}
              label={text}
              customColor="bg-[#21338e]"
              className="sm:h-8 flex items-center font-bold text-white px-2 rounded-lg shadow-md border-none cursor-pointer"
              onClick={() => {
                if (text === 'Add SKU') {
                  setErrors({})
                                dispatch({
                    type: 'SET_SELECTED_ROUTE_IDS',
                    payload: [], // 👈 empty array
                  });
                  dispatch({
                    type: 'SET_DECKLE_SIZE',
                    payload: {
                      deckle_size: "",
                      deckleError: "",
                    },
                  });
                  dispatch({ type: 'RESET_DIECUT_CALCULATIONS' });

                  setDrawerOpen(true)
                  setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
                  //navigate('/SKU/add-edit')
                }
                if (text === 'Bulk Upload') {
                  setVisible(true)
                }
                if (text === 'Export to Excel') {
                  handleSkuExelExport()
                }
              }}
            ></ActionButton>
          ))}
        </div>
      </div>

      {/* SKU Boxes */}
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        {[
          {
            name: 'RSC Box',
            count: dashboard?.rscbox || 0,
            color: '#286eb1',
            bgColor: '#2e2d6d',
            icon: <FaBoxOpen className="text-white text-2xl" />,
          },
          {
            name: 'Board',
            count: dashboard?.board || 0,
            color: '#8000c0',
            bgColor: '#67009a',
            icon: <MdTakeoutDining className="text-white text-2xl" />,
          },
          {
            name: 'Die Cut Box',
            count: dashboard?.diecutbox || 0,
            color: '#077A7D',
            bgColor: '#005a4d',
            icon: <MdOutlineSettingsInputComposite className="text-white text-2xl" />,
          },
          {
            name: 'Composite',
            count: dashboard?.composite || 0,
            color: '#C95792',
            bgColor: '#7a0064',
            icon: <AiFillCarryOut className="text-white text-2xl" />,
          },
          {
            name: 'Custom Item',
            count: dashboard?.customitem || 0,
            color: '#559400',
            bgColor: '#4a8000',
            icon: <AiFillCodeSandboxCircle  className="text-white text-2xl" />,
          },
          //{
          //  name: 'Total SKU',
          //  count: pagination?.totalCount || 0,
          //  color: '#c3f2cb',
          //  bgColor: '#4cd964',
          //  icon: <MdCheckroom className="text-white text-2xl" />,
          //},
        ].map((item, index) => (
          <div
            key={index}
            className={`w-full sm:w-[235px] flex items-center justify-between  font-bold rounded-lg shadow-md text-white border p-2`}
            style={{ backgroundColor: item.color }}
          >
            <div className=" ">
              <h2 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-white ">
                {item.name}
              </h2>
              <h2 className="text-center text-xl md:text-lg sm:text-base xs:text-sm text-white">
                {item.count}
              </h2>
            </div>
            <div
              className="h-[45px] w-[45px] flex items-center justify-center rounded-lg  "
              style={{ backgroundColor: item.bgColor }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2 my-4 p-3 w-full bg-white border border-gray-200 border-b-transparent">
        <SearchBar text="SKU" data={skudata} ref={searchBarRef} />

        <div className="flex justify-between gap-2 w-full sm:w-auto">
          <select
            value={selectedSkuType}
            onChange={(e) => setSelectedSkuType(e.target.value)}
            className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
          >
            <option value="" disabled>
              SKU Type
            </option>
            {skuType.map((option, index) => (
              <option key={index} value={option.sku_type}>
                {option.sku_type}
              </option>
            ))}
          </select>

          <select
            value={selectedClient}
            onChange={(e) => {
              setSelectedClient(e.target.value);
          
              const selectedItem = client.find(
                (item) => item.client_id == e.target.value
              );
              console.log("hhhhhhhhhhh",selectedItem?.display_name);
              setSelectedDisplayName(selectedItem?.display_name)
            }}
            className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
          >
            <option value="">Select Client</option>
            {client.map((item, index) => (
              <option key={index} value={item.client_id}>
                {item.display_name || item.client_id}
              </option>
            ))}
          </select>
          <ActionButton
            label={'Clear All'}
            variant="minimal"
            customColor="black"
            className="bg-white"
            icon={MdClearAll}
            onClick={handleClearFilters}
          />
        </div>
      </div>
      <div className="-my-6">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap ">
          <SkuTable
            skudata={filteredSearchData.length > 0 ? filteredSearchData : skudata}
            setSkuData={setSkuData}
            handleSkuEdit={handleSkuEdit}
            editTag={editTag}
            alerts={alerts}
            setAlerts={setAlerts}
            onSkuDeleted={fetchData} 
            setErrors={setErrors}
          />
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4 mt-[40px]">
        <CommonPagination
          count={pagination?.totalPages || 1}
          page={pagination?.currentPage || 1}
          onChange={(event, value) => {
            setPagination((prev) => ({
              ...prev,
              currentPage: value,
            }))
            setRefresh((prev) => !prev)
          }}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            // Reset to first page when changing limit
            setPagination((prev) => ({
              ...prev,
              currentPage: 1,
            }))
            setRefresh((prev) => !prev)
          }}
          limit={limit}
        />
      </div>
      <div>
        <SkuPopup visible={visible} setVisible={setVisible} />
      </div>
      {/*{isDrawerOpen || editTag && (*/}
      <Drawer
        maxWidth="1280px"
        isOpen={isDrawerOpen || editTag}
        title={editTag ? 'Edit SKU Details' : 'Add SKU Details'}
        onClose={() => {
          setDrawerOpen(false)
          setEditTag(false)
          setClientDisable(false)
          setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
          //navigate('/SKU')
        }}
      >
        <SkuAddEdit
        isopenval={isDrawerOpen || editTag}
          handleChange={handleChange}
          strictAdherence={strictAdherence}
          handleStrictAdherenceToggle={handleStrictAdherenceToggle}
          handleAddSkuSubmit={handleAddSkuSubmit}
          editTag={editTag}
          addNewSkuData={addNewSkuData}
          setAddNewSkuData={setAddNewSkuData}
          client={client}
          setClient={setClient}
          clientDiasble={clientDiasble}
          skuType={skuType}
          setSkuType={setSkuType}
          locationvalue={location?.state?.client_id}
          closedrawer={setDrawerOpen}
          setBoardSizeError={setBoardSizeError}
          //onUnitChange={handleUnitChange}
          editedSkudata={editedSkudata}
          handleClose={() => {
            setDrawerOpen(false)
            setEditTag(false)
            setClientDisable(false)
            setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
            //navigate('/SKU')
          }}
          setisSingleViewPopupForType={setisSingleViewPopupForType}
          isSingleViewPopupForType={isSingleViewPopupForType}
          isPopupOpen={isPopupOpen}
          setPopupOpen={setPopupOpen}
          message={message}
          setMessage={setMessage}
          errors={errors}
          setErrors={setErrors}
          setSkuVariant={setSkuVariant}
        />
      </Drawer>
      {/*)}*/}
    </div>
  )
}

export default SkuList
