import React, { createContext, useContext, useEffect, useState } from "react";
import { productionApi } from "../api/production";

const RawMaterialContext = createContext();

export const useRawMaterialContext = () => useContext(RawMaterialContext);

export const RawMaterialProvider = ({ children }) => {
  const [groupOrders, setGroupOrders] = useState([]);
  const [sfgData, setSfgData] = useState([]);
  const [error, setError] = useState(null);
  const [alerts,setAlerts] = useState([])
  const [routeId, setRouteId] = useState([]);





  
  const handleClose = ()=>{
    setAlerts([])
  }

  const setAlertsApp = (error) => {
    setAlerts(error);
  };


  
  const [selectedFilters, setSelectedFilters] = useState({
    gsm: '',
    bf: '',
    color: '',
    deckle: '',
    rawMeterial: '',
  });

  const fetchReels = async (params) => {
    try {
      const formattedParams = {
        gsm: params?.gsm || '',
        bf: params?.bf || '',
        color: params?.color || '',
        deckle: params?.deckle || ''
      };
      
      const response = await productionApi.getReelsInRawMeterial(formattedParams);
      if (response) {
        setSfgData(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
      setError(error?.response?.data?.message || 'Failed to fetch reels data');
    }
  };

  const fetchWorkOrders = async () => {
    try {
      let response;
      if (routeId.length > 0) {
        response = await productionApi.getGroupInRawmeterialByIds(routeId);
        // The API now returns an array of groups
        const groups = response?.data?.data || [];
        const groupsWithHistory = groups.map(group => ({
          ...group,
          history: {
            inventory_id: group.id,
            qty: group.allocated_Qty || 0
          }
        }));
        setGroupOrders(groupsWithHistory);
      } else {
        response = await productionApi.getProductionGroups();
        const groupsWithHistory = response?.data?.data.map(group => ({
          ...group,
          history: {
            inventory_id: group.id,
            qty: group.allocated_Qty || 0
          }
        }));
        setGroupOrders(groupsWithHistory);
      }
    } catch (error) {
      console.error("Error fetching work orders:", error);
      setError(error?.response?.data?.message || 'Failed to fetch work orders');
    }
  };


  // const fetchWorkOrders = async () => {
  //   try {
  //     const response = await productionApi.getProductionGroups();
  //     setGroupOrders(response?.data?.data);
  //   } catch (error) {
  //     console.error("Error fetching work orders:", error);
  //     setError(error?.response?.data?.message || 'Failed to fetch work orders');
  //   }
  // };

  const handleFilterChange = async (filterName, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: value
    };
    
    setSelectedFilters(newFilters);
    await fetchReels(newFilters); // Pass the new filters directly
  };


  const getData = async () => {
    // Force a fresh fetch with current filters
    await fetchReels(selectedFilters);
    await fetchWorkOrders();
  }

  const refreshData = async () => {
    // Reset all filters to empty strings
    const clearedFilters = {
      gsm: '',
      bf: '',
      color: '',
      deckle: '',
      rawMeterial: '',
    };
    setSelectedFilters(clearedFilters);
    
    // Fetch fresh data with cleared filters
    await fetchReels(clearedFilters);
    // await fetchWorkOrders();
  };

  // useEffect(() => {
  //   if (window.location.pathname.includes('AllocateRM')) {
  //     fetchWorkOrders();
  //   }
  // }, [routeId]);




  const value = {
    groupOrders,
    sfgData,
    error,
    selectedFilters,
    alerts,
    setGroupOrders,
    handleFilterChange,
    fetchWorkOrders,
    fetchReels,
    getData,
    refreshData,
    setAlertsApp,
    handleClose,
    setRouteId,
    routeId
  };

  return (
    <RawMaterialContext.Provider value={value}>
      {children}
    </RawMaterialContext.Provider>
  );
};
