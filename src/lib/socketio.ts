import socketIOClient from "socket.io-client";

export class SIOClient {
  private client: SocketIOClient.Socket | undefined;
  private signalerHost: string

  constructor(signalerHost: string) {
    this.signalerHost = signalerHost
  }

  public register() {
    this.client = socketIOClient(this.signalerHost);
    this.client.on("connection", () => {
      console.log("connected!")
    })
  }
}