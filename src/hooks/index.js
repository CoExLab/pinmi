import { firebase } from "../hooks/firebase";
import { useState, useEffect } from 'react';

// pin hook

export const usePins = () => {
    const [pins, setPins] = useState([]);
  
    useEffect(() => {
      let unsubscribe = firebase
        .firestore()
        .collection("Pins")
        .orderBy("pinTime")

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
