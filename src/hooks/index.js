import { firebase } from "../hooks/firebase";
import { useState, useEffect } from 'react';

export const usePins = () => {
    const [pins, setPins] = useState([]);
  
    useEffect(() => {
      firebase
        .firestore()
        .collection("PINS")
        .orderBy("PinTime")
        .get()
        .then((snapshot) => {
          const allPins = snapshot.docs.map((pin) => ({
            ...pin.data(),
            docId: pin.id,
        }));
  
          if (JSON.stringify(allPins) !== JSON.stringify(pins)) {
            setPins(allPins);
          }
        });
    }, [pins]);
  
    return { pins, setPins };
};
  


// export const usePins = (curSessionID, curUserID) => {
//     const [pins, setPins] = useState([]);

//     useEffect(() => {
//         let pinsData = firebase
//             .firestore()
//             .collection("PINS")
//             .where("UserID", "==", curUserID)
//             .where("SessionID", "==", curSessionID);

//             pinsData = pinsData.onSnapshot((snapshot) => {
//             const newPins = snapshot.docs.map((pin) => ({
//                 id: pin.id,
//                 ...pin.data(),
//             }));
//         });

//         return () => pinsData();
//     }, [curSessionID])
//     return { pins };
// };