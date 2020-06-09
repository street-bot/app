import React from 'react'

interface Props {
  id: string;
}
export class VideoFrame extends React.Component<Props> {
  public render() {
    return (
      <div id={this.props.id} className="alert alert-primary" role="alert" style={{minWidth: "640px", minHeight: "480px"}}>
      This is a video placeholder!
      </div>
    )
  }
}