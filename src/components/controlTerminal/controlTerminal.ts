import React from 'react';
import { WebSocketClient } from '../../lib/websocket';
import { Config } from '../../config';

export class ControlTerminal extends React.Component {
  wsc: WebSocketClient;
  config: Config;

  constructor(props: any) {
    super(props);
    this.config = new Config();
    this.wsc = new WebSocketClient(this.config.signalingHost);
  }

  public componentDidMount() {
    this.wsc.connectWS();
  }

  public componentWillUnmount() {
    this.wsc.close()
  }

  public render() {
    return null
  }
}