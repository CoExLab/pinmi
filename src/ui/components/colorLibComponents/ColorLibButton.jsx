import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CallEndIcon from '@material-ui/icons/CallEnd';

const ColorLibButton = withStyles(theme => ({
  root: {
    /* sizeMedium */ borderRadius: '35px',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.5',
    padding: '6px 39px',
    textTransform: 'none',
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

/* Commony Used Variations */
export const ColorLibNextButton = props => <ColorLibButton endIcon={<ArrowForwardIosIcon />} {...props} />;

export const ColorLibBackButton = props => <ColorLibButton startIcon={<ArrowBackIosIcon />} {...props} />;

export const ColorLibCallEndButton = props => {
  const CallEndButton = withStyles({
    root: {
      backgroundColor: '#DB0000',
      color: 'white',
      opacity: '80%',
      '&:hover': {
        backgroundColor: '#DB0000',
        opacity: '100%',
      },
    },
  })(ColorLibButton);
  return <CallEndButton {...props} startIcon={<CallEndIcon />} />;
};

export const ColorLibGrayNextButton = props => {
  const GrayNextButton = withStyles({
    root: {
      backgroundColor: 'black',
      color: 'white',
      opacity: '80%',
      '&:hover': {
        backgroundColor: 'black',
        opacity: '100%',
      },
    },
  })(ColorLibNextButton);
  return <GrayNextButton {...props} />;
};

/* Examples for commonly used buttons */
export const ColorLibButtonDemo = () => (
  <div>
    <div>
      <font size="+2">
        <b>Buttons</b>
      </font>
    </div>

    <br />

    <div>
      <ColorLibButton variant="contained" size="large">
        Big Required Button
      </ColorLibButton>
      <ColorLibBackButton variant="contained" size="large">
        Previous
      </ColorLibBackButton>
      <ColorLibNextButton variant="contained" size="large">
        Next
      </ColorLibNextButton>
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
      <ColorLibBackButton variant="contained" size="medium">
        Previous
      </ColorLibBackButton>
      <ColorLibNextButton variant="contained" size="medium">
        Next
      </ColorLibNextButton>
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
      <ColorLibBackButton variant="contained" size="small">
        Previous
      </ColorLibBackButton>
      <ColorLibNextButton variant="contained" size="small">
        Next
      </ColorLibNextButton>
    </div>

    <br />

    <div>
      <ColorLibButton variant="outlined" size="small">
        Small Optional Button
      </ColorLibButton>
    </div>

    <br />

    <div>
      <ColorLibCallEndButton>End Call</ColorLibCallEndButton>
    </div>

    <br />

    <div>
      <ColorLibGrayNextButton>Gray Next</ColorLibGrayNextButton>
    </div>
  </div>
);

export default ColorLibButton;
