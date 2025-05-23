import { useContext, useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { AuthContext } from '../../Context/AuthContext'
import apiMethods from '../../api/config'
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
  const [rscUnits,setRscUnits] = useState("mm")
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
    sku_values: [
      {
        layer: null,
        gsm: null,
        bf: null,
        material: null,
        color: null,
        flute_type: null,
        weight: null,
        bursting_strength: null,
        //flute_ratio: null,
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (addNewSkuData?.id) {
          const response = await apiMethods.getSkuVersions(addNewSkuData?.id)
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
        const response = await apiMethods.getSkuType()
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

  const handleSkuValuesChange = (index, field, value) => {
    setAddNewSkuData((prevData) => {
      const updatedSkuValues = [...prevData.sku_values]
      const updatedItem = { ...updatedSkuValues[index], [field]: value }

      const isCorrugated = updatedItem.layer?.toLowerCase().includes('corrugated')

      // Update weight based on conditions
      if (field === 'gsm' || field === 'bf' || field === 'layer') {
        const gsm = field === 'gsm' ? value : updatedItem.gsm
        const bf = field === 'bf' ? value : updatedItem.bf
console.log("units rsc",rscUnits)
console.log("into msquare",meterSquareData)

  // Convert area to square meters
  let areaInSquareMeters = 0;

  if (rscUnits === 'mm') {
    areaInSquareMeters = meterSquareData * 1e-6; // mm² → m²
  } else if (rscUnits === 'cm') {
    areaInSquareMeters = meterSquareData * 1e-4; // cm² → m²
  } else if (rscUnits === 'in') {
    areaInSquareMeters = meterSquareData * 0.00064516; // in² → m²
  } else {
    console.warn("Unknown rscUnit:", rscUnits);
  }

        if (isCorrugated && gsm && bf) {
          updatedItem.weight = gsm * bf * areaInSquareMeters
        } else if (gsm) {
          updatedItem.weight = gsm * areaInSquareMeters
        }
      }

      // Auto-set flute_type for corrugated layer
      if (field === 'layer') {
        updatedItem.flute_type = isCorrugated ? '' : 'N/A'
      }
      updatedSkuValues[index] = updatedItem
      return { ...prevData, sku_values: updatedSkuValues }
    })
  }

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
      { id:1,layer: 'Top Layer', type: 'Top Layer' },
      { id:2,layer: 'Corrugated Layer', type: 'Corrugated Layer' },
    ],
    3: [
      { id:1,layer: 'Top Layer', type: 'Top Layer' },
      { id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1' },
    ],
    5: [
      { id:1,layer: 'Top Layer', type: 'Top Layer' },
      { id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1' },
      { id:2,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2' },
      { id:3,layer: 'Liner Layer 2', type: 'Liner Layer 2' },
    ],
    7: [
      { id:1,layer: 'Top Layer', type: 'Top Layer' },
      { id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1' },
      { id:2,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2' },
      { id:3,layer: 'Liner Layer 2', type: 'Liner Layer 2' },
      { id:2,layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3' },
      { id:3,layer: 'Liner Layer 3', type: 'Liner Layer 3' },
    ],
    9: [
      { id:1,layer: 'Top Layer', type: 'Top Layer' },
      { id:2,layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { id:3,layer: 'Liner Layer 1', type: 'Liner Layer 1' },
      { id:2,layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2' },
      { id:3,layer: 'Liner Layer 2', type: 'Liner Layer 2' },
      { id:2,layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3' },
      { id:3,layer: 'Liner Layer 3', type: 'Liner Layer 3' },
      { id:2,layer: 'Corrugated Layer 4', type: 'Corrugated Layer 4' },
      { id:3,layer: 'Liner Layer 4', type: 'Liner Layer 4' },
    ],
  }

  const updateSkuValues = (plyCount) => {
    const layerConfig = plyLayerConfigurations[plyCount] || []

    const newSkuValues = layerConfig.map((layer) => ({
      layer: layer.layer,
      gsm: '',
      bf: '',
      material: '',
      color: '',
      flute_type: layer.layer.toLowerCase().includes('corrugated') ? '' : 'N/A',
      weight: '',
      bursting_strength: '',
      //flute_ratio: '',
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
      if (item.gsm && item.bf) {
        const calculatedBS = Number(((item.gsm * item.bf) / 1000).toFixed(3))

        // Only update if bursting_strength actually changed
        if (item.bursting_strength !== calculatedBS) {
          return { ...item, bursting_strength: calculatedBS }
        }
      }
      return item
    })

    const hasChanged = updatedSkuValues.some(
      (item, index) => item.bursting_strength !== addNewSkuData.sku_values[index].bursting_strength,
    )

    if (hasChanged) {
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_values: updatedSkuValues,
      }))
    }
  }, [addNewSkuData.sku_values])
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
                          readOnly={editTag}
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
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="E">E</option>
                            <option value="F,G,N">F,G,N</option>
                          </select>
                          <FaEye
                            className="absolute right-2 text-gray-500 cursor-pointer"
                            onClick={openViewCard}
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
                      <p>{toThreeDecimalFixed((item.gsm * item.bf) / 1000)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
{addNewSkuData.ply && addNewSkuData.sku_type !== 'Custom Item' && (
<p className="p-2 text-left">
  Total Weight: {toThreeDecimalFixed(
    addNewSkuData.sku_values?.reduce((acc, item) => acc + (Number(item.weight) || 0), 0),
  )}
</p>)}


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
        <FluteTypeView></FluteTypeView>
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
                        <td className="p-2 text-center w-full sm:w-1/12">
                          <input
                            type="text"
                            placeholder="Color"
                            className="p-1 border rounded w-full"
                            value={item.color}
                            onChange={(e) => handleSkuValuesChange(index, 'color', e.target.value)}
                          />
                        </td>
                        <td className="p-2 text-center w-full sm:w-1/12 relative">
                          {item?.layer?.toLowerCase().includes('corrugated') ? (
                            <div className="relative w-full flex items-center">
                              <select
                                className="p-1 border rounded w-full pr-8 appearance-none"
                                value={item.flute_type}
                                onChange={(e) =>
                                  handleSkuValuesChange(index, 'flute_type', e.target.value)
                                }
                              >
                                <option hidden>Select</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="E">E</option>
                                <option value="F,G,N">F,G,N</option>
                              </select>
                              <FaEye
                                className="absolute right-2 text-gray-500 cursor-pointer"
                                onClick={openViewCard}
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
                        <td className="p-2 text-center w-full sm:w-1/12">
                          <p>{toThreeDecimalFixed(item.weight) || 'N/A'}</p>
                        </td>
                        <td className="p-2 text-center w-full sm:w-1/12">
                          {/*<p>{toThreeDecimalFixed(item.gsm * item.bf / 1000)}</p>*/}
                          <p>{item.bursting_strength}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
