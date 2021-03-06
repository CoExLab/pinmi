import React, { useState, createContext, useContext } from 'react';

export const ActiveStepContext = createContext();
export const ActiveStepProvider = ({ children }) => {
  const [curActiveStep, setCurActiveStep] = useState(0);

  return (
    <ActiveStepContext.Provider value={{ curActiveStep, setCurActiveStep }}>{children}</ActiveStepContext.Provider>
  );
};
export const useActiveStepValue = () => useContext(ActiveStepContext);

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [mediaUrl, setMediaUrl] = useState('https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg');
  const [mediaDuration, setMediaDuration] = useState(0);
  const [button, setButton] = useState(false);
  //const [sessionID, setSessionID] = useState(tempNewDoc);
  const [vonageSessionID, setVonageSessionID] = useState('YOUR_SESSION_ID');
  const [token, setToken] = useState('YOUR_TOKEN');
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');

  return (
    <SessionContext.Provider
      value={{
        vonageSessionID,
        setVonageSessionID,
        token,
        setToken,
        apiKey,
        setApiKey,
        mediaUrl,
        setMediaUrl,
        mediaDuration,
        setMediaDuration,
        button,
        setButton,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
export const useSessionValue = () => useContext(SessionContext);

// const tempPins = usePins(newDoc);
export const PinsContext = createContext();
var pins = [];
export const PinsProvider = ({ children }) => {
  return <PinsContext.Provider value={{ pins }}>{children}</PinsContext.Provider>;
};
export const usePinsValue = () => useContext(PinsContext);
