import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { printBanner } from './lib/banner';
import { Config } from './config';
import { ControlTerminal } from './components/controlTerminal';
import SiteNav from './components/Nav/SiteNav';
import { MainBody } from './components/Dashboard/MainBody';

class App extends React.Component {
  private config: Config;
  state: Readonly<{connected: boolean}>;
  constructor(props: any) {
    super(props);
    this.config = new Config();
    this.state = {
      connected: false
    };
  }

  public componentDidMount() {
    printBanner(this.config.versionHash);
  }

  public render() {
    return(
      <div className="App">
        <SiteNav />
        <MainBody 
          connected={this.state.connected} 
          setConnected={(newState: boolean) => this.setState({connected: newState})} 
        />
      <ControlTerminal />
    </div>
    );
  }
};

export default App;
