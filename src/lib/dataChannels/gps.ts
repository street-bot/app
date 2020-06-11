import { ILogger } from "../logger";

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
      console.log(JSON.parse(e.data));
    }
  }
}