import React, { Component } from 'react';

import 'bulma/css/bulma.css'
import './App.css';

import TokenTabs from './token/TokenTabs';
import { SocketService } from './socket/SocketService';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      queue: [],
      finished: [],
      selected: []
    };

    const callbackEvents = { onUpdateQueue: this.updateQueue.bind(this) };
    this.socketService = new SocketService('http://localhost:3000', callbackEvents);
  }

  updateQueue(structure) {
    this.setState({ ...structure });
  }

  render() {
    return (
      <div>
        <div className="container" style={{ paddingTop: '10px' }}>
          <div className="columns">
            <div className="column">
              <div className="field is-grouped">
                <p className="control">
                  <button className="button is-primary" onClick={() => this.socketService.create()}>Create Token</button>
                </p>
                <p className="control">
                  <button className="button is-info" onClick={() => this.socketService.next()}>Next</button>
                </p>
              </div>
            </div>
          </div>
          <TokenTabs structure={this.state} onFinish={(token) => this.socketService.finish(token)} />
        </div>
      </div>
    );
  }
}

export default App;
