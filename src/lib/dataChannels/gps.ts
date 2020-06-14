import { ILogger } from "../logger";
import { updatePosition } from '../../actions/positioning';
import {store} from '../../store';

export const GPSChannelName = 'gps';

export function BuildGPSChannel(logger: ILogger) {
  return function (dataChan: RTCDataChannel) {
    // Register DataChannel details
    dataChan.onclose = () => {
      logger.Info(`Data channel ${GPSChannelName} closed`);
    }

    dataChan.onopen = () => {
      logger.Info(`Data channel ${GPSChannelName} opened`);
    }

    dataChan.onmessage = e => {
      const parsedMsg = JSON.parse(e.data);
      store.dispatch(updatePosition(parsedMsg.Latitude, parsedMsg.Longitude));
    }
  }
}