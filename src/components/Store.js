import { createStore, combineReducers } from "redux";

// Types
const HANDLE_SUBSCRIPTION = "HANDLE_SUBSCRIPTION";

// Actions
export const handleSubscription = (payload) => ({
  type: HANDLE_SUBSCRIPTION,
  payload,
});

// Reducers
const videoReducer = (state = { isStreamSubscribed: false }, action) => {
  switch (action.type) {
    case HANDLE_SUBSCRIPTION:
      return { ...state, isStreamSubscribed: action.payload };
    default:
      return state;
  }
};
// Root Reducers
const rootReducer = combineReducers({
  videoChat: videoReducer,
});

// Store
export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);