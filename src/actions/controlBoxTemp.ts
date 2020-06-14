export const CHANGE_CONTROLBOX_TEMP = 'SensorState/robot/CHANGE_CONTROLBOX_TEMP';

export interface IControlBoxState {
  type: string
  controlBoxTemp: number
}

export const changeControlBoxTemp = (temp: number): IControlBoxState => ({
  type: CHANGE_CONTROLBOX_TEMP,
  controlBoxTemp: temp
});
