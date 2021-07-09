import React, {useState} from 'react';
import VideoChatComponent from "../VideoChatComponent.js";

const PracticeSession = () => {
    const [room, setRoom] = useState("hello");
    const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");
    const [readyMessage, setReadyMessage] = useState("video is not ready");

    const fetchServerRes = (setApiKey, setSessionId, setToken, baseURL) => {
        setReadyMessage("preparing video cal for you now...");
        fetch(baseURL).then(function(res) {
            return res.json()
          }).then(function(res) {
            console.log("got server info");
            setApiKey(res.apiKey);
            setSessionId(res.sessionId);
            setToken(res.token);
            setReadyMessage("video call is ready now");
          }).catch((error) => {console.log(error)});
    }

    return (  
        <div>
            <h1> Practice Session </h1>
            <button onClick = 
            {() => {fetchServerRes(setApiKey, setSessionId, setToken, baseURL)}}
            >Click me for getting video call ready</button>
            {/* <h1>apiKeys: {apiKey}</h1>
            <h1>sessionId: {sessionId}</h1>
            <h1>token: {token}</h1> */}
            <h3>{readyMessage} </h3>
            
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token}/>
        </div>
    );
}


export default PracticeSession;