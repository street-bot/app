import * as actions from '../actions';
import { IFoodBoxLatchState } from '../actions';

const initialState = {
  foodBoxLatchOpen: true
};

const foodBoxLatchStateReducer = (state: any, action: IFoodBoxLatchState) => {
  if(!state) {
    state = initialState;
  }
  switch (action.type) {
    case actions.CHANGE_FOODBOX_LATCH_STATE:
      return {
        foodBoxLatchOpen: action.foodBoxLatchOpen
      }

    default:
      return state
  }
};

export default foodBoxLatchStateReducer;