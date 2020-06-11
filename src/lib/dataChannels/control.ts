import { ILogger } from "../logger";
import { IConfig } from  '../../types/config';

export const ControlChannelName = 'control';

export function BuildControlChannel(logger: ILogger, hb: any, config: IConfig, hbFunc: Function) {
  return function (dataChan: RTCDataChannel) {
    // Register DataChannel details
    dataChan.onclose = () => {
      logger.Info(`Data channel ${ControlChannelName} closed`);
    }

    dataChan.onopen = () => {
      logger.Info(`Data channel ${ControlChannelName} opened`);
      hb = setInterval(hbFunc, config.hbInterval);
    }

    dataChan.onmessage = e => {
      console.log(JSON.parse(e.data));
    }
  }
}
