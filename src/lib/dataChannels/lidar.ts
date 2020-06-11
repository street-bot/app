import { ILogger } from "../../lib/logger";

export const LidarChannelName = 'lidar';

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
      console.log(JSON.parse(e.data));
    }
  }
}