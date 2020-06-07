import { Logger, ILogger } from "./logger";
import * as types from "../types";
import { Config } from '../config';

// WebSocket client
export class WebSocketClient {
  ws: WebSocket;
  private robotID: string;
  private host: string;
  private logger: ILogger;
  private config: Config;

  constructor(host: string) {
    this.host = host;
    this.robotID = "";
    this.config = new Config();
    this.logger = new Logger("WebSocketClient", {
      LogLevel: this.config.logLevel
    });
  }

  // Register a client on the Signaler
  public RegisterClient(robotID: string) {
    if (this.robotID === ""){
      const regMsg = new types.ClientRegistrationMsg({
        RobotID: robotID
      });
      try {
        this.ws.send(JSON.stringify(regMsg));
      } catch (e){
        this.logger.Error(e);
      }

      this.logger.Debug(`Sent registration message for ${robotID}`);
    } else {
      this.logger.Warn(`Attempting to register alrelady registered client (${this.robotID}) to robot ${robotID}`);
    }
  }

  public ConnectRTC() {
    // TODO: Setup WebRTC connection
    let newMsg = {
      Type: "Offer",
      Payload: {
          SDPStr: "something"
      }
    };
    this.ws.send(JSON.stringify(newMsg))
  }

  public connectWS() {
    this.ws = new WebSocket(this.host);
    this.ws.onopen = () => {
      this.logger.Debug('Connected to Signaler');
    };


    this.ws.onmessage = (data: any): void => {
      this.logger.Trace(data);
      const parsedMessage = JSON.parse(data.data);
      switch (parsedMessage.Type) {
        // When client registration success
        case types.RegSuccessType:
          this.robotID = parsedMessage.Payload.RobotID; // Set the RobotID to indicate that client websocket is registered
          this.logger.Info(`Successfully registered with ${this.robotID}`);
          break;

        // When a SDP offer response is received
        case types.OfferResponseMsgType:
          this.logger.Debug('Received offer response');
          this.logger.Trace(parsedMessage.Payload.SDPStr);
          // TODO: Handle WebRTC offer response
          break;

        // Catch-all for unhandled types; we shouldn't reach here unless there was an out-of-spec message
        default:
          console.warn(`Client received unhandled message type: ${parsedMessage}`);
          break;
      }
    };

    this.ws.onclose = () => {
      this.robotID = "";  // Clear the RobotID since we are no longer connected
      this.logger.Debug('Client disconnected from Signaler');
      setTimeout(() => {
        this.connectWS();
      }, 1000); // Retry connection every second
    }

  }

  public close() {
    this.logger.Debug("Closing websocket connection to Signaler...");
    this.robotID = "";  // Clear the RobotID since we are no longer connected
    this.ws.close();
  }
}