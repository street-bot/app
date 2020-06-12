export const CHANGE_GPS_POSITION = 'robot/CHANGE_GPS_POSITION';

export interface ILatLong {
  type: string
  lat: number
  lng:number
};

export const updatePosition = (lat: number, lng: number): ILatLong => ({
  type: CHANGE_GPS_POSITION,
  lat,
  lng
});