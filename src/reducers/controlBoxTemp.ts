import * as actions from '../actions';
import { IControlBoxState } from '../actions';

const initialState = {
  controlBoxTemp: 0
};

const controlBoxStateReducer = (state: any, action: IControlBoxState) => {
  if(!state) {
    state = initialState;
  }
  switch (action.type) {
    case actions.CHANGE_CONTROLBOX_TEMP:
      return {
        controlBoxTemp: action.controlBoxTemp
      }

    default:
      return state
  }
};

export default controlBoxStateReducer;