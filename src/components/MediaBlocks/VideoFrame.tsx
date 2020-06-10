import React from 'react'

interface Props {
  id: string;
}
export class VideoFrame extends React.Component<Props> {
  public render() {
    return (
      <video id={this.props.id} width="640" height="480" autoPlay controls/>
    )
  }
}