import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import storeReducer from "./storeReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  storeReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
