import React from 'react';
import { WebSocketClient } from '../../lib/websocket';
import { WebRTCClient } from '../../lib/webrtc';
import { Config } from '../../config';
import * as types from "../../types";

export class ControlTerminal extends React.Component {
  wsc: WebSocketClient;
  rtc: WebRTCClient;
  config: Config;

  constructor(props: any) {
    super(props);
    this.config = new Config();
    this.wsc = new WebSocketClient(this.config.signalingHost);
    this.rtc = new WebRTCClient([
      {
        urls: 'stun:stun.l.google.com:19302'
      },
      {
        urls: 'turn:numb.viagenie.ca',
        username: 'nasir75401@mailcupp.com',
        credential: 'streetbot'
      }
    ]);
  }

  public componentDidMount() {
    this.wsc.connectWS();
  }

  public componentWillUnmount() {
    this.wsc.close()
  }

  private startStream() {
    // Register callback to handle offer response
    this.wsc.On(types.OfferResponseMsgType, (sdpResponse: string) => {
      try {
        this.rtc.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sdpResponse))));
      } catch (e) {
        alert(e);
      }
    });
    this.rtc.Connect(this.wsc.ws);
  }

  private registerClient() {
    this.wsc.RegisterClient('streetbot-1');
  }

  public render() {
    return(
      <div className="container mt-4">
        <button className="btn btn-primary mx-2" onClick={() => this.startStream()}>Connect</button>
        <button className="btn btn-primary mx-2" onClick={() => this.registerClient()}>Register</button>
        <div id="remoteVideos"></div> <br />
      </div>
    )
  }
}

export default ControlTerminal;