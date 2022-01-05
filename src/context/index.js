import React, { useState, createContext, useContext } from "react";

export const ActiveStepContext = createContext();
export const ActiveStepProvider = ({ children }) => {
  const [curActiveStep, setCurActiveStep] = useState(0);

  return (
    <ActiveStepContext.Provider value={{ curActiveStep, setCurActiveStep }}>
      {children}
    </ActiveStepContext.Provider>
  );
};
export const useActiveStepValue = () => useContext(ActiveStepContext);

export const PlayerModeContext = createContext();
export const PlayerModeProvider = ({ children }) => {
  const [playerMode, setPlayerMode] = useState("singleplayer");

  return (
    <PlayerModeContext.Provider value={{ playerMode, setPlayerMode }}>
      {children}
    </PlayerModeContext.Provider>
  );
};
export const usePlayerModeValue = () => useContext(PlayerModeContext);

// export const SessionContext = createContext();
// export const SessionProvider = ({ children }) => {
//   const [apiKey, setApiKey] = useState("YOUR_API_KEY");
//   const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
//   const [token, setToken] = useState("YOUR_TOKEN");
//   return (
//     <SessionContext.Provider value={[apiKey, setApiKey, sessionId, setSessionId, token, setToken]}>
//       {children}
//     </SessionContext.Provider>
//   );
// };
// export const useSessionValue = () => useContext(SessionContext);

export const SessionContext = createContext();


export const SessionProvider = ({ children }) => {

  const [mediaUrl, setMediaUrl] = useState("https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg");
  const [mediaDuration, setMediaDuration] = useState(0);
  const [button, setButton] = useState(false);
  //const [sessionID, setSessionID] = useState(tempNewDoc);
  const [vonageSessionID, setVonageSessionID] = useState("YOUR_SESSION_ID");
  const [token, setToken] = useState("YOUR_TOKEN");
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");

  return (
    <SessionContext.Provider value={{vonageSessionID, setVonageSessionID, token, setToken, apiKey, setApiKey, mediaUrl, setMediaUrl, mediaDuration, setMediaDuration, button, setButton}}>
      {children}
    </SessionContext.Provider>
  );
};
export const useSessionValue = () => useContext(SessionContext);

// const tempPins = usePins(newDoc);
export const PinsContext = createContext();
var pins = [];
export const PinsProvider = ({ children }) => {
  return (
    <PinsContext.Provider value={{ pins }}>{children}</PinsContext.Provider>
  );
};
export const usePinsValue = () => useContext(PinsContext);

export const SinglePlayerPinsContext = createContext();
export const SinglePlayerPinsProvider = ({ children }) => {
  const [singlePlayerPins, setSinglePlayerPins] = useState([]);
  return (
    <SinglePlayerPinsContext.Provider
      value={{ singlePlayerPins, setSinglePlayerPins }}
    >
      {children}
    </SinglePlayerPinsContext.Provider>
  );
};
export const useSinglePlayerPinsValue = () =>
  useContext(SinglePlayerPinsContext);

export const SinglePlayerSessionContext = createContext();
export const SinglePlayerSessionProvider = ({ children }) => {
  const [singlePlayerSessionID, setSinglePlayerSessionID] = useState([]);

  return (
    <SinglePlayerSessionContext.Provider
      value={{ singlePlayerSessionID, setSinglePlayerSessionID }}
    >
      {children}
    </SinglePlayerSessionContext.Provider>
  );
};
export const useSinglePlayerSessionValue = () =>
  useContext(SinglePlayerSessionContext);
