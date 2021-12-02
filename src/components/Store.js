import { createStore, combineReducers } from "redux";
import { createSlice } from '@reduxjs/toolkit';

// Types
const HANDLE_SUBSCRIPTION = "HANDLE_SUBSCRIPTION";
const HANDLE_PUBLISH = "HANDLE_PUBLISH";

// Actions
export const handleSubscription = (payload) => ({
  type: HANDLE_SUBSCRIPTION,
  payload,
});
export const handlePublish = (payload) => ({
  type: HANDLE_PUBLISH,
  payload,
});


const defaultState = {
  isStreamSubscribed: false,
  isStreamPublishing: false,
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
const publisherReducer = (state = defaultState, action) => {
  switch (action.type) {
    case HANDLE_PUBLISH:
      return { ...state, isStreamPublished: action.payload };
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
    reset: (state) => {
      state.userID = '';
      state.userMode = '';
    }
  }
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    sessionID: '',
  },
  reducers: {
    setSessionID: (state, action) => {
      state.sessionID = action.payload;
    },
    sReset: (state) => {
      state.sessonID = '';
    }
  }
})

const userReducer = userSlice.reducer;
const sessionReducer = sessionSlice.reducer;

export const { setUserID, setUserMode, reset } = userSlice.actions;
export const {setSessionID, sReset} = sessionSlice.actions;

// Root Reducers
const rootReducer = combineReducers({
  videoChat: subscriberReducer,
  //VideoChat: publisherReducer
  user: userReducer,
  session: sessionReducer
});

// Store
export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);