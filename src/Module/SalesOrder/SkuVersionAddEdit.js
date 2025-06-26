import React, { useEffect, useState } from "react";
import { FaEye, FaSpinner } from "react-icons/fa";
import CustomAlert from "../../components/New/CustomAlert";
import PopUp from "../../components/New/PopUp";
import VersionChoicePopup from "./VersionChoicePopup";
import FluteTypeView from "../SKU/FluteTypeView";
import { skuApi } from "../../api/sku";
import { commonApi } from "../../api/common";



function SkuVersionAddEdit({
  skuID,
  setSkuVersionsMap,
  orderId,
  IsEditVersion,
  skuVersionID,
  visible,
  setVisible,
  currentVersionCount,
  setWorkOrders ,
  skuvaluesFromParent,
  allSkuData,
  handleWholeSkuObject
      }) {
  const [skuValues, setSkuValues] = useState([skuvaluesFromParent]);
  const [clientID, setClientID] = useState("");
  const [skuVersion, setSkuVersion] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [skuversionLimit, setSkuversionLimit] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [VersionChoiceOpen, setVersionChoiceOpen] = useState(false)
  const [SkuInitalData, setSkuInitalData] = useState([])
  const [editedMap, setEditedMap] = useState({});
  const [skuOptions, setSkuOptions] = useState({});
  const [focusedField, setFocusedField] = useState(null);
    const [allSkuDetails, setAllSkuDetails] = useState(null);
      const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
      const [selectedFluteIndex, setSelectedFluteIndex] = useState(null);
        const [fluteDropdown,setFluteDropdown]=useState([])
const [colorList, setColorList] = useState([]);


// console.log(allSkuData)
  const handleCloseSingleViewPopup = () => {
    setisSingleViewPopup(false)
  }

useEffect(() => {
  const colorData = async () => {
    try {
      const response = await commonApi.getColors();
      setColorList(response.data.data); // contains objects with color_name
      console.log("color data", response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  colorData();
}, []);

  
// Call this when popup selection happens
const handleFluteSelection = (selectedFlute, fluteIndex) => {
  if (fluteIndex !== null) {
    const updatedValues = [...skuvaluesFromParent];
    updatedValues[fluteIndex].flute_type = selectedFlute.name;
    updatedValues[fluteIndex].take_up_factor = parseFloat(selectedFlute.take_up_factor);

    recalcRowValues(updatedValues[fluteIndex]);

    setSkuValues(updatedValues);
    setWorkOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, work_order_sku_values: updatedValues }
          : order
      )
    );

    setSelectedFluteIndex(null);
    setisSingleViewPopup(false);
  }
};

  // const [currentVersionCount, setCurrentVersionCount] = useState(0);

  // Helper function to check if any changes have been made
  const hasChanges = () => {
    return Object.keys(editedMap).length > 0;
  };
  

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

 useEffect(() => {
    const fetchData = async () => {
      try {
        if (IsEditVersion && skuVersionID) {
          // Case 1: Edit Mode with Version ID
          const versionResponse = await skuApi.getSingleSkuVersion(skuVersionID);
  
          if (versionResponse?.data) {
            setSkuValues(versionResponse?.data?.sku_values || []);
            setClientID(versionResponse?.data?.client_id || "");
            setSkuVersion(versionResponse?.data?.sku_version || "");
          }
  
        } else if (skuID && skuVersionID) {
          // 🔹 Case 2: Both skuID and skuVersionID are available (but not in edit mode)
          console.log("Handling skuID + skuVersionID case (not edit mode)");
          // Add your custom logic here for this case
          // Example:
       const skuPromise = skuApi.getSingleSkuData(skuID);
const versionPromise = skuApi.getSingleSkuVersion(skuVersionID);

const [skuResponse, versionResponse] = await Promise.all([skuPromise, versionPromise]);
setAllSkuDetails(skuResponse.data)
handleWholeSkuObject(skuResponse.data);

          setWorkOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId
                ? { ...order, ["work_order_sku_values"]: versionResponse?.data?.sku_values || []  }
                : order
            )
          )

          if (skuResponse?.data && versionResponse?.data) {
            setSkuValues(versionResponse?.data?.sku_values || []);
            setClientID(skuResponse?.data?.client_id || "");
            setSkuOptions((await skuApi.getSkuValuesOptions(skuID))?.data?.options || {});
            setSkuversionLimit(skuResponse.data.sku_version_limit);
            setSkuInitalData(versionResponse?.data?.sku_values || []);
            const skuversionID = `V${versionResponse?.data?.data?.length + 1}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            setSkuVersion(skuversionID);
          }

  
        } else {
          // Case 3: Only skuID is available (create new)
          const response = await skuApi.getSingleSkuData(skuID);
          const OptionResponse = await skuApi.getSkuValuesOptions(skuID);
          setSkuOptions(OptionResponse?.data?.options || {});
  
          if (response?.data?.sku_values && Array.isArray(response.data.sku_values)) {

            setWorkOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === orderId
                  ? { ...order, ["work_order_sku_values"]: response.data.sku_values || []  }
                  : order
              )
            )
            setAllSkuDetails(response.data)
            handleWholeSkuObject(response.data);
            setSkuValues(response.data.sku_values);
            setSkuInitalData(response.data.sku_values);
            setClientID(response.data.client_id);
            setSkuversionLimit(response.data.sku_version_limit);
          }
  
          // Generate new SKU version ID
          const versionsResponse = await skuApi.getSkuVersions(skuID);
          // setCurrentVersionCount(versionsResponse?.data?.data?.length || 0);
          const skuversionID = `V${versionsResponse.data.data.length + 1}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          setSkuVersion(skuversionID);
        }
      } catch (error) {
        console.error("Error fetching SKU data or versions:", error);
      }
    };
  
    if(skuID){
      fetchData();
    }
  }, [skuID, IsEditVersion, skuVersionID, setSkuVersionsMap,]);
  

  //const handleValueChange = (index, field, value) => {

  //  const updatedValues = [...skuvaluesFromParent];
  //  updatedValues[index][field] = value;
  //  setSkuValues(updatedValues);
  //  setWorkOrders(prevOrders =>
  //    prevOrders.map(order =>
  //      order.id === orderId
  //        ? { ...order, ["work_order_sku_values"]: updatedValues || []  }
  //        : order
  //    )
  //  )

  //  // Track changed field per index
  //  setEditedMap(prev => {
  //    const updatedFields = { ...(prev[index] || {}) };
  //    updatedFields[field] = value;
  //    return { ...prev, [index]: updatedFields };
  //  });
  //};
