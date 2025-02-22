import React from 'react';
import { WebSocketClient } from '../../lib/websocket';
import { WebRTCClient } from '../../lib/webrtc';
import { Config } from '../../config';
import * as types from "../../types";
import { Logger, ILogger } from "../../lib/logger";
import { VideoFrame, PointMap } from '../MediaBlocks';
import { NavigationMap } from '../MediaBlocks/NavigationMap';
import { connect } from 'react-redux';
import { ConnectButton } from '../Buttons';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { store } from '../../store';
import { changeConnectionState } from '../../actions/connectivity';
import { changeForwardPower, changeHorizontalPower } from '../../actions/controlState';
import * as dataChannels from '../../lib/dataChannels';
import { ILatLong } from '../../actions/positioning';
import { IBatteryState, IFoodBoxState, IFoodBoxLatchState, IControlBoxState, ILidarRenderState } from '../../actions';
import axios from 'axios';

interface IProps {
  connected?: boolean
  forwardPower: number
  horizontalPower: number
  latLong: ILatLong
  battery: IBatteryState
  foodBox: IFoodBoxState
  controlBox: IControlBoxState
  foodBoxLatch: IFoodBoxLatchState
  lidarRender: ILidarRenderState
}
class ControlTerminal extends React.Component<IProps> {
  private wsc: WebSocketClient;
  private rtc: WebRTCClient | undefined;
  private config: Config;
  private controlState: types.IControlState;
  private logger: ILogger;
  private hb: any;

