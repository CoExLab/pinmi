import { store } from "./Store";
import { handleSubscription } from "./Store";
import OT from "@opentok/client";

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

let session, publisher, subscriber;

export function initializeSession(apiKey, sessionId, token, isFirstSession) {
  //if a session has not been created create it. 
  //if it has been created, skip creating a new one
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
    console.log("streamCreated")
    store.dispatch(handleSubscription(true));
  });

  // Do some action on destroying the stream
  session.on("streamDestroyed", function (event) {
    console.log("Someones stream has been destroyed");
    store.dispatch(handleSubscription(false));
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
  //first unpublishing the stream (removing it from DOM, and not sending it out to others)
  session && session.unpublish(publisher);

  // console.log("stopStreaming event called");
  
  // // then removing the event handler that automatically subscribes to new streams
  // session && session.off();

  // //var isSubscribed = store.getState().videoChat.isStreamSubscribed;

  // // //if the client is subscribed to another stream, then end the subscription
  // if (subscriber){
  //   console.log("unsubscribing to subscriber");
  //   session.unsubscribe(subscriber);
  //   store.dispatch(handleSubscription(false));
  // }
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
