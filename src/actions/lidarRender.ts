export const LIDAR_VISUALIZATION_UPDATE = 'display/lidar/LIDAR_VISUALIZATION_UPDATE';

export interface ILidarRenderState {
  type: string
  seqNum: number
}

export const updateLidarRender = (seqNum: number): ILidarRenderState => ({
  type: LIDAR_VISUALIZATION_UPDATE,
  seqNum
});
