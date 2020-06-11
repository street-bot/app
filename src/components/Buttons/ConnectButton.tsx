import React from 'react';

interface IProps {
  connected: boolean
  disconnectFunc: Function
  connectFunc: Function
  className: string
}

export class ConnectButton extends React.Component<IProps> {

  private onClickFunc = ():void => {
    if(this.props.connected) {
      this.props.disconnectFunc();
    } else {
      this.props.connectFunc();
    }
  }

  private getText = ():string => {
    return this.props.connected ? 'Disconnect' : 'Connect'
  }

  public render() {
    return (
      <button
        className={this.props.className}
        onClick={this.onClickFunc}
      >
        {this.getText()}
      </button>
    )
  }
}