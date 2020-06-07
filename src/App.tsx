import React from 'react';
import './App.css';
import { printBanner } from './lib/banner';
import { Config } from './config';
import {WebSocketClient} from './lib/websocket'
class App extends React.Component {
  config: Config
  rt: WebSocketClient

  constructor(props: any) {
    super(props);
    this.config = new Config();
    this.rt = new WebSocketClient(this.config.signalingHost);
  }
  
  public componentDidMount() {
    this.rt.register();
    printBanner(this.config.versionHash);
  }

  public componentWillUnmount() {
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
