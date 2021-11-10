import { createStore, combineReducers } from "redux";

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


// Root Reducers
const rootReducer = combineReducers({
  videoChat: subscriberReducer,
  //VideoChat: publisherReducer

});

// Store
export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);