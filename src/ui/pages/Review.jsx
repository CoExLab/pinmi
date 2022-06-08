import { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar';

import { firebase } from '../../storage/firebase';

import Landing from './Review/Landing';
import Collaboration from './Review/Collaboration';

import { useUser } from '../../contexts/userContext';

const useStyles = makeStyles(theme => ({
  welcome_container: {
    padding: '50px 68px 50px 68px',
    textAlign: 'center',
  },
  welcome_intro: {
    color: theme.palette.teal.dark,
  },
  welcome_definition: {
    color: theme.palette.gray.main,
    fontStyle: 'italic',
    padding: '10px 20px 10px 20px',
  },
  button_wrapper: {
    marginBottom: '68px',
    textAlign: 'center',
  },
  session_container: {
    padding: '25px 34px 25px 34px',
    textAlign: 'center',
  },
}));

//component to switch between Review Username Page and Review Notes Page
const Review = () => {
  const classes = useStyles();

  const { user: firebaseUser } = useUser();

  const [page, setPage] = useState(0);
  const [reviewSessionID, setReviewSessionID] = useState();
  const [userName, setUserName] = useState();
  const [userMode, setUserMode] = useState();
  const [pins, setPins] = useState([]);
  const [mediaUrl, setMediaUrl] = useState();
  const [mediaDuration, setMediaDuration] = useState();
  const [reviewUrl, setReviewUrl] = useState();

  //load archive data based on username and session id
  const loadMedia = async s => {
    await firebase
      .firestore()
      .collection('sessions_by_usernames')
      .doc(userName)
      .collection('sessions')
      .doc(s)
      .get()
      .then(doc => {
        setMediaDuration(doc.data().archiveData.duration);
        setMediaUrl(doc.data().archiveData.url);
        setReviewUrl(doc.data().archiveData.reviewURL);
      });
  };

  //load all pins based on username and session id
  const loadPins = async s => {
    await firebase
      .firestore()
      .collection('sessions_by_usernames')
      .doc(userName)
      .collection('sessions')
      .doc(s)
      .collection('pins')
      .get()
      .then(doc => {
        var tmpPins = doc.docs.map(d => d.data());
        tmpPins.sort((a, b) => a.pinTime - b.pinTime);
        setPins(tmpPins);
        setPage(1);
      });
  };

  //load user mode based on username and session id
  const loadUserMode = async s => {
    await firebase
      .firestore()
      .collection('sessions_by_usernames')
      .doc(userName)
      .collection('sessions')
      .doc(s)
      .get()
      .then(doc => {
        setUserMode({
          userMode: doc.data().caller_name == userName ? 'caller' : 'callee',
        });
      });
  };

  useEffect(() => {
    if (reviewSessionID) {
      loadUserMode(reviewSessionID);
      loadPins(reviewSessionID);
      loadMedia(reviewSessionID);
    }
  }, [reviewSessionID]);

  function getConditionalContent(page) {
    switch (page) {
      case 0:
        return (
          <Landing setReviewSessionID={setReviewSessionID} setUserName={setUserName} firebaseUser={firebaseUser} />
        );
      case 1:
        return (
          <Collaboration
            reviewSessionID={reviewSessionID}
            username={userName}
            user={userMode}
            pins={pins}
            mediaUrl={mediaUrl}
            mediaDuration={mediaDuration}
            reviewUrl={reviewUrl}
          />
        );
      default:
        return <div>Unknown</div>;
    }
  }

  return (
    <section>
      <Navbar />
      {getConditionalContent(page)}
    </section>
  );
};

export default Review;
