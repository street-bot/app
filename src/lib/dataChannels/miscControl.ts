import { ILogger } from "../logger";

export const MiscControlChannelName = 'misc-control';

export function BuildMiscControlChannel(logger: ILogger) {
  return function (dataChan: RTCDataChannel) {
    // Register DataChannel details
    dataChan.onclose = () => {
      logger.Info(`Data channel ${MiscControlChannelName} closed`);
    }

    dataChan.onopen = () => {
      logger.Info(`Data channel ${MiscControlChannelName} opened`);
    }

    dataChan.onmessage = e => {
      logger.Warn(`Unexpected message received on ${MiscControlChannelName}!`);
      console.log(JSON.parse(e.data));
    }
  }
}
