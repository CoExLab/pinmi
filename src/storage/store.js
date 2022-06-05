import { createStore, combineReducers } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

// Types
const HANDLE_SUBSCRIPTION = 'HANDLE_SUBSCRIPTION';
const HANDLE_CONNECTION = 'HANDLE_CONNECTION';
const HANDLE_ARCHIVE = 'HANDLE_ARCHIVE';

// Actions
export const handleSubscription = payload => ({
  type: HANDLE_SUBSCRIPTION,
  payload,
});
export const handleConnection = payload => ({
  type: HANDLE_CONNECTION,
  payload,
});
export const handleArchive = payload => ({
  type: HANDLE_ARCHIVE,
  payload,
});

const defaultState = {
  isStreamSubscribed: false,
  isSessionConnected: false,
  isStreamArchiving: false,
};

// Reducers
const subscriberReducer = (state = defaultState, action) => {
  switch (action.type) {
    case HANDLE_SUBSCRIPTION:
      return { ...state, isStreamSubscribed: action.payload };
    default:
      return state;
  }
};

const connectionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case HANDLE_CONNECTION:
      return { ...state, isSessionConnected: action.payload };
    default:
      return state;
  }
};

const archiveReducer = (state = defaultState, action) => {
  switch (action.type) {
    case HANDLE_ARCHIVE: //archiveReducer saves the archiveID and the active streaming status
      return { ...state, isStreamArchiving: action.payload.isStreamArchiving, archiveID: action.payload.archiveID };
    default:
      return state;
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userID: '',
    userMode: '',
  },
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setUserMode: (state, action) => {
      state.userMode = action.payload;
    },
    reset: state => {
      state.userID = '';
      state.userMode = '';
    },
  },
});

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    sessionID: '',
  },
  reducers: {
    setSessionID: (state, action) => {
      state.sessionID = action.payload;
    },
    sReset: state => {
      state.sessonID = '';
    },
  },
});

const userReducer = userSlice.reducer;
const sessionReducer = sessionSlice.reducer;

export const { setUserID, setUserMode, reset } = userSlice.actions;
export const { setSessionID, sReset } = sessionSlice.actions;

// Root Reducers
const rootReducer = combineReducers({
  videoChat: subscriberReducer,
  connection: connectionReducer,
  archive: archiveReducer,
  user: userReducer,
  session: sessionReducer,
});

// Store
export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
