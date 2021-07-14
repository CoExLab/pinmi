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

export const UserModeContext = createContext();
export const UserModeProvider = ({children}) => {
    const [userMode, setUserMode] = useState("");

    return  (
        <UserModeContext.Provider value = {{userMode, setUserMode}}>
            {children}
        </UserModeContext.Provider>
    )
}
export const useUserModeValue = () => useContext(UserModeContext);

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
  // const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  // const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  // const [token, setToken] = useState("YOUR_TOKEN");
  const [mediaUrl, setMediaUrl] = useState("MEDIA_BLOB");
  const [mediaDuration, setMediaDuration] = useState("MEDIA_BLOB");
  return (
    <SessionContext.Provider value={{mediaUrl, setMediaUrl, mediaDuration, setMediaDuration}}>
      {children}
    </SessionContext.Provider>
  );
};
export const useSessionValue = () => useContext(SessionContext);