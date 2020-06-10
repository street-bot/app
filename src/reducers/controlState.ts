import { CHANGE_POWER , IControlState } from '../actions/controlState';

const controlState = (state = [], action: IControlState) => {
  switch (action.type) {
    case CHANGE_POWER:
      return (
        {
          power: action.power
        }
      )

    default:
      return state
  }
}

export default controlState