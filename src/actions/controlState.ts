export const CHANGE_POWER = 'ControlState/robot/CHANGE_POWER';

export interface IControlState {
  type: string
  power: number
}

export const changePower = (power: number): IControlState => ({
  type: CHANGE_POWER,
  power
})
