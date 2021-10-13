import { makeStyles, withStyles } from "@material-ui/core/styles";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const SinglePlayerToggleButton = withStyles((theme) => ({
  root: {
    /* sizeMedium */ 
    backgroundColor: theme.palette.teal.lighter,
    borderRadius: "35px",
    border: "2px solid !important",
    borderColor: theme.palette.teal.main + "!important",
    color: theme.palette.teal.main,
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "1.5",
    padding: "6px 27px",
    textTransform: "none",
  },
  sizeLarge: {
    fontSize: "25px",
    fontWeight: "600",
    lineHeight: "37.5px",
  },
  sizeSmall: {
    fontWeight: "400",
    lineHeight: "22px",
  },
  selected: {
    backgroundColor: theme.palette.teal.main+ "!important",
    borderWidth: "4px !important",
    color: theme.palette.teal.lighter + "!important",
  },
}))(ToggleButton);

export default SinglePlayerToggleButton;

export const SinglePlayerToggleButtonGroup = ToggleButtonGroup;
