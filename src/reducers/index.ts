import { combineReducers } from 'redux';
import controlStateReducer from './controlState';
import connectivity from './connectivity';

export default combineReducers({
  controlState: controlStateReducer,
  connectivity
})