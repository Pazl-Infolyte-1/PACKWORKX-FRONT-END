import React, { createContext, useContext, useEffect, useState } from "react";

const RawMaterialContext = createContext();

export const useRawMaterialContext = () => useContext(RawMaterialContext);

export const RawMaterialProvider = ({ children }) => {
  const [groupOrders, setGroupOrders] = useState([]);

  useEffect(()=>{
    groupOrders
  },[groupOrders])

  const value = {
    groupOrders,
    setGroupOrders,
  };

  return (
    <RawMaterialContext.Provider value={value}>
      {children}
    </RawMaterialContext.Provider>
  );
};
