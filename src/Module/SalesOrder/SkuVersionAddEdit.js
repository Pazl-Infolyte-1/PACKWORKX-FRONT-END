import React, { useEffect, useState } from "react";
import apiMethods from "../../api/config";
import { FaEye, FaSpinner } from "react-icons/fa";
import CustomAlert from "../../components/New/CustomAlert";
import PopUp from "../../components/New/PopUp";

function SkuVersionAddEdit({ skuID, setSkuVersionsMap, orderId, IsEditVersion, skuVersionID,visible,setVisible }) {
  const [skuValues, setSkuValues] = useState([]);
  const [clientID, setClientID] = useState("");
  const [skuVersion, setSkuVersion] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [skuversionLimit,setSkuversionLimit] = useState()
  const [isLoading, setIsLoading] = useState(false);


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

    
          if (response?.data?.sku_values && Array.isArray(response.data.sku_values)) {
            setSkuValues(response.data.sku_values);
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
  }, [skuID, IsEditVersion, skuVersionID,setSkuVersionsMap]);
  


  const handleValueChange = (index, field, value) => {
    const updatedValues = [...skuValues];
    updatedValues[index][field] = value;
    setSkuValues(updatedValues);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

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
      try {
        // Get the current versions before submitting
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
      finally{
        setIsLoading(false);
      }
    }
  };
  
  

  const handleClose = () => {
    setAlerts([]);
  };
  
  const openViewCard = () => {
    console.log("View flute card details");
  };

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
                      <td className="p-2 text-center w-full sm:w-2/12 md:w-2/12 lg:w-2/12">
                        <input
                          type="text"
                          className="p-1 border rounded w-full"
                          value={item.layer || ""}
                          onChange={(e) => handleValueChange(index, 'layer', e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                        <input
                          type="number"
                          className="p-1 border rounded text-center w-full"
                          value={item.gsm || ""}
                          onChange={(e) => handleValueChange(index, 'gsm', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                        <input
                          type="number"
                          className="p-1 border rounded text-center w-full"
                          value={item.bf || ""}
                          onChange={(e) => handleValueChange(index, 'bf', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                        <input
                          type="text"
                          className="p-1 border rounded w-full"
                          value={item.color || ""}
                          onChange={(e) => handleValueChange(index, 'color', e.target.value)}
                        />
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
                            <option value="F,G,N">F,G,N</option>
                          </select>
                          <FaEye
                            className="absolute right-2 text-gray-500 cursor-pointer"
                            onClick={openViewCard}
                          />
                        </div>
                      </td>
                      <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                        <input
                          type="text"
                          className="p-1 border rounded w-full"
                          value={item.material || ""}
                          onChange={(e) => handleValueChange(index, 'material', e.target.value)}
                        />
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
    </>
  );
}

export default SkuVersionAddEdit;