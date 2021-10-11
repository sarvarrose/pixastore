import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import storeReducer from "./storeReducer";
// import { composeWithDevTools } from "redux-devtools-extension";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  storeReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
