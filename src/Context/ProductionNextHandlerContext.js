import React, { useRef } from "react";

const NextHandlerContext = React.createContext();

export const useNextHandler = () => React.useContext(NextHandlerContext);

export const NextHandlerProvider = ({ children }) => {
  const nextHandlerRef = useRef(() => Promise.resolve(false));

  const registerNextHandler = (fn) => {
    nextHandlerRef.current = fn;
  };

  const triggerNext = () => {
    return nextHandlerRef.current();
  };
  
  return (
    <NextHandlerContext.Provider value={{ registerNextHandler, triggerNext }}>
      {children}
    </NextHandlerContext.Provider>
  );
};
