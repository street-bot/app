import { CHANGE_GPS_POSITION, ILatLong } from '../actions/positioning';

// Home location :)
const initialState = {
  lat: 43.670098,
  lng: -79.386680
};

const positioningReducer = (state: any, action: ILatLong) => {
  if(!state) {
    state = initialState;
  }

  switch (action.type) {
    case CHANGE_GPS_POSITION:
      return {
          lat: action.lat,
          lng: action.lng
        }

    default:
      return state
  }
}

export default positioningReducer;