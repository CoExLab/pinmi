import React, {useState, useEffect} from 'react';
import VideoChatComponent from "../../VideoChatComponent.js";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//context
import { useSessionValue , useUserModeValue } from "../../../context";

const Session = () => {
    //var isRecording = null;
    const [open, setOpen] = React.useState(true);
    const { userMode } = useUserModeValue();

    const checkIsArchiveHost = () => {
        console.log("check is recording ran");
        if (userMode == "Interviewer"){
            console.log("isRecording from check is rec");
            return true;
        }
        else{
            console.log("not recording from check is rec");
            return false;
        }
    }


    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0,0);
    }, [open]);

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
            <VideoChatComponent isArchiveHost = {checkIsArchiveHost()}/>
        </div>
    );
}

export default Session;