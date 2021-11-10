import React, { useState, useRef, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { formatTime } from "../../../helper/index";
import { Box, Grid, Paper, Typography, Container } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import {
  ColorLibNextButton,
  ColorLibBackButton,
} from "../../layout/ColorLibComponents/ColorLibButton";
import ColorLibPaper from "../../layout/ColorLibComponents/ColorLibPaper";
import ColorLibTextField from "../../layout/ColorLibComponents/ColorLibTextField";
import MISkillsSheet from "../../layout/MISkillsSheet";

// firebase hook
import { usePins } from "../../../hooks/index";
import { firebase } from "../../../hooks/firebase";

//context
import {
  useSessionValue,
  useUserModeValue,
  usePinsValue,
  PinsProvider,
} from "../../../context";
import { format } from "url";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      width: "100%",
      "&:first-child": {
        marginRight: "8px",
      },
      "&:last-child": {
        marginLeft: "8px",
      },
    },
  },
  grid: {
    "& .MuiGrid-item": {
      display: "inline-grid",
    },
    "& .MuiGrid-grid-sm-4": {
      position: "relative",
      margin: "8px",
      maxWidth: "calc(33.333333% - 8px)",
      "& .MuiPaper-root": {
        position: "absolute",
        top: 0,
        bottom: 0,
        overflowY: "scroll",
      },
    },
    "& .MuiGrid-grid-sm-8": {
      maxWidth: "calc(66.666667% - 8px)",
    },
  },
}));

const SinglePlayerComment = () => {
  // user mode switcher
  const { userMode } = useUserModeValue();

  const classes = useStyles();

  //creating a refernce for TextField Components
  const textValueRef = useRef("");

  const [text, setText] = useState("");

  return (
      <div style={{marginBottom:"15px"}}>
        <ColorLibPaper elevation={1}>
          <ColorLibTextField
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={text}
            inputRef={textValueRef}
            onChange={() =>
              setText(textValueRef.current.value)
            }
          />
        </ColorLibPaper>
      </div>
  );
};

export default SinglePlayerComment;
