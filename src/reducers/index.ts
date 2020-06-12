import { combineReducers } from 'redux';
import controlStateReducer from './controlState';
import connectivityReducer from './connectivity';
import positioningReducer from './positioning';

export default combineReducers({
  controlState: controlStateReducer,
  connectivity: connectivityReducer,
  positioning: positioningReducer
})