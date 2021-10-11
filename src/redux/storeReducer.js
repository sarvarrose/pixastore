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

const initialState = {
  data: [],
  query: "",
  pageNumber: 1,
  resultPages: 0,
  loading: false,
  refreshing: false,
  error: "",
  viewableItemsIndex: 0,
  // orientation: isPortrait() ? "portrait" : "landscape",
};

const storeReducer = (state = initialState, action) => {
  const payload = action.payload;
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        refreshing: false,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        data: [...state.data, ...payload.data],
        resultPages: payload.resultPages,
      };

    case FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
        // data: [],
      };
    case REFRESH_RESULTS:
      return {
        ...state,
        pageNumber: 1,
        refreshing: true,
        loading: false,
        data: [],
        resultPages: 0,
        viewableItemsIndex: 0,
      };
    case LOAD_MORE_RESULTS:
      return {
        ...state,
        pageNumber: state.pageNumber + 1,
      };
    case FETCH_SEARCH:
      return {
        ...state,
        data: [],
        pageNumber: 1,
        refreshing: false,
        query: payload.query,
      };
    case CLEAR_SEARCH:
      return { ...initialState };
    case CHANGE_VIEWABLE_ITEMS_INDEX:
      return {
        ...state,
        viewableItemsIndex: payload.index,
      };
    default:
      return state;
  }
};

export default storeReducer;
