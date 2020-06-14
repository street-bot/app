import { ILogger } from '../../lib/logger';
import { store } from '../../store';
import { updateLidarRender } from '../../actions';

export const LidarChannelName = 'lidar';
export var LidarDataArray: any = {};

export function BuildLidarChannel(logger: ILogger) {
  return function (dataChan: RTCDataChannel) {
    // Register DataChannel details
    dataChan.onclose = () => {
      logger.Info(`Data channel ${LidarChannelName} closed`);
    }

    dataChan.onopen = () => {
      logger.Info(`Data channel ${LidarChannelName} opened`);
    }

    dataChan.onmessage = e => {
      const parsedMsg = JSON.parse(e.data);
      LidarDataArray = parsedMsg;
      store.dispatch(updateLidarRender(parsedMsg.Header.Seq));
    }
  }
}