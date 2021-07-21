import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from "@material-ui/core/Slider";
import { Container } from '@material-ui/core';
import { formatTime } from '../helper/index'

import './SliderBar.css';

export default function SliderBar({maxValue, pinMarks, curValue, canClick}) {
  const [pinMarkList, setPinMarkList] = useState([]);
  
  const PrettoSlider = withStyles({
    root: {
      color: '#52af77',
      height: 8,    
      marginTop: 20,
      width: 990,
      marginLeft: 105,            
      '&.Mui-disabled': {
        color: '#52af77',
      },
    },    
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -18,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },      
      '&.Mui-disabled': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -18,
        marginLeft: -12,
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      marginTop: -8,
      height: 5,
      borderRadius: 0.5,
    },
    rail: {
      marginTop: -8,
      height: 5,
      borderRadius: 0.5,
    },
    mark: {
        backgroundColor: '#bfbfbf',
        height: 15,
        width: 8,
        marginTop: -10,
        marginLeft: -3,
      },    

    markLabel: {
      marginTop: -10,
      color: '#111111',
    },

  })(Slider);

  useEffect(() => {
    let tempList = [];
    for (let i = 0; i < pinMarks.length; i++) {
      tempList[i] = {"value":pinMarks[i], "label":formatTime(pinMarks[i])};
    }
    setPinMarkList(tempList); 
  },[pinMarks]);

  return (
    <Container className = "SliderbarContext">     
        <PrettoSlider className = "SliderbarOverlay"
            valueLabelDisplay="on" 
            aria-label="pretto slider" 
            defaultValue={0} 
            value={curValue}                
            min={0}
            max={maxValue}
            marks={pinMarkList} 
            valueLabelFormat = {(value) => formatTime(value)}
            disabled = {true}
        />
    </Container>
  );
}