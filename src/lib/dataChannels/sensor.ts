import { ILogger } from '../logger';
import {store} from '../../store';
import * as actions from '../../actions';

export const SensorChannelName = 'sensor';

export function BuildSensorChannel(logger: ILogger) {
  return function (dataChan: RTCDataChannel) {
    // Register DataChannel details
    dataChan.onclose = () => {
      logger.Info(`Data channel ${SensorChannelName} closed`);
    }

    dataChan.onopen = () => {
      logger.Info(`Data channel ${SensorChannelName} opened`);
    }

    dataChan.onmessage = e => {
      const parsedMsg = JSON.parse(e.data);
      switch (parsedMsg.Type) {
        case 'FoodBoxState':
          store.dispatch(actions.changeFoodBoxTemp(parsedMsg.Msg.Temperature));
          break;
        case 'ControlBoxState':
          store.dispatch(actions.changeControlBoxTemp(parsedMsg.Msg.Temperature));
          break;
        case 'BatteryState':
          store.dispatch(actions.changeBatteryVoltage(parsedMsg.Msg.Voltage));
          break
        case 'FoodBoxLatchState':
          store.dispatch(actions.changeFoodBoxLatchState(parsedMsg.Msg.Data));
          break

        default:
          logger.Warn(`Unsupported message type: ${parsedMsg.type}`);
      }
    }
  }
}