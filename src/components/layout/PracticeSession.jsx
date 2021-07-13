import React, {useState} from 'react';
import VideoChatComponent from "../VideoChatComponent.js";

const PracticeSession = () => {
    const [room, setRoom] = useState("hellooo");
    const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");

    return (  
        <div>
            <h1> Practice Session </h1>
            <button onClick = 
            {() => {fetchServerRes(setApiKey, setSessionId, setToken, baseURL)}}
            >Click me for a new session token</button>
            <h1>apiKeys: {apiKey}</h1>
            <h1>sessionId: {sessionId}</h1>
            <h1>token: {token}</h1>
            
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token}/>
        </div>
    );
}

const fetchServerRes = (setApiKey, setSessionId, setToken, baseURL) => {
    fetch(baseURL).then(function(res) {
        return res.json()
      }).then(function(res) {
        setApiKey(res.apiKey);
        setSessionId(res.sessionId);
        setToken(res.token);
        //initializeSession();
      }).catch((error) => {console.log(error)});
}


export default PracticeSession;