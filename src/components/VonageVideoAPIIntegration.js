import { store } from "./Store";
import { handleSubscription } from "./Store";
import OT from "@opentok/client";
//import { startArchive } from "./VideoChatComponent";

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

let session, publisher, subscriber;

export function initializeSession(apiKey, sessionId, token, setArchive, isRecording) {
  session = OT.initSession(apiKey, sessionId);

  // Create a publisher
  publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      style: { buttonDisplayMode: "off" },
      width: "100%",
      height: "100%",
    },
    handleError
  );

  // Subscribing to stream
  session.on("streamCreated", function (event) {
    subscriber = session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        style: { buttonDisplayMode: "off" },
        width: "100%",
        height: "100%",
      },
      handleError
    );
    store.dispatch(handleSubscription(true));
  });

  session.on("connectionCreated", function (event) {
    console.log("The connection was created from"+ window.navigator.platform);
    if (isRecording){
      startArchive(sessionId, setArchive);
    }
  });

  // Do some action on destroying the stream
  session.on("streamDestroyed", function (event) {
    console.log("The Video chat has ended");
    store.dispatch(handleSubscription(false));
  });

  session.on('archiveStarted', function (event) {
    console.log('ARCHIVE-ID:', event.id);
    console.log('ARCHIVE STARTED');
  });

  session.on('archiveStopped', function () {
    console.log('ARCHIVE STOPPED');
  });

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}

export function stopStreaming() {
  session && session.unpublish(publisher);
}

// The following functions are used in functionality customization
export function toggleVideo(state) {
  publisher.publishVideo(state);
}
export function toggleAudio(state) {
  publisher.publishAudio(state);
}
export function toggleAudioSubscription(state) {
  subscriber.subscribeToAudio(state);
}
export function toggleVideoSubscription(state) {
  subscriber.subscribeToVideo(state);
}

const startArchive = async (sessionId, setArchiveData) => {
  //create json to send as the body for post
  const data = {
    sessionId: sessionId,
    resolution: '640x480',
    outputMode: 'composed',
    hasVideo: 'false',
  };
  //send post request to server 
  //THIS IS HARDCODED, SO REMEMBER TO FIX IT
  await fetch("https://pin-mi-node-server.herokuapp.com/" + 'archive/start', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(data)
  })
  //get response from the post request, 
  //and turn it into json so you can access data from it
  .then(response => response.json())
  .then((archiveData) => {
    console.log(archiveData);
    setArchiveData(archiveData);
  })
  .catch((error) => {console.log(error)})
}
