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
      selected: [],
      averageWaitingTime: 0
    };

    const callbackEvents = { onUpdateQueue: this.updateQueue.bind(this) };
    this.socketService = new SocketService('http://localhost:3000', callbackEvents);
  }

  millisecondsToTime(milliseconds) {
    let seconds = parseInt((milliseconds / 1000) % 60);
    let minutes = parseInt((milliseconds / (1000 * 60)) % 60);
    let hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24);
  
    hours = String(hours).padStart(2, 0);
    minutes = String(minutes).padStart(2, 0);
    seconds = String(seconds).padStart(2, 0);
  
    return `${hours}:${minutes}:${seconds}`;
  }

  updateQueue(structure) {
    this.setState({ ...structure });
  }

  render() {
    return (
      <div>
        <div className="container is-fluid" style={{ padding: '10px 10px 10px' }}>
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
              <div className="is-pulled-right">Average waiting time: {this.millisecondsToTime(this.state.averageWaitingTime)}</div>
            </div>
          </div>
          <TokenTabs 
            structure={this.state} 
            onFinish={(token) => this.socketService.finish(token)} 
            onDelete={(token) => this.socketService.delete(token)} />
        </div>
      </div>
    );
  }
}

export default App;
