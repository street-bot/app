import { combineReducers } from 'redux';
import controlState from './controlState';
import connectivity from './connectivity';

export default combineReducers({
  controlState,
  connectivity
})