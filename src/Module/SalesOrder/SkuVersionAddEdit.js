import React, { useEffect, useState } from "react";
import apiMethods from "../../api/config";
import { FaEye, FaSpinner } from "react-icons/fa";
import CustomAlert from "../../components/New/CustomAlert";
import PopUp from "../../components/New/PopUp";
import VersionChoicePopup from "./VersionChoicePopup";

function SkuVersionAddEdit({ skuID, setSkuVersionsMap, orderId, IsEditVersion, skuVersionID, visible, setVisible }) {
  const [skuValues, setSkuValues] = useState([]);
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






  useEffect(() => {
    const fetchData = async () => {
      try {
        if (IsEditVersion && skuVersionID) {
          // Fetch specific SKU version data when in edit mode
          const versionResponse = await apiMethods.getSingleSkuVersion(skuVersionID);

          if (versionResponse?.data) {

            setSkuValues(versionResponse?.data?.sku_values || []);
            setClientID(versionResponse?.data?.client_id || "");
            setSkuVersion(versionResponse?.data?.sku_version || "");
          }
        } else {
          // Fetch SKU Data
          const response = await apiMethods.getSingleSkuData(skuID);
          const OptionResponse = await apiMethods.getSkuValuesOptions(skuID)
          setSkuOptions(OptionResponse?.data?.options || {});
          console.log(OptionResponse?.data?.options, 'fffffffffffffffffffffff')




          if (response?.data?.sku_values && Array.isArray(response.data.sku_values)) {
            setSkuValues(response.data.sku_values);
            setSkuInitalData(response.data.sku_values)
            setClientID(response.data.client_id);
            setSkuversionLimit(response.data.sku_version_limit)
          }

          // Fetch SKU Versions
          const versionsResponse = await apiMethods.getSkuVersions(skuID);
          const skuversionID = `V${versionsResponse.data.data.length + 1}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
          setSkuVersion(skuversionID);
        }
      } catch (error) {
        console.error("Error fetching SKU data or versions:", error);
      }
    };

    if (skuID) {
      fetchData();
    }
  }, [skuID, IsEditVersion, skuVersionID, setSkuVersionsMap]);



  const handleValueChange = (index, field, value) => {
    const updatedValues = [...skuValues];
    updatedValues[index][field] = value;
    setSkuValues(updatedValues);

    // Track changed field per index
    setEditedMap(prev => {
      const updatedFields = { ...(prev[index] || {}) };
      updatedFields[field] = value;
      return { ...prev, [index]: updatedFields };
    });
  };
  const handleAddOption = async () => {
    try {
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

      const response = await apiMethods.postSkuValuesOptions(requestBody);

      console.log(response);

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
    // setIsLoading(true);

    const requestBody = {
      sku_id: skuID,
      sku_version: skuVersion,
      client_id: clientID,
      sku_values: skuValues
    };

    if (IsEditVersion && skuVersionID) {
      // Edit mode
      try {
        const response = await apiMethods.updateSkuVersion(skuVersionID, requestBody);
        setAlerts([{ severity: "success", message: response?.data?.message || "SKU Version updated successfully" }]);
        setTimeout(() => {
          setVisible(false)
        }, 1000);

        const updatedVersionsResponse = await apiMethods.getSkuVersions(skuID);
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

      const requestBody = {
        sku_id: skuID,
        sku_version: skuVersion,
        client_id: clientID,
        sku_values: skuValues
      };

      const versionsResponse = await apiMethods.getSkuVersions(skuID);
      const currentVersionCount = versionsResponse?.data?.data?.length || 0;

      if (skuversionLimit && currentVersionCount >= skuversionLimit) {
        setAlerts([{ severity: "error", message: `Maximum SKU version limit of ${skuversionLimit} reached.` }]);
        return; // Exit early, do not proceed
      }

      requestBody.sku_version = `v${currentVersionCount + 1}_${Date.now()}`;

      const response = await apiMethods.addSkuVersion(requestBody);
      setAlerts([{ severity: "success", message: response?.data?.message || "Successfully added" }]);

      const updatedVersionsResponse = await apiMethods.getSkuVersions(skuID);
      if (updatedVersionsResponse?.data?.data) {
        setSkuVersionsMap(prev => ({
          ...prev,
          [orderId]: updatedVersionsResponse.data.data
        }));
      }
    } catch (error) {
      setAlerts([{ severity: "error", message: error?.response?.data?.message || "Failed to add SKU Version" }]);
      console.error("Error submitting data:", error);
    }
    finally {
      setIsLoading(false);
    }
  }






  return (
    <>


      {skuValues.length > 0 && (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">SKU Version Details</h2>
          <CustomAlert alerts={alerts} handleClose={handleClose} />

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
                    <th className="p-2">Material</th>
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
                {skuValues.map((item, index) => (
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
        <input
          type="text"
          className="p-1 border rounded w-full"
          value={item.color || ""}
          onFocus={() => setFocusedField({ index, name: 'color' })}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleValueChange(index, 'color', e.target.value)}
        />
        {
          focusedField?.index === index && focusedField?.name === 'color' &&
          skuOptions[`sku_values.${index}.color`] && (
            <ul className="absolute z-10 mt-1 w-full bg-white border shadow rounded text-sm max-h-36 overflow-y-auto">
              {skuOptions[`sku_values.${index}.color`].map((option) => (
                <li
                  key={option.id}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => handleValueChange(index, 'color', option.field_value)}
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
      <div className="relative w-full flex items-center">
        <select
          className="p-1 border rounded w-full pr-8 appearance-none"
          value={item.flute_type || 'Select'}
          onChange={(e) => handleValueChange(index, 'flute_type', e.target.value)}
        >
          <option hidden>Select</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          <option value="N">N</option>
        </select>
        <FaEye
          className="absolute right-2 text-gray-500 cursor-pointer"
          onClick={openViewCard}
        />
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
      <p>{item.weight || 'N/A'}</p>
    </td>

    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
      <p>N/A</p>
    </td>
  </tr>
))}

                </tbody>


              </table>
              <div className="p-2 flex w-[100%]  justify-end">
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      {IsEditVersion ? "Updating..." : "Processing..."}
                    </>
                  ) : (
                    IsEditVersion ? "Update Version" : "Add As Version"
                  )}
                </button>
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
      >
      </VersionChoicePopup>
    </>
  );
}

export default SkuVersionAddEdit;





