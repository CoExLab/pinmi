import { store } from "./Store";
import { handleSubscription, handleArchive, handleConnection } from "./Store";
import OT from "@opentok/client";

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

let session, publisher, subscriber;

export function initializeSession(apiKey, sessionId, token) {
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

  session.on("archiveStarted", function (event) {
    var archiveID = event.id;
    console.log("The archive has started: " + archiveID);
    store.dispatch(handleArchive({isStreamArchiving :true, archiveID: archiveID}));
  });

  session.on("archiveStopped", function (event) {
    //console.log("The archive has ended");
    var archiveID = event.id;
    store.dispatch(handleArchive({isStreamArchiving :false, archiveID: archiveID}));
  });

  // session.on("sessionDisconnected", function(event) {
  //   alert("The session disconnected. " + event.reason);
  // });
  
  // Do some action on destroying the stream
  session.on("streamDestroyed", function (event) {
    //console.log("The Video chat has ended");
    store.dispatch(handleSubscription(false));
  });

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
      store.dispatch(handleConnection(true))
    }
  });
}

export function stopStreaming() {
  session && session.unpublish(publisher);
  console.log(subscriber);

  // console.log("stopStreaming event called");

  // // then removing the event handler that automatically subscribes to new streams
  // session && session.off();

  // //var isSubscribed = store.getState().videoChat.isStreamSubscribed;

  // //if the client is subscribed to another stream, then end the subscription
  if (subscriber) {
    console.log("unsubscribing to subscriber");
    session.unsubscribe(subscriber);
    store.dispatch(handleSubscription(false));
  }
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