import React from 'react';
import { useActiveStepValue, usePinsValue } from "../context";
import { useSelector } from "react-redux";



export default const Loading = (props) => {
    //require isReady and finishLoading functions, and we call it by props.isReady
    //isReady: send a get request - ENTEREDROOM(vonage api sessionid)
    //once isReady returns true, run finishLoading
    const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();
    const session = useSelector(state => state.session);

    return (
        boooooo
    )
}