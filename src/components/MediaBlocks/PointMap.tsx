
import React from 'react';
import * as THREE from 'three';
import { LidarDataArray } from '../../lib/dataChannels/lidar';

interface IProps {
  seqNum: number

}

const WARNING_RADIUS = 2; // meters

export class PointMap extends React.Component<IProps> {
  private mountPoint: any;
  private scene: any;
  private camera: any;
  private renderer: any;
  private prevSeqNumber: number;  // Previous LiDAR frame sequence number
  private pointStyle: any;
  private warningPointStyle: any;
  private robotPointStyle: any;

  public componentDidMount () {
    // @ts-ignore
    const height = document.getElementById('lidar-vis').clientHeight;
    // @ts-ignore
    const width = document.getElementById('lidar-vis').clientWidth;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 55, width/height, 1, 10000 );
    this.renderer = new THREE.WebGLRenderer();
    this.camera.position.z = 12;
    // TODO: Camera displacement and rotation

    this.renderer.setSize(width, height);
    this.mountPoint.appendChild( this.renderer.domElement );

    // Normal red colored points (beyond caution radius)
    this.pointStyle = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.1,
      opacity: 1
    });

    // Yellow warning points (within caution radius)
    this.warningPointStyle = new THREE.PointsMaterial({
      color: 0xffff00,
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

    // Draw distance visualizers
    this.addCircle(2);
    this.addCircle(4);
    this.addCircle(6);

    // Draw robot
    var geometry = new THREE.BoxGeometry( 0.7, 1.3, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add(cube);

    var farPointCloud = new THREE.Geometry();
    var farPoints = new THREE.Points(farPointCloud, this.pointStyle);
    this.scene.add(farPoints);

    var nearPointCloud = new THREE.Geometry();
    var nearPoints = new THREE.Points(nearPointCloud, this.warningPointStyle);
    this.scene.add(nearPoints);

    // Draw Lidar reflections
    const numPts = LidarDataArray?.Angles.length;
    if (numPts){
      for (var i = 0; i < numPts; i++ ){
        var x = -LidarDataArray.Ranges[i] * Math.sin(LidarDataArray.Angles[i] );
        var y = LidarDataArray.Ranges[i] * Math.cos(LidarDataArray.Angles[i] );
        const newPt = new THREE.Vector3(x, y, 0);
        if (LidarDataArray.Ranges[i] <= WARNING_RADIUS) {
          nearPointCloud.vertices.push(newPt);
        } else {
          farPointCloud.vertices.push(newPt);
        }

      }
      this.renderer.render( this.scene, this.camera );
    }
  }

  private addCircle(radius: number) {
    var dashMaterial = new THREE.LineBasicMaterial( { color: 0x808080, opacity: 0.5, linewidth:1  } ),
    circGeom = new THREE.CircleGeometry( radius, 100  );

    circGeom.vertices.shift();

    var circ = new THREE.LineLoop( circGeom, dashMaterial);
    this.scene.add( circ );
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
