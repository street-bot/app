import * as types from "../types";
import { Logger, ILogger } from "./logger";
import { Config } from '../config';

export class WebRTCClient {
  pc: RTCPeerConnection;
  private dataChans: Map<string, RTCDataChannel>;
  private logger: ILogger;
  private config: Config;
  private offer: string;  // SDP Offer object

  constructor(iceServerList: types.IICEServerConfig[]) {
    this.config = new Config();
    this.logger = new Logger("WebRTC", {
      LogLevel: this.config.logLevel
    });

    // Set up RTCPeerConnection with ICE configs
    this.offer = ""
    this.pc = new RTCPeerConnection({
      iceServers: iceServerList
    });

    // Register ICE transition callbacks
    // Offer to receive 1 video track
    this.pc.addTransceiver('video', {'direction': 'recvonly'})
    this.pc.createOffer().then(d => this.pc.setLocalDescription(d))

    this.pc.oniceconnectionstatechange = e => this.logger.Info(this.pc.iceConnectionState)
    this.pc.onicecandidate = event => {
      if (event.candidate === null) { // Don't recreate offer if a candidate already exists
        this.offer = btoa(JSON.stringify(this.pc.localDescription));
      }
    }
  }

  public DataChannel(name: string): RTCDataChannel | undefined {
    return this.dataChans.get(name);
  }

  public async Connect(signalConn: WebSocket) {
    this.pc.ontrack = function (event: any) {
      var el = document.createElement(event.track.kind)
      el.srcObject = event.streams[0]
      el.autoplay = true
      el.controls = true

      document?.getElementById('remoteVideos')?.appendChild(el)
    }

    const offerMsg = new types.OfferMsg({
      SDPStr: this.offer
    });

    signalConn.send(JSON.stringify(offerMsg))
  }

  public AddDataChannel(name: string, registerCalllback: (dataChan: RTCDataChannel) => void) {
    if(!this.dataChans.get(name)){
      const newDataChan = this.pc.createDataChannel(name);
      registerCalllback(newDataChan); // Let he user define the onXXX callback events
      this.dataChans.set(name, newDataChan);
    } else {
      throw new Error(`WebRTC data channel ${name} is already registered`);
    }
  }

  public RemoveDataChannel(name: string){
    const dataChan = this.dataChans.get(name);
    if(dataChan){
      dataChan.close();
      this.dataChans.delete(name);
    } else {
      throw new Error(`WebRTC data channel ${name} not registered`);
    }
  }


}