const recalcRowValues = (item) => {
  const lengthVal = Number(allSkuDetails?.length_board_size_cm2 || 0);
  const widthVal = Number(allSkuDetails?.width_board_size_cm2 || 0);
  const unit = (allSkuDetails?.unit || "").toLowerCase();

  const areaOriginalUnit = lengthVal * widthVal;
  let areaM2 = 0;

  switch (unit) {
    case "mm":
      areaM2 = areaOriginalUnit / 1_000_000;
      break;
    case "cm":
      areaM2 = areaOriginalUnit / 10_000;
      break;
    case "in":
    case "inch":
      areaM2 = areaOriginalUnit * 0.00064516;
      break;
    default:
      areaM2 = 0;
  }

  const gsm = Number(item.gsm);
  const bf = Number(item.bf);

  const isCorrugated = item.layer?.toLowerCase().includes("corrugated");
  const takeUpFactor = isCorrugated ? parseFloat(item.take_up_factor || 1) : 1;

  // Calculate weight
  if (!isNaN(gsm) && areaM2 > 0) {
    item.weight = parseFloat((gsm * areaM2 * 0.001 * takeUpFactor).toFixed(3));
  } else {
    item.weight = 0;
  }

    // ✅ Bursting Strength calculation (modified logic)
  if (!isNaN(gsm) && !isNaN(bf)) {
    const divisor = isCorrugated ? 2000 : 1000;
    item.bursting_strength = parseFloat(((gsm * bf) / divisor).toFixed(3));
  } else {
    item.bursting_strength = 0;
  }
};
const handleValueChange = (index, field, value) => {
  const updatedValues = [...skuvaluesFromParent];

  if (field === 'flute_type') {
    const selectedFlute = fluteDropdown.find(f => f.name === value);
    if (selectedFlute) {
      updatedValues[index].flute_type = selectedFlute.name;
      updatedValues[index].take_up_factor = parseFloat(selectedFlute.take_up_factor);
    }
  } else {
    updatedValues[index][field] = value;
  }

  recalcRowValues(updatedValues[index]);

  setSkuValues(updatedValues);
  setWorkOrders(prevOrders =>
    prevOrders.map(order =>
      order.id === orderId
        ? { ...order, work_order_sku_values: updatedValues }
        : order
    )
  );

  setEditedMap(prev => {
    const updatedFields = { ...(prev[index] || {}) };
    updatedFields[field] = value;
    return { ...prev, [index]: updatedFields };
  });
};


