import React, {useState, useEffect} from 'react';
import VideoChatComponent from "../../VideoChatComponent.js";
import { useReactMediaRecorder } from "react-media-recorder";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//context
import { useSessionValue } from "../../../context";

const Session = () => {
    const [room, setRoom] = useState("hellooo");
    const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");
    const [readyMessage, setReadyMessage] = useState("video is not ready");
    const isRecording = true;
    const {status, startRecording, stopRecording, mediaBlobUrl} 
    =useReactMediaRecorder({ video: false, audio: true });
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    //setting the global mediaUrl context to mediaBlobUrl to be played in AudioReview
    const {setMediaUrl} = useSessionValue();
    useEffect(() => {
        setMediaUrl(mediaBlobUrl);
        window.scrollTo(0,0);
    }, [mediaBlobUrl]);

    return (  
        <div>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"What is pinning for? "}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>Click on the pin to create time marks of</p>
                        <ul>
                            <li>situations where you struggled to use MI</li>
                            <li>instances of effective MI use</li>
                        </ul>
                        <p>Your peer will also be pinning, and you will review and discuss all pins after the client session.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Join Now
                    </Button>
                </DialogActions>
            </Dialog>
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/>
        </div>
    );
}


export default Session;