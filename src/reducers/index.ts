import { combineReducers } from 'redux';
import controlStateReducer from './controlState';
import connectivityReducer from './connectivity';
import positioningReducer from './positioning';
import foodBoxTempReducer from './foodBoxTemp';
import controlBoxTempReducer from './controlBoxTemp';
import batteryStateReducer from './batteryState';


export default combineReducers({
  battery: batteryStateReducer,
  foodBox: foodBoxTempReducer,
  controlBox: controlBoxTempReducer,
  controlState: controlStateReducer,
  connectivity: connectivityReducer,
  positioning: positioningReducer,
})