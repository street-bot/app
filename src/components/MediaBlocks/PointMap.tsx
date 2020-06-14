
import React from 'react';
import * as THREE from 'three';
import { LidarDataArray } from '../../lib/dataChannels/lidar';

interface IProps {
  seqNum: number
}

export class PointMap extends React.Component<IProps> {
  private mountPoint: any;
  private scene: any;
  private camera: any;
  private renderer: any;
  private prevSeqNumber: number;  // Previous LiDAR frame sequence number
  private pointStyle: any;
  private robotPointStyle: any;

  public componentDidMount () {
    // @ts-ignore
    const height = document.getElementById('lidar-vis').clientHeight;
    // @ts-ignore
    const width = document.getElementById('lidar-vis').clientWidth;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 55, width/height, 1, 10000 );
    this.renderer = new THREE.WebGLRenderer();
    this.camera.position.z = 10;
    // TODO: Camera displacement and rotation

    this.renderer.setSize(width, height);
    this.mountPoint.appendChild( this.renderer.domElement );
    this.pointStyle = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.1,
      opacity: 1
    });
    this.robotPointStyle = new THREE.PointsMaterial({
      color: 0x37eb34,
      size: 0.6,
      opacity: 1
    });
  }

  private lidarRedraw = (seqNum: number) => {
    // Prevent updating if the sequence numbers have not changed!
    if (seqNum === this.prevSeqNumber) {
      return;
    }
    this.prevSeqNumber = seqNum;

    if(!this.scene || !this.camera || !this.renderer) {
      return; // Don't do anything if this hasn't been set up yet!
    }

    // Clear the scene
    while(this.scene.children.length > 0){
      this.scene.remove(this.scene.children[0]);
    }

    // Draw robot
    var robotGeometry = new THREE.Geometry();
    var robotPoint = new THREE.Points(robotGeometry, this.robotPointStyle);
    this.scene.add(robotPoint);
    robotGeometry.vertices.push(new THREE.Vector3(0,0,0));

    var tgeometry = new THREE.Geometry();
    var pointCloud = new THREE.Points(tgeometry, this.pointStyle);
    this.scene.add(pointCloud);

    // Draw Lidar reflections
    const numPts = LidarDataArray?.Angles.length;
    if (numPts){
      for (var i = 0; i < numPts; i++ ){
        var x = -LidarDataArray.Ranges[i] * Math.sin(LidarDataArray.Angles[i] );
        var y = LidarDataArray.Ranges[i] * Math.cos(LidarDataArray.Angles[i] );
        // const newPt = new THREE.Vector3().setFromCylindricalCoords(LidarDataArray.Ranges[i], LidarDataArray.Angles[i], 0);
        const newPt = new THREE.Vector3(x, y, 0);
        tgeometry.vertices.push(newPt);
      }
      this.renderer.render( this.scene, this.camera );
    }

    // tgeometry.verticesNeedUpdate = true;
    // tgeometry.elementsNeedUpdate = true;
    // tgeometry.computeVertexNormals();


  }

  public render() {
    this.lidarRedraw(this.props.seqNum);

    return (
      <div ref={ref => (this.mountPoint = ref)} id="lidar-vis"  style={{minWidth: "500px", minHeight: "500px"}}>
        LiDAR Visualization
      </div>
      )
  }
}
