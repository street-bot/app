import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { printBanner } from './lib/banner';
import { Config } from './config';
import { ControlTerminal } from './components/ControlTerminal';
import SiteNav from './components/Nav/SiteNav';

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
        <ControlTerminal />
      </div>
    );
  }
};

export default App;
