import { CHANGE_CONNECTION, IConnectionState } from '../actions/connectivity';

const initialState = {
  connected: false
};

const connectivityReducer = (state: any, action: IConnectionState) => {
  if(!state) {
    state = initialState;
  }
  switch (action.type) {
    case CHANGE_CONNECTION:
      return {
          connected: action.connected
        }

    default:
      return state
  }
};

export default connectivityReducer;