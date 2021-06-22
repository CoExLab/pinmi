import React, { useState, createContext, useContext } from "react";
import { usePins } from '../hooks/index';

export const ActiveStepContext = createContext();
export const ActiveStepProvider = ({children}) => {
    const [curActiveStep, setCurActiveStep] = useState(0);

    return  (
        <ActiveStepContext.Provider value = {{curActiveStep, setCurActiveStep}}>
            {children}
        </ActiveStepContext.Provider>
    )
}
export const useActiveStepValue = () => useContext(ActiveStepContext);


export const PinsContext = createContext();
export const PinsProvider = ({ children }) => {
  const { pins, setPins } = usePins();
  return (
    <PinsContext.Provider value={{ pins, setPins }}>
      {children}
    </PinsContext.Provider>
  );
};
export const usePinsValue = () => useContext(PinsContext);
