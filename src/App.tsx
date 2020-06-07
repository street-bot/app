import React from 'react';
import './App.css';
import { printBanner } from './lib/banner';
import { Config } from './config';
import {WebSocketClient} from './lib/websocket';

class App extends React.Component {
  config: Config
  wsc: WebSocketClient

  constructor(props: any) {
    super(props);
    this.config = new Config();
    this.wsc = new WebSocketClient(this.config.signalingHost);
  }

  public componentDidMount() {
    printBanner(this.config.versionHash);
    this.wsc.connectWS();
  }

  public componentWillUnmount() {
    this.wsc.close()
  }

  public render() {
    return(
      <div className="App">
      <header className="App-header">
        <p>
          streetbot-app
        </p>
      </header>
    </div>
    )
  }
}

export default App;
