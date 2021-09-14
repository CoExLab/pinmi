import { firebase } from "../hooks/firebase";
import { useState, useEffect } from 'react';
// pin hook

export const usePins = (sessionID) => {
    const [pins, setPins] = useState([]);
    useEffect(() => {
      let unsubscribe = firebase
        .firestore()
        .collection("sessions").doc(sessionID).collection("pins")
        // console.log("get data from firebase");
        unsubscribe = unsubscribe.onSnapshot((snapshot) => {
          const allPins = snapshot.docs.map((pin) => ({
            ...pin.data()            
          }));
          if (JSON.stringify(allPins) !== JSON.stringify(pins)) {
            setPins(allPins);
          }
        });
        return () => {
          unsubscribe();
        }
    }, [pins]);
  
    return { pins, setPins };
};

//mediaUrlHook
//have a mediaURL variable that is accessable to audioReview and VideoChatComponent
//Set mediaURL from host, and retrieve it from DB as participant
//

export const useMediaURL = (sessionID) => {
  const [mediaURL, setMediaURL] = useState("default");

  useEffect(() => {
    let ref = firebase
      .firestore()
      .collection("sessions").doc(sessionID)

    var unsubscribe = ref.onSnapshot((doc) => {
      let recentURL = doc.data().media_url
      console.log("recentURL: " + recentURL);
    })
    return () => {
      unsubscribe()
    };
  });
  return {mediaURL, setMediaURL};
};



