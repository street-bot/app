import React from 'react';
import './App.css';
import { printBanner } from './lib/banner';
import { Config } from './config';
import { ControlTerminal } from './components/controlTerminal';

class App extends React.Component {
  private config: Config;

  constructor(props: any) {
    super(props);
    this.config = new Config();
  }

  public componentDidMount() {
    printBanner(this.config.versionHash);
  }

  public render() {
    return(
      <div className="App">
      <header className="App-header">
        <p>
          streetbot-app
        </p>
      </header>
      <ControlTerminal />
    </div>
    )
  }
}

export default App;