const totalWeight = skuvaluesFromParent?.reduce(
  (sum, item) => sum + (Number(item.weight) || 0),
  0
);

const totalBurstingStrength = skuvaluesFromParent?.reduce(
  (sum, item) => sum + (Number(item.bursting_strength) || 0),
  0
);


  const handleAddOption = async () => {
    try {
      console.log(editedMap)
      const field_options = Object.entries(editedMap).flatMap(([index, fields]) => {
        return Object.entries(fields).map(([fieldName, fieldValue]) => ({
          field_path: `sku_values.${index}.${fieldName}`,
          field_name: fieldName,
          field_value: fieldValue
        }));
      });

      console.log("field_options:", field_options);

      const requestBody = {
        sku_id: skuID,
        sku_version: null,
        field_options: field_options
      };

      const response = await skuApi.postSkuValuesOptions(requestBody);


      const optionResponse = await skuApi.getSkuValuesOptions(skuID);
      setSkuOptions(optionResponse?.data?.options || {});
            
      setTimeout(() => {
        setAlerts([{ severity: "success", message: response?.data?.message || "SKU Options Added Successfully" }]);
      }, 1000);

      // Optionally clear the edited map
      setEditedMap({});
      setVersionChoiceOpen(false)

    } catch (error) {
      console.error("Error adding SKU options:", error);
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Failed to add SKU options." }]);
    }
  };

  const handleSubmit = async () => {
    // Don't proceed if no changes have been made
    if (!hasChanges()) {
      return;
    }

    const requestBody = {
      sku_id: skuID,
      sku_version: skuVersion,
      client_id: clientID,
      sku_values: skuvaluesFromParent
    };

    if (IsEditVersion && skuVersionID) {
      // Edit mode
      try {
        const response = await skuApi.updateSkuVersion(skuVersionID, requestBody);
        setAlerts([{ severity: "success", message: response?.data?.message || "SKU Version updated successfully" }]);
        setTimeout(() => {
          setVisible(false)
        }, 1000);

        const updatedVersionsResponse = await skuApi.getSkuVersions(skuID);
        if (updatedVersionsResponse?.data?.data) {
          setSkuVersionsMap(prev => ({
            ...prev,
            [orderId]: updatedVersionsResponse.data.data
          }));
        }
      } catch (error) {
        setAlerts([{ severity: "error", message: error?.response?.data?.message || "Failed to update SKU Version" }]);
        console.error("Error updating data:", error);
      }
    } else {
      // Create mode
      setVersionChoiceOpen(true)
    }
  };

  const handleClose = () => {
    setAlerts([]);
  };

  const openViewCard = () => {
    console.log("View flute card details");
    
  };

  const handleAddVersion = async () => {
    try {
      // Get the current versions before submitting
      const versionsResponse = await skuApi.getSkuVersions(skuID);
      const currentVersionCount = versionsResponse?.data?.data?.length || 0;

      if (skuversionLimit && currentVersionCount >= skuversionLimit) {
        setAlerts([{ severity: "error", message: `Maximum SKU version limit of ${skuversionLimit} reached.` }]);
        return; // Exit early, do not proceed
      }
const cleanedSkuValues = skuvaluesFromParent.map((item) => {
  const {
    take_up_factor,
    selected_flute,
    flute_type,
    ...rest
  } = item;

  return {
    ...rest,
    flute_type: flute_type === "--" ? null : flute_type
  };
});

      const requestBody = {
        sku_id: skuID,
        sku_version: `v${currentVersionCount + 1}_${Date.now()}`,
        client_id: clientID,
        sku_values: cleanedSkuValues
      };
      console.log("req body",JSON.stringify(requestBody))
      const response = await skuApi.addSkuVersion(requestBody);
      setAlerts([{ severity: "success", message: response?.data?.message || "Successfully added" }]);

      const updatedVersionsResponse = await skuApi.getSkuVersions(skuID);
      if (updatedVersionsResponse?.data?.data) {
        setSkuVersionsMap(prev => ({
          ...prev,
          [orderId]: updatedVersionsResponse.data.data
        }));
        // setCurrentVersionCount(updatedVersionsResponse.data.data.length)
      }
setWorkOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, sku_version: response.data.skuVersion.id }
              : order
          )
        );
      // Clear edited map and close popup
      setEditedMap({});
      setVersionChoiceOpen(false);
    } catch (error) {
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Failed to add SKU Version" }]);
      console.error("Error submitting data:", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleOneTimeUse = ()=>{
    // setEditedMap({});
    setVersionChoiceOpen(false);
  }

  console.log("all data",allSkuData)
    console.log("all data 2",skuvaluesFromParent)
     console.log('llll')
     console.log("all 888888",allSkuDetails)
  return (
    <>
      {skuvaluesFromParent?.length > 0 && (
        <div className="p-4">
          <h2 className="text-sm font-semibold mb-4">SKU Version Details</h2>
          <CustomAlert alerts={alerts} handleClose={handleClose} />

          <div className="mt-6">
            <div className="border rounded-lg overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-gray-500 text-sm text-center">
                    <th className="p-1">Layer</th>
                    <th className="p-1">GSM</th>
                    <th className="p-1">BF</th>
                    <th className="p-1">Color</th>
                    <th className="p-1">Flute Type</th>
                    <th className="p-1">Material</th>
                    <th className="p-1">Weight (Kg)</th>
                    <th className="p-1">
                      Bursting Strength <br />
                      <span className="text-xs">
                        (Kg Per Cm<sup>2</sup>)
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                {skuvaluesFromParent.map((item, index) => (
  <tr key={index} className="flex-wrap">
    <td className="p-2 text-center w-full sm:w-2/12 md:w-2/12 lg:w-2/12 relative">
      <div className="relative w-full">
        <input
          type="text"
          className="p-1 border rounded w-full"
          value={item.layer || ""}
          onFocus={() => setFocusedField({ index, name: 'layer' })}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleValueChange(index, 'layer', e.target.value)}
        />

        {
          focusedField?.index === index && focusedField?.name === 'layer' &&
          skuOptions[`sku_values.${index}.layer`] && (
            <ul className="absolute z-10 mt-1 w-full bg-white border shadow rounded text-sm max-h-36 overflow-y-auto">
              {skuOptions[`sku_values.${index}.layer`].map((option) => (
                <li
                  key={option.id}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => handleValueChange(index, 'layer', option.field_value)}
                >
                  {option.field_value}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </td>

    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
      <div className="relative w-full">
        <input
          type="number"
          className="p-1 border rounded text-center w-full"
          value={item.gsm || ""}
          onFocus={() => setFocusedField({ index, name: 'gsm' })}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleValueChange(index, 'gsm', Number(e.target.value))}
        />

        {
          focusedField?.index === index && focusedField?.name === 'gsm' &&
          skuOptions[`sku_values.${index}.gsm`] && (
            <ul className="absolute z-10 mt-1 w-full bg-white border shadow rounded text-sm max-h-36 overflow-y-auto">
              {skuOptions[`sku_values.${index}.gsm`].map((option) => (
                <li
                  key={option.id}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => handleValueChange(index, 'gsm', option.field_value)}
                >
                  {option.field_value}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </td>

    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
      <div className="relative w-full">
        <input
          type="number"
          className="p-1 border rounded text-center w-full"
          value={item.bf || ""}
          onFocus={() => setFocusedField({ index, name: 'bf' })}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleValueChange(index, 'bf', Number(e.target.value))}
        />
        {
          focusedField?.index === index && focusedField?.name === 'bf' &&
          skuOptions[`sku_values.${index}.bf`] && (
            <ul className="absolute z-10 mt-1 w-full bg-white border shadow rounded text-sm max-h-36 overflow-y-auto">
              {skuOptions[`sku_values.${index}.bf`].map((option) => (
                <li
                  key={option.id}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => handleValueChange(index, 'bf', option.field_value)}
                >
                  {option.field_value}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </td>

   <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
  <div className="relative w-full">
    <select
      className="p-1 border rounded w-full text-sm"
      value={item.color || ""}
      onChange={(e) => handleValueChange(index, 'color', e.target.value)}
      onFocus={() => setFocusedField({ index, name: 'color' })}
      onBlur={() => setFocusedField(null)}
    >
      <option value="" disabled>
        Select color
      </option>
      {colorList.map((color) => (
        <option key={color.id} value={color.color_name}>
          {color.color_name}
        </option>
      ))}
    </select>
  </div>
</td>


  <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
  <div className="relative w-full flex items-center">
    {item.layer?.toLowerCase().includes("corrugated") ? (
      <>
        <select
          className="p-1 border rounded w-full pr-8 appearance-none"
          value={item.flute_type || ''}
          onChange={(e) => handleValueChange(index, 'flute_type', e.target.value)}
        >
          <option value="" hidden>Select</option>
          {fluteDropdown.map(flute => (
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
      </>
    ) : (
      <p className="text-gray-400 italic">--</p>
    )}
  </div>
</td>



    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
      <div className="relative w-full">
        <input
          type="text"
          className="p-1 border rounded w-full"
          value={item.material || ""}
          onFocus={() => setFocusedField({ index, name: 'material' })}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleValueChange(index, 'material', e.target.value)}
        />
        {
          focusedField?.index === index && focusedField?.name === 'material' &&
          skuOptions[`sku_values.${index}.material`] && (
            <ul className="absolute z-10 mt-1 w-full bg-white border shadow rounded text-sm max-h-36 overflow-y-auto">
              {skuOptions[`sku_values.${index}.material`].map((option) => (
                <li
                  key={option.id}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => handleValueChange(index, 'material', option.field_value)}
                >
                  {option.field_value}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </td>

    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
      <p>{item.weight ? Number(item.weight).toFixed(3) : 'N/A'}</p>
    </td>

    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
    <p>{item.bursting_strength ? item.bursting_strength.toFixed(3) : 'N/A'}</p>

    </td>
  </tr>
))}

                </tbody>
              </table>

              <div className="p-2 flex flex-col md:flex-row justify-between items-center w-full gap-4">
  {/* Total Display on Left */}
  <div className="text-sm text-gray-700 font-medium">
    <p>Total Weight: <span className="font-bold">{totalWeight.toFixed(3)} kg</span></p>
    <p>Total Bursting Strength: <span className="font-bold">{totalBurstingStrength.toFixed(3)} Kg/cm²</span></p>
  </div>

              <div>
                <button
                  className={`
                    inline-flex items-center gap-1.5
                    text-white text-xs font-medium
                    px-3 py-1.5
                    rounded border
                    transition-colors duration-150
                    ${hasChanges() && !isLoading 
                      ? 'bg-gray-400 hover:bg-gray-700 cursor-pointer' 
                      : 'bg-gray-300 cursor-not-allowed opacity-50'
                    }
                  `}
                  onClick={handleSubmit}
                  disabled={!hasChanges() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {IsEditVersion ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {IsEditVersion ? (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      {IsEditVersion ? "Update" : "Add"}
                    </>
                  )}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <VersionChoicePopup
        isOpen={VersionChoiceOpen}
        setIsOpen={setVersionChoiceOpen}
        handleAddVersion={handleAddVersion}
        handleAddOption={handleAddOption}
        skuversionLimit={skuversionLimit}
        currentVersionCount={currentVersionCount}
        handleOneTimeUse={handleOneTimeUse}
      />

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
    </>
  );
}

export default SkuVersionAddEdit;





// In handleSubmit success cases
// setEditedMap({}); // This will disable the button again