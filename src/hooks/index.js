import { firebase } from "../hooks/firebase";
import { useState, useEffect } from 'react';

export const usePins = () => {
    const [pins, setPins] = useState([]);
  
    useEffect(() => {
      let unsubscribe = firebase
        .firestore()
        .collection("Pins")
        .orderBy("pinTime")

        unsubscribe = unsubscribe.onSnapshot((snapshot) => {
          const allPins = snapshot.docs.map((pin) => ({
            ...pin.data(),
            docId: pin.id,
            }));
          if (JSON.stringify(allPins) !== JSON.stringify(pins)) {
            setPins(allPins);
          }
        });
        return () => unsubscribe();
    }, [pins]);
  
    return { pins, setPins };
};