  constructor(props: any) {
    super(props);

    this.config = new Config();
    this.logger = new Logger("WebSocketClient", {
      LogLevel: this.config.logLevel
    });
    this.wsc = new WebSocketClient(this.config.signalingHost);

    this.controlState = {
      forward: 0,
      right: 0,
      speedLevel: 0
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public async componentDidMount() {
    const res = await axios.get(this.config.signalingURL + "/iceservers");
    const iceServers = res.data.iceServers;

    this.rtc = new WebRTCClient(iceServers, 'remoteVideos');

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
    const msg = JSON.stringify(this.controlState);
    if (this.rtc?.DataChannel(dataChannels.ControlChannelName)?.readyState === "open") {
      this.rtc.DataChannel(dataChannels.ControlChannelName)?.send(msg);
      this.logger.Trace(`Sent control message: ${msg}`);
    }
  }

  private sendMiscControl = (Type: string, Msg: any): void => {
    const wrappedMsg = JSON.stringify({
      Type,
      Msg
    });

    if (this.rtc?.DataChannel(dataChannels.MiscControlChannelName)?.readyState === "open") {
      this.rtc.DataChannel(dataChannels.MiscControlChannelName)?.send(wrappedMsg);
      this.logger.Trace(`Sent misc-control message: ${wrappedMsg}`);
    }
  }

  handleKeyDown = (event: any): void => {
    if (!event.repeat){
      let key: string = String.fromCharCode(event.keyCode);
      this.controlState.speedLevel = types.SpeedLevelZero;
      // Change control state depending on keypress
      switch(key){
        case "W":
          this.controlState.forward = this.props.forwardPower;
          break;
        case "S":
          this.controlState.forward = -this.props.forwardPower;
          break;
        case "A":
          this.controlState.right = -this.props.horizontalPower;
          break;
        case "D":
          this.controlState.right = this.props.horizontalPower;
          break;
        // speedLevel controls
        case "O":
          this.controlState.speedLevel = types.SpeedLevelUp;
          break;
        case "L":
          this.controlState.speedLevel = types.SpeedLevelDown;
          break;
        // Box latch controls
        case "I":
          // Open latch
          this.sendMiscControl("BoxLatchControl", true);
          break;
        case "K":
          // Close latch
          this.sendMiscControl("BoxLatchControl", false);
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
          this.controlState.forward = types.PowerZero;
          break;
        case "S":
          this.controlState.forward = types.PowerZero;
          break;
        case "A":
          this.controlState.right = types.PowerZero;
          break;
        case "D":
          this.controlState.right = types.PowerZero;
          break;
        case "O":
          this.controlState.speedLevel = types.SpeedLevelZero;
          break;
        case "L":
          this.controlState.speedLevel = types.SpeedLevelZero;
          break;
      }

      this.sendControlState();
    }
  }

  private startStream = () => {
    if(this.rtc) {
      this.rtc.NewConnection();

      // Robot control channel
      this.rtc.AddDataChannel(dataChannels.ControlChannelName, dataChannels.BuildControlChannel(this.logger, this.hb, this.config, this.sendControlState));

      // GPS data channel
      this.rtc.AddDataChannel(dataChannels.GPSChannelName, dataChannels.BuildGPSChannel(this.logger));

      // Lidar data channel
      this.rtc.AddDataChannel(dataChannels.LidarChannelName, dataChannels.BuildLidarChannel(this.logger));

      // Sensor data channel
      this.rtc.AddDataChannel(dataChannels.SensorChannelName, dataChannels.BuildSensorChannel(this.logger));

      // Misc control channel
      this.rtc.AddDataChannel(dataChannels.MiscControlChannelName, dataChannels.BuildMiscControlChannel(this.logger));

      // Register callback to handle offer response
      this.wsc.On(types.OfferResponseMsgType, (sdpResponse: string) => {
        try {
          this.rtc?.SetRemoteDescription(sdpResponse);
        } catch (e) {
          this.logger.Error(e);
        }
      });

      this.wsc.On(types.RobotDeregistrationMsgType, (RobotID: string) => {
        this.disconnect();
        alert(`Robot ${RobotID} has disconnected from signaler!`);
      })
      this.rtc.Connect(this.wsc.ws);
    } else {
      this.logger.Error("WebRTC Client is not instantiated!");
    }
  }

  private connect = () => {
    this.wsc.On(types.RegSuccessType, this.startStream)
    this.registerClient();
  }

  private disconnect = ():void => {
    if(this.hb){
      clearInterval(this.hb); // Stop sending control states
    }

    this.rtc?.Disconnect();
    this.wsc.close(); // Disconnect to invoke deregistration
    store.dispatch(changeConnectionState(false));
  }

  private registerClient = () => {
    this.wsc.RegisterClient('streetbot-1');
  }

  private sliderForwardChange = (event: any, newValue: any) => {
    store.dispatch(changeForwardPower(newValue));
  }

  private sliderHorizontalChange = (event: any, newValue: any) => {
    store.dispatch(changeHorizontalPower(newValue));
  }

  private syncPowers = () => {
    store.dispatch(changeHorizontalPower(this.props.forwardPower));
  }

  public render() {
    return(
      // For now we are using the document-level keystroke events; in the future we should migrate to only the control terminal's scope
      // <div onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>\
      <div className="container py-2 mx-auto">
        <div className="row px-0 mx-0">
          <div className="col-lg-6 px-0 mx-0 d-inline">
            <div className="col px-0 align-items-center my-2">
              <ConnectButton
                className="btn btn-primary mx-2"
                connected={this.props.connected ? true: false}
                connectFunc={this.connect}
                disconnectFunc={this.disconnect}
              >
                Connect Robot
              </ConnectButton>
            </div>
            <div className="col px-0 mx-0" >
              <VideoFrame id="remoteVideos" />
            </div>
          </div>
          <div className="col px-0 mx-0 d-flex justify-content-center align-items-center" >
          </div>
          <div className="col px-0 d-flex flex-column align-items-center">
            <div className="col px-0">
              <PointMap seqNum={this.props.lidarRender.seqNum}/>
              <div> Forward Power: {this.props.forwardPower}% </div>
              <Slider
                onChange={this.sliderForwardChange}
                aria-labelledby="continuous-slider"
                value={this.props.forwardPower}
                step={1}
                min={0}
                max={100}
                disabled={!this.props.connected}
              />
              <div> Horizontal Power: {this.props.horizontalPower}% </div>
              <Slider
                onChange={this.sliderHorizontalChange}
                aria-labelledby="continuous-slider"
                value={this.props.horizontalPower}
                step={1}
                min={0}
                max={100}
                disabled={!this.props.connected}
              />
              <Button variant="contained" color="primary" onClick={this.syncPowers} disabled={!this.props.connected}>
                Sync Power
              </Button>
              <div>
                Battery: {this.props.battery.batVoltage} V | Control Box Temp: {this.props.controlBox.controlBoxTemp} C
              </div>
              <div>
                Latch: {this.props.foodBoxLatch.foodBoxLatchOpen ? "Open" : "Closed"} | Food Box Temp: {this.props.foodBox.foodBoxTemp} C
              </div>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-start mt-3">
          <NavigationMap lat={this.props.latLong.lat} lng={this.props.latLong.lng} active={this.props.connected}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps:any) => {
  return {
    connected: state.connectivity.connected,
    forwardPower: state.controlState.forwardPower,
    horizontalPower: state.controlState.horizontalPower,
    latLong: state.positioning,
    battery: state.battery,
    foodBox: state.foodBox,
    controlBox: state.controlBox,
    foodBoxLatch: state.foodBoxLatch,
    lidarRender: state.lidarRender
  }
}

export default connect(mapStateToProps)(ControlTerminal);