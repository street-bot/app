export const CHANGE_FOODBOX_TEMP = 'SensorState/robot/CHANGE_FOODBOX_TEMP';

export interface IFoodBoxState {
  type: string
  foodBoxTemp: number
}


export const changeFoodBoxTemp = (temp: number): IFoodBoxState => ({
  type: CHANGE_FOODBOX_TEMP,
  foodBoxTemp: temp
});
