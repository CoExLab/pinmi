import React, { useEffect, useState } from 'react';
import { useActiveStepValue, usePinsValue } from '../../../storage/context';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  welcome_intro: {
    color: theme.palette.teal.dark,
  },
}));

export default function Loading(props) {
  //require isReady and finishLoading functions, and we call it by props.isReady
  //isReady: send a get request - ENTEREDROOM(vonage api sessionid)
  //once isReady returns true, run finishLoading

  const classes = useStyles();
  const [roomEmpty, setRoomEmpty] = useState(false);
  const [archiveReady, setArchiveReady] = useState(false);

  useEffect(async () => {
    const checkRoom = async () => {
      try {
        const res = await props.isRoomEmpty();
        console.log('RES: ', res);
        if (res) {
          setRoomEmpty(res);
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkRoom();
  }, []);

  useEffect(async () => {
    const checkArchive = async () => {
      try {
        const res = await props.isArchiveReady();
        console.log('RES: ', res);
        if (res) {
          setArchiveReady(res);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (roomEmpty) {
      checkArchive();
    }
  }, [roomEmpty]);

  useEffect(async () => {
    if (archiveReady) {
      //run finishLoading function
      await props.finishLoading();
      //reset ready for future uses
      setArchiveReady(false);
    }
  }, [archiveReady]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 10 }}>
      <Typography variant="h1" className={classes.welcome_intro}>
        Loading Self-Reflection Prep
      </Typography>
      <Box sx={{ p: 2 }}>
        <CircularProgress />
      </Box>
    </Box>
  );
}
