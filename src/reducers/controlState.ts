import * as controlState from '../actions/controlState';

const initialState = {
  forwardPower: 0,
  horizontalPower: 0
}

const controlStateReducer = (state: any, action: any) => {
  if(!state) {
    state = initialState;
  }
  switch (action.type) {
    case controlState.CHANGE_FORWARD_POWER:
      return (
        {
          forwardPower: action.forwardPower,
          horizontalPower: state.horizontalPower
        }
      )

    case controlState.CHANGE_HORIZONTAL_POWER:
      return (
        {
          horizontalPower: action.horizontalPower,
          forwardPower: state.forwardPower,
        }
      )

    default:
      return state
  }
}

export default controlStateReducer