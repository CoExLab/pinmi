import { makeStyles, withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const ColorLibPaper = withStyles((theme) => ({
  root: {
  },
  elevation0: {
    // For Self Reflection Page
    backgroundColor: theme.palette.teal.lighter,
    borderRadius: '30px',
    boxShadow: 'none',
    padding: '50px 80px',
  },
  elevation1: {
    // For Transcript, Notetaking, and ..
    backgroundColor: theme.palette.teal.lighter,
    borderRadius: '4px',
    boxShadow: 'none',
    padding: '30px',
  },
  elevation2: {
    // For Poppers.
    backgroundColor: 'white',
    border: 'solid 1px ' + theme.palette.teal.lighter,
    padding: '6px 10px 6px 20px',
    marginLeft: '-10px',
  },
  elevation9: {
    // For Refresher Page final answer preview
    borderRadius: '10px',
    boxShadow: '0px 0px 9px rgba(51, 126, 146, 0.15)',
    padding: '10px 20px',
  },
}))(Paper);

export default ColorLibPaper;