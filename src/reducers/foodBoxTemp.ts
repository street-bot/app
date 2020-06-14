import * as actions from '../actions';
import { IFoodBoxState } from '../actions';

const initialState = {
  foodBoxTemp: 0
};

const foodBoxStateReducer = (state: any, action: IFoodBoxState) => {
  if(!state) {
    state = initialState;
  }
  switch (action.type) {
    case actions.CHANGE_FOODBOX_TEMP:
      return {
        foodBoxTemp: action.foodBoxTemp
      }

    default:
      return state
  }
};

export default foodBoxStateReducer;