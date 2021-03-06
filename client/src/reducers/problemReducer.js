import {
  GET_PROBLEMS,
  POST_LOADING,
  GET_EXAMINAIONS
} from '../actions/types';

const initialState = {
  problems: [],
  loading: false,
  examination:[]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROBLEMS:
      return {
        ...state,
        loading:false,
        problems: action.payload
      }
    case GET_EXAMINAIONS:
      return {
        examination: action.payload
      }
    default:
      return state;
  }
}
