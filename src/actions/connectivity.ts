export const CHANGE_CONNECTION = 'ControlState/robot/CONNECTION';

export interface IConnectionState {
  type: string
  connected: boolean
}

export const changeConnectionState = (connected: boolean): IConnectionState => ({
  type: CHANGE_CONNECTION,
  connected
})
