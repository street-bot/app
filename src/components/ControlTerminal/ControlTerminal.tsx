import React from 'react';
import { WebSocketClient } from '../../lib/websocket';
import { WebRTCClient } from '../../lib/webrtc';
import { Config } from '../../config';
import * as types from "../../types";
import { Logger, ILogger } from "../../lib/logger";
import { VideoFrame, PointMap } from '../MediaBlocks';
import StatusBlock from '../Status/StatusBlock';
import { NavigationMap } from '../MediaBlocks/NavigationMap';



export class ControlTerminal extends React.Component {
  private wsc: WebSocketClient;
  private rtc: WebRTCClient;
  private config: Config;
  private controlState: types.IControlState;
  private logger: ILogger;

  constructor(props: any) {
    super(props);
    this.config = new Config();
    this.logger = new Logger("WebSocketClient", {
      LogLevel: this.config.logLevel
    });
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
    ], 'remoteVideos');

    this.controlState = {
      forward: 0,
      right: 0,
      speedLevel: 0
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public componentDidMount() {
    this.wsc.connectWS();
    // Register keystrokes
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  }

  public componentWillUnmount() {
    this.wsc.close()
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  private sendControlState = (): void => {
    let msg = JSON.stringify(this.controlState);
    if (this.rtc.DataChannel('control')?.readyState === "open") {
      this.rtc.DataChannel('control')?.send(msg);
      this.logger.Trace(`Sent control message: ${msg}`);
    }
  }

  handleKeyDown = (event: any): void => {
    if (!event.repeat){
      let key: string = String.fromCharCode(event.keyCode);
      this.controlState.speedLevel = 0;
      // Change control state depending on keypress
      switch(key){
        case "W":
          this.controlState.forward = 50;
          break;
        case "S":
          this.controlState.forward = -50;
          break;
        case "A":
          this.controlState.right = -50;
          break;
        case "D":
          this.controlState.right = 50;
          break;
        // speedLevel controls
        case "O":
          this.controlState.speedLevel = 0x04; // Increase speed level
          break;
        case "L":
          this.controlState.speedLevel = 0x02; // Decrease speed level
          break;
      }
      this.sendControlState()
    }
  }

  handleKeyUp = (event: any): void => {
    if (!event.repeat){
      let key: string = String.fromCharCode(event.keyCode);

      switch(key){
        case "W":
          this.controlState.forward = 0;
          break;
        case "S":
          this.controlState.forward = 0;
          break;
        case "A":
          this.controlState.right = 0;
          break;
        case "D":
          this.controlState.right = 0;
          break;
        case "O":
          this.controlState.speedLevel = 0;
          break;
        case "L":
          this.controlState.speedLevel = 0;
          break;
      }

      this.sendControlState();
    }
  }

  private startStream() {
    this.rtc.AddDataChannel('control', (dataChan: RTCDataChannel) => {
      // Register DataChannel details
      dataChan.onclose = () => this.logger.Info(`Data channel 'control' closed`)
      dataChan.onopen = () => {
        this.logger.Info(`Data channel 'control' opened`)
        setInterval(this.sendControlState, this.config.hbInterval);
      }
      dataChan.onmessage = e => console.log(`Message from DataChannel '${dataChan.label}' payload '${e.data}'`)
    });
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
      // For now we are using the document-level keystroke events; in the future we should migrate to only the control terminal's scope
      // <div onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>\
      <div className="container py-2 mx-auto">
        <div className="row px-0 mx-0">
          <div className="col-lg-6 px-0 mx-0 d-inline">
            <div className="col px-0 align-items-center my-2">
              <button
                className="btn btn-primary mx-2"
                onClick={() => this.startStream()}
              >
                Connect Control
              </button>
              <button
                className="btn btn-primary mx-2"
                onClick={() => this.registerClient()}
              >
                Connect Robot
              </button>
            </div>
            <div className="w-100" />
            <div className="col px-0 mx-0">
              <VideoFrame id="remoteVideos" />
            </div>
          </div>
          <div className="col px-0 d-flex justify-content-center align-items-center">
            <StatusBlock />
          </div>
          <div className="col px-0 d-flex flex-column align-items-center">
            <div className="de-inline-block my-3">Point Map:</div>
            <div className="col px-0">
              <PointMap />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col px-0 d-flex flex-column">
            <div className="text-left my-3">Navigation Map:</div>
            <div className="col px-0 align-items-center">
              <NavigationMap />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ControlTerminal;