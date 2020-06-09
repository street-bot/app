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
    this.dataChans = new Map<string, RTCDataChannel>();
    this.logger = new Logger("WebRTC", {
      LogLevel: this.config.logLevel
    });

    // Set up RTCPeerConnection with ICE configs
    this.offer = ""
    this.pc = new RTCPeerConnection({
      iceServers: iceServerList
    });
  }

  public DataChannel(name: string): RTCDataChannel | undefined {
    return this.dataChans.get(name);
  }

  public async Connect(signalConn: WebSocket) {
    // Register ICE transition callbacks
    // Offer to receive 1 video track
    this.pc.addTransceiver('video', {'direction': 'recvonly'})
    this.pc.createOffer().then(d => this.pc.setLocalDescription(d))
    this.pc.oniceconnectionstatechange = e => this.logger.Info(this.pc.iceConnectionState)
    this.pc.onicecandidate = event => {
      if (event.candidate === null) { // Don't recreate offer if a candidate already exists
        const offer = btoa(JSON.stringify(this.pc.localDescription));
        const offerMsg = new types.OfferMsg({
          SDPStr: offer
        });

        signalConn.send(JSON.stringify(offerMsg))
      }
    }

    this.pc.ontrack = function (event: any) {
      var el = document.createElement(event.track.kind)
      el.srcObject = event.streams[0]
      el.autoplay = true
      el.controls = true

      document?.getElementById('remoteVideos')?.appendChild(el)
    }
  }

  public AddDataChannel(name: string, registerCallback: (dataChan: RTCDataChannel) => void) {
    if(!this.dataChans.get(name)){
      this.logger.Info(`Creating new data channel ${name}`);
      const newDataChan = this.pc.createDataChannel(name);
      registerCallback(newDataChan); // Let he user define the onXXX callback events
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