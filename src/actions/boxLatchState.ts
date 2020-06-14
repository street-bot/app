export const CHANGE_FOODBOX_LATCH_STATE = 'SensorState/robot/CHANGE_FOODBOX_LATCH_STATE';

export interface IFoodBoxLatchState {
  type: string
  foodBoxLatchOpen: boolean
}


export const changeFoodBoxLatchState = (open: boolean): IFoodBoxLatchState => ({
  type: CHANGE_FOODBOX_LATCH_STATE,
  foodBoxLatchOpen: open
});
