
// @ts-nocheck
import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';


interface IProps {
  lat: number
  lng: number
  active: boolean | undefined
}

interface IState {
  zoom: number
}

class MapContainer extends React.Component<IProps, IState>{
  private map: any;

  constructor(props: any) {
    super(props);
    this.state = {
      zoom: 18
    }
  }

  // Ensure that the zoom level persists across re-renders!
  private persistZoomLevel = (e: Event) => {
    let zoomLevel = this.map?.leafletElement?.getZoom();
    zoomLevel = zoomLevel ? zoomLevel : 18; // Default to lowest zoom level
    this.setState({ zoom: zoomLevel });
  }

  public render() {
    const marker = this.props.active ? <Marker position={[this.props.lat, this.props.lng]} /> : null

    return (
      <Map
        center={[this.props.lat, this.props.lng]}
        zoom={this.state.zoom}
        onzoom={this.persistZoomLevel}
        ref={(ref) => { this.map = ref; }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker}
      </Map>
    );
  }
}

export const NavigationMap = MapContainer;