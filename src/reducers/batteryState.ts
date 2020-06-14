import * as actions from '../actions';
import { IBatteryState } from '../actions';

const initialState = {
  batVoltage: 0,
};

const batStateReducer = (state: any, action: IBatteryState): any => {
  if(!state) {
    state = initialState;
  }
  switch (action.type) {
    case actions.CHANGE_BATTERY_VOLTAGE:
      return {
        batVoltage: action.batVoltage
        }
    default:
      return state
  }
};

export default batStateReducer;