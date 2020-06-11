export const CHANGE_FORWARD_POWER = 'ControlState/robot/CHANGE_FORWARD_POWER';
export const CHANGE_HORIZONTAL_POWER = 'ControlState/robot/CHANGE_HORIZONTAL_POWER';

export interface IControlState {
  type: string
  forwardPower: number
  horizontalPower:number
}

export const changeForwardPower = (power: number): IControlState => ({
  type: CHANGE_FORWARD_POWER,
  forwardPower: power,
  horizontalPower: 0  // Ignored in reducer
})

export const changeHorizontalPower = (power: number): IControlState => ({
  type: CHANGE_HORIZONTAL_POWER,
  forwardPower: 0, // Ignored in reducer
  horizontalPower: power
})
