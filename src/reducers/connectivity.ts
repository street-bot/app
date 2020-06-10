import { CHANGE_CONNECTION, IConnectionState } from '../actions/connectivity';

const connectivity = (state = [], action: IConnectionState) => {
  switch (action.type) {
    case CHANGE_CONNECTION:
      return {
          connected: action.connected
        }

    default:
      return state
  }
}

export default connectivity