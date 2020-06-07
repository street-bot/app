// WebSocket client
import cryptoRandomString from 'crypto-random-string';

export class WebSocketClient {
    ws: WebSocket; 
    private session: string;
    private host: string;

    constructor(host: string) {
        this.host = host;
        this.session = "";
    }

    public register() {
        console.log(this.host);
        this.session = cryptoRandomString({length: 32, type: 'url-safe'});
        this.ws = new WebSocket(this.host+"?token=" + this.session);
        this.ws.onopen = () => {
            console.log("connected!");
            const p = {
                Type: "CReg", 
                Payload: {
                    RobotID: "streetbot-1"
                }
            };
            this.ws.send(JSON.stringify(p));
            console.log("sent registration!");
        };
    
        this.ws.onmessage = (data: any): void => {
          const message = JSON.parse(data.data);
          console.log(message)

          const offerStr = "=";
          if (message.Type === "RegSuccess"){
            let newMsg = {
                Type: "Offer", 
                Payload: {
                    SDPStr: offerStr
                }
            };
            this.ws.send(JSON.stringify(newMsg))
            console.log("sent offer")
          }
        };

        this.ws.onclose = () => {
            setTimeout(() => {
                this.register();
            }, 1000);
            console.log('connection closed!');
        }

    }

    public close() {
        this.ws.close();
    }
}