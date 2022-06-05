import { withStyles } from '@material-ui/core/styles';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const ColorLibToggleButton = withStyles(theme => ({
  root: {
    /* sizeMedium */ backgroundColor: theme.palette.teal.lighter,
    borderRadius: '35px',
    border: '2px solid !important',
    borderColor: theme.palette.teal.main + '!important',
    color: theme.palette.gray.dark,
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.5',
    padding: '6px 27px',
    textTransform: 'none',
  },
  sizeLarge: {
    fontSize: '25px',
    fontWeight: '600',
    lineHeight: '37.5px',
  },
  sizeSmall: {
    fontWeight: '400',
    lineHeight: '22px',
  },
  selected: {
    backgroundColor: theme.palette.teal.light + '!important',
    borderWidth: '4px !important',
    color: theme.palette.gray.dark + '!important',
  },
}))(ToggleButton);

export default ColorLibToggleButton;

export const ColorLibToggleButtonGroup = withStyles(theme => ({
  groupedHorizontal: {
    borderRadius: '35px !important',
    '&:not(:first-child)': {
      marginLeft: '15px',
    },
  },
}))(ToggleButtonGroup);
