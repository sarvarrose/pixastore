import axios from "axios";
import { PIXA_KEY } from "@env";
import formatQuery from "../helpers/formatQuery";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  REFRESH_RESULTS,
  LOAD_MORE_RESULTS,
  FETCH_SEARCH,
  CLEAR_SEARCH,
  CHANGE_VIEWABLE_ITEMS_INDEX,
} from "./storeTypes";

const fetchRequest = () => {
  return {
    type: FETCH_REQUEST,
  };
};

const fetchSuccess = (data, totalHits) => {
  return {
    type: FETCH_SUCCESS,
    payload: { data, resultPages: Math.ceil(totalHits / 20) },
  };
};

const fetchFailure = (error) => {
  return {
    type: FETCH_FAILURE,
    payload: { error },
  };
};

const setRefreshResults = () => {
  return {
    type: REFRESH_RESULTS,
  };
};

const setLoadMoreResults = () => {
  return {
    type: LOAD_MORE_RESULTS,
  };
};

const setFetchSearch = (query) => {
  return {
    type: FETCH_SEARCH,
    payload: { query },
  };
};

const clearSearch = () => {
  return {
    type: CLEAR_SEARCH,
  };
};

const setViewableItems = (index) => {
  return {
    type: CHANGE_VIEWABLE_ITEMS_INDEX,
    payload: { index },
  };
};

// TODO: implement debounce
const fetchImages = () => {
  return (dispatch, getState) => {
    const { query, pageNumber } = getState();
    dispatch(fetchRequest());
    let queryURL = `https://pixabay.com/api/?key=${PIXA_KEY}&page=${pageNumber}&q=${formatQuery(
      query
    )}`;
    axios
      .get(queryURL)
      .then((response) => {
        const { hits, totalHits } = response.data;
        dispatch(fetchSuccess(hits, totalHits));
      })
      .catch((err) => {
        dispatch(fetchFailure(err.message));
      });
  };
};

const refreshResults = () => {
  return (dispatch, getState) => {
    const { query } = getState();
    dispatch(setRefreshResults());
    dispatch(fetchImages());
  };
};

const loadMoreResults = () => {
  return (dispatch, getState) => {
    const { query, loading, pageNumber, resultPages } = getState();
    if (loading || pageNumber >= resultPages) {
      console.log("Skip Action LoadMoreResults");
      return;
    }
    dispatch(setLoadMoreResults());
    dispatch(fetchImages());
  };
};

const fetchSearch = (query) => {
  return (dispatch) => {
    dispatch(setFetchSearch(query));
    dispatch(fetchImages());
  };
};

export {
  fetchRequest,
  fetchSuccess,
  fetchFailure,
  fetchImages,
  refreshResults,
  loadMoreResults,
  fetchSearch,
  clearSearch,
  setViewableItems,
};
