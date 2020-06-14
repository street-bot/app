export const CHANGE_BATTERY_VOLTAGE = 'SensorState/robot/CHANGE_BATTERY_VOLTAGE';

export interface IBatteryState {
  type: string
  batVoltage: number
}

export const changeBatteryVoltage = (voltage: number): IBatteryState => ({
  type: CHANGE_BATTERY_VOLTAGE,
  batVoltage: voltage
});