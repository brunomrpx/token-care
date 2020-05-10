import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
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
    let seconds = parseInt((milliseconds / 1000) % 60, 10);
    let minutes = parseInt((milliseconds / (1000 * 60)) % 60, 10);
    let hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24, 10);

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
      <div className="container-fluid p-5">
        <div className="row mb-5">
          <div className="col">
            <button className="btn btn-primary mr-2" onClick={() => this.socketService.create()}>Create Token</button>
            <button className="btn btn-success" onClick={() => this.socketService.next()}>Next</button>
          </div>
          <div className="col text-right">
            Average waiting time: {this.millisecondsToTime(this.state.averageWaitingTime)}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TokenTabs
              structure={this.state}
              onFinish={(token) => this.socketService.finish(token)}
              onDelete={(token) => this.socketService.delete(token)} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
