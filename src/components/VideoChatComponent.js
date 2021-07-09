import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import MicIcon from "@material-ui/icons/MicNone";
import MicOffIcon from "@material-ui/icons/MicOffOutlined";
import VideocamIcon from "@material-ui/icons/VideocamOutlined";
import VideocamOffIcon from "@material-ui/icons/VideocamOffOutlined";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VisibilityIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOffOutlined";

import { Tooltip, Button } from "@material-ui/core";
import { apiKey, sessionId, token } from "./constants";
import {
  toggleAudio,
  toggleVideo,
  toggleAudioSubscription,
  toggleVideoSubscription,
  initializeSession,
  stopStreaming,
} from "./VonageVideoAPIIntegration";
import "./VideoChatComponent.scss";

function VideoChatComponent() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioSubscribed, setIsAudioSubscribed] = useState(true);
  const [isVideoSubscribed, setIsVideoSubscribed] = useState(true);
  const [isStreamSubscribed, setIsStreamSubscribed] = useState(false);
  const isSubscribed = useSelector(
    (state) => state.videoChat.isStreamSubscribed
  );

  useEffect(() => {
    isInterviewStarted
      ? initializeSession(apiKey, sessionId, token)
      : stopStreaming();
  }, [isInterviewStarted]);

  useEffect(() => {
    setIsStreamSubscribed(isSubscribed);
  }, [isSubscribed]);

  const onToggleAudio = (action) => {
    setIsAudioEnabled(action);
    toggleAudio(action);
  };
  const onToggleVideo = (action) => {
    setIsVideoEnabled(action);
    toggleVideo(action);
  };
  const onToggleAudioSubscription = (action) => {
    setIsAudioSubscribed(action);
    toggleAudioSubscription(action);
  };
  const onToggleVideoSubscription = (action) => {
    setIsVideoSubscribed(action);
    toggleVideoSubscription(action);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    iconRoot: {
      textAlign: 'center'
    }
  }));

  const classes = useStyles();

  const renderToolbar = () => {
    return (
      <>
        {isInterviewStarted && (
          <div className="video-toolbar">

            {isAudioEnabled ? (
              <Tooltip title="mic on">
                <Fab size="small" style={{marginRight:10, backgroundColor: '#565656'}}>
                  <Button>
                  <MicIcon classes={{root: classes.iconRoot}}
                    onClick={() => onToggleAudio(false)}
                    className="on-icon">
                  </MicIcon>
                  </Button>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="mic off">
                <Fab size="small" style={{marginRight:10, backgroundColor: '#565656'}}>
                  <Button color="#616161">
                  <MicOffIcon classes={{root: classes.iconRoot}}
                    onClick={() => onToggleAudio(true)}
                    className="off-icon">
                  </MicOffIcon>
                  </Button>
                </Fab>
              </Tooltip>
            )}
            {isVideoEnabled ? (
              <Tooltip title="camera on">
                <Fab size="small" color="#36454f" style={{marginRight:10, backgroundColor: '#565656'}}>
                  <Button>
                  <VideocamIcon classes={{root: classes.iconRoot}}
                    onClick={() => onToggleVideo(false)}
                    className="on-icon">
                  </VideocamIcon>
                  </Button>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="camera off">
                <Fab size="small" color="#36454f" style={{marginRight:10, backgroundColor: '#565656'}}>
                  <Button>
                  <VideocamOffIcon classes={{root: classes.iconRoot}}
                    onClick={() => onToggleVideo(true)}
                    className="off-icon">
                  </VideocamOffIcon>
                  </Button>
                </Fab>
              </Tooltip>
            )}

            {isStreamSubscribed && (
              <>
                {isAudioSubscribed ? (
                  <Tooltip title="sound on">
                    <Fab size="small" color="#36454f" style={{marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VolumeUpIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleAudioSubscription(false)}
                        className="on-icon">
                        </VolumeUpIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="sound off">
                    <Fab size="small" color="#36454f" style={{marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VolumeOffIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleAudioSubscription(true)}
                        className="off-icon">
                        </VolumeOffIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                )}
                {isVideoSubscribed ? (
                  <Tooltip title="screen on">
                    <Fab size="small" color="#36454f" style={{marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VisibilityIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleVideoSubscription(false)}
                        className="on-icon">
                        </VisibilityIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="screen off">
                    <Fab size="small" color="#36454f" style={{marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VisibilityOffIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleVideoSubscription(true)}
                        className="off-icon">
                        </VisibilityOffIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className='actions-btns'>
      <Button
        onClick={() => setIsInterviewStarted(true)}
        disabled={isInterviewStarted}
        color='primary'
        variant="contained"
      >
        Start chat
      </Button>
      <Button
        onClick={() => setIsInterviewStarted(false)}
        disabled={!isInterviewStarted}
        color='secondary'
        variant="contained"
      >
        Finish chat
      </Button>
      </div>
      <div className="video-container">
        <div
          id="subscriber"
          className={`${
            isStreamSubscribed ? "main-video" : "additional-video"
          }`}
        >
          {isStreamSubscribed && renderToolbar()}
        </div>
        <div
          id="publisher"
          className={`${
            isStreamSubscribed ? "additional-video" : "main-video"
          }`}
        >
          {!isStreamSubscribed && renderToolbar()}
        </div>
      </div>
    </>
  );
}

export default VideoChatComponent;
