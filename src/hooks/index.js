import { firebase } from "../hooks/firebase";
import { useState, useEffect } from 'react';
import { useSessionValue } from "../context";
// pin hook

export const usePins = () => {
    const [pins, setPins] = useState([]);
    const {sessionID} = useSessionValue();
    useEffect(() => {
      let unsubscribe = firebase
        .firestore()
        .collection("sessions")
        .doc(sessionID)
        .collection('pins')
        .orderBy("timestamp");

        // console.log("get data from firebase");
        unsubscribe = unsubscribe.onSnapshot((snapshot) => {
          const allPins = snapshot.docs.map((pin) => ({
            ...pin.data(),
            docId: pin.id,
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

export const useMediaURL = () => {
  const [mediaURL, setMediaURL] = useState("default");

  useEffect(() => {
    let ref = firebase
      .firestore()
      .collection("MediaURLs")
      .doc("test");

    var unsubscribe = ref.onSnapshot((doc) => {
      let recentURL = doc.data()
      console.log(recentURL);
    })
    return () => {
      unsubscribe()
    };
  })
  return {mediaURL, setMediaURL};
};



