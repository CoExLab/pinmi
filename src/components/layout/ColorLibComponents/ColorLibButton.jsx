import {withStyles} from '@material-ui/core/styles';

import Button, { ButtonProps } from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const ColorLibButton = withStyles((theme) => ({
  root: { /* sizeMedium */ 
    borderRadius: '35px',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.5',
    padding: '6px 39px',
    textTransform: 'none'
  },
  sizeLarge: {
    fontSize: '25px',
    fontWeight: '600',
    lineHeight: '37.5px',
  },
  sizeSmall: {
    fontWeight: '400',
    lineHeight: 'normal',
  },
  contained: {
    backgroundColor: theme.palette.teal.main,
    boxShadow: '0px 6px 8px 0px rgb(51 126 146 / 25%)',
    color: 'white',
  }, 
  outlined: {
    backgroundColor: theme.palette.teal.lighter,
    borderWidth: '0',
    boxShadow: 'inset 0px 0px 0px 2PX #337E92',
    // try to make the border inward
    color: theme.palette.teal.main,
  },
}))(Button);

/* Examples for commonly used buttons */
export const ColorLibButtonDemo = () => (
  <div>
    <div>
      <font size='+2'><b>Buttons</b></font>
    </div>

    <br />

    <div>
      <ColorLibButton variant="contained" size="large">
        Big Required Button
      </ColorLibButton>
      <ColorLibButton variant="contained" size="large" startIcon={<ArrowBackIosIcon />}>
        Previous
      </ColorLibButton>
      <ColorLibButton variant="contained" size="large" endIcon={<ArrowForwardIosIcon />}>
        Next
      </ColorLibButton>
    </div>
    
    <br />

    <div>
      <ColorLibButton variant="outlined" size="large">
        Big Optional Button
      </ColorLibButton>
    </div>
    
    <br />

    <div>
      <ColorLibButton variant="contained" size="medium">
        Medium Required Button
      </ColorLibButton>
      <ColorLibButton variant="contained" size="medium" startIcon={<ArrowBackIosIcon />}>
        Previous
      </ColorLibButton>
      <ColorLibButton variant="contained" size="medium" endIcon={<ArrowForwardIosIcon />}>
        Next
      </ColorLibButton>
    </div>
    
    <br />

    <div>
      <ColorLibButton variant="outlined" size="medium">
        Medium Optional Button
      </ColorLibButton>
    </div>
    
    <br />

    <div>
      <ColorLibButton variant="contained" size="small">
        Small Required Button
      </ColorLibButton>
      <ColorLibButton variant="contained" size="small" startIcon={<ArrowBackIosIcon />}>
        Previous
      </ColorLibButton>
      <ColorLibButton variant="contained" size="small" endIcon={<ArrowForwardIosIcon />}>
        Next
      </ColorLibButton>
    </div>
    
    <br />

    <div>
      <ColorLibButton variant="outlined" size="small">
        Small Optional Button
      </ColorLibButton>
    </div>
  </div>
);

export default ColorLibButton;