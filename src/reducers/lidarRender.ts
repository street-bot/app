import { LIDAR_VISUALIZATION_UPDATE, ILidarRenderState } from '../actions/lidarRender';

// Home location :)
const initialState = {
  seqNum: 0
};

const lidarRenderReducer = (state: any, action: ILidarRenderState) => {
  if(!state) {
    state = initialState;
  }

  switch (action.type) {
    case LIDAR_VISUALIZATION_UPDATE:
      return {
        seqNum: action.seqNum
        }

    default:
      return state
  }
}

export default lidarRenderReducer;