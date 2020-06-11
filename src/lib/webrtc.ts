import * as types from "../types";
import { Logger, ILogger } from "./logger";
import { Config } from '../config';

export class WebRTCClient {
  private pc: RTCPeerConnection;
  private dataChans: Map<string, RTCDataChannel>;
  private logger: ILogger;
  private config: Config;
  private videoElement: string;
  private iceServerList: types.IICEServerConfig[];

  constructor(iceServerList: types.IICEServerConfig[], videoElement: string) {
    this.config = new Config();
    this.dataChans = new Map<string, RTCDataChannel>();
    this.logger = new Logger("WebRTC", {
      LogLevel: this.config.logLevel
    });
    this.videoElement = videoElement;
    this.iceServerList = iceServerList;
  }

  public DataChannel(name: string): RTCDataChannel | undefined {
    return this.dataChans.get(name);
  }

  public Disconnect = (): void => {
    for (const key of Array.from(this.dataChans.keys())) {
      this.RemoveDataChannel(key);
    }
    const el = document.getElementById(this.videoElement) as HTMLVideoElement
    if (el) {
      el.srcObject = null
    }
    const senders = this.pc.getSenders();
    senders.forEach((sender) => {
      this.pc.removeTrack(sender)
    });
    this.pc.close();
    delete this.pc;
  }

  public SetRemoteDescription = (sdpResponse: string) => {
    if(this.pc)  {
      this.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sdpResponse))));
    } else {
      throw new Error("Attempted to set remote description on a WebRTC client with no PeerConnection!");
    }
  }

  public NewConnection =() => {
    // Set up RTCPeerConnection with ICE configs
    this.pc = new RTCPeerConnection({
      iceServers: this.iceServerList
    });
  }

  public Connect(signalConn: WebSocket) {
    // Register ICE transition callbacks
    // Offer to receive 1 video track
    this.pc.addTransceiver('video', {'direction': 'recvonly'})
    this.pc.createOffer().then(d => this.pc?.setLocalDescription(d))

    this.pc.oniceconnectionstatechange = e => this.logger.Info(this.pc?.iceConnectionState)
    this.pc.onicecandidate = event => {
      if (event.candidate === null) { // Don't recreate offer if a candidate already exists
        const offer = btoa(JSON.stringify(this.pc?.localDescription));
        const offerMsg = new types.OfferMsg({
          SDPStr: offer
        });

        signalConn.send(JSON.stringify(offerMsg))
      }
    }

    this.pc.ontrack = (event: any) => {
      const el = document.getElementById(this.videoElement) as HTMLVideoElement
      if (el) {
        el.srcObject = event.streams[0]
        el.autoplay = true
        el.controls = true
      }
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
      this.logger.Warn(`WebRTC data channel ${name} not registered`);
    }
  }
}