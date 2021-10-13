import React, { useState, createContext, useContext } from "react";
import { usePins } from '../hooks/index';
import { generatePushId} from "../helper";

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
    const [userID, setUserID] = useState("");

    return  (
        <UserModeContext.Provider value = {{userMode, setUserMode, userID, setUserID}}>
            {children}
        </UserModeContext.Provider>
    )
}
export const useUserModeValue = () => useContext(UserModeContext);

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
const newDoc = generatePushId();

export const SessionProvider = ({ children }) => {
  // const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  // const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  // const [token, setToken] = useState("YOUR_TOKEN");
  const [mediaUrl, setMediaUrl] = useState("https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg");
  const [mediaDuration, setMediaDuration] = useState("MEDIA_BLOB");
  const [button, setButton] = useState(false);
  const [sessionID, setSessionID] = useState(newDoc);
  return (
    <SessionContext.Provider value={{sessionID, mediaUrl, setMediaUrl, mediaDuration, setMediaDuration, button, setButton}}>
      {children}
    </SessionContext.Provider>
  );
};
export const useSessionValue = () => useContext(SessionContext);

// const tempPins = usePins(newDoc);
export const PinsContext = createContext();
const pins = [];
export const PinsProvider = ({ children }) => {
  return (
    <PinsContext.Provider value={{ pins}}>
      {children}
    </PinsContext.Provider>
  );
};
export const usePinsValue = () => useContext(PinsContext);
