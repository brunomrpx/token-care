import React, { Component } from 'react';
import io from 'socket.io-client';

import 'bulma/css/bulma.css'
import './App.css';
import TokenGrid, { Types } from './TokenGrid';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      queue: [],
      finished: [],
      selected: [],
      activeTab: Types.Queue
    };

    this.socket = io.connect('http://localhost:3000');

    this.socket.on('connect', () => console.log('-> connected'));
    this.socket.on('queue-updated', queue => this.updateQueue(queue));
  }

  updateQueue(structure) {
    console.log('-> update queue: ', structure);
    this.setState({ ...structure });
  }

  createToken() {
    this.socket.emit('create-token');
  }

  next() {
    this.socket.emit('next-token');
  }

  finishToken(token) {
    this.socket.emit('finish-token', token.id);
  }

  selectTab(name) {
    this.setState({ activeTab: name });
  }

  render() {
    const { queue, selected, finished } = this.state;
    const contentMap = {
      [Types.Queue]: { title: 'Queue', tokens: queue },
      [Types.Finished]: { title: 'Finished', tokens: finished },
      [Types.Selected]: { title: 'Selected', tokens: selected }
    };

    return (
      <div>
        <div className="container" style={{ paddingTop: '10px' }}>
          <div className="columns">
            <div className="column">
              <div className="field is-grouped">
                <p className="control">
                  <button className="button is-primary" onClick={() => this.createToken()}>Create Token</button>
                </p>
                <p className="control">
                  <button className="button is-info" onClick={() => this.next()}>Next</button>
                </p>
              </div>
            </div>
          </div>
          <div className="tabs">
            <ul>
              {Object.keys(contentMap).map(type => (
                <li key={type} className={String(this.state.activeTab) === type ? 'is-active' : ''} onClick={() => this.selectTab(type)}>
                  <a>{contentMap[type].title}</a>
                </li>
              ))}
            </ul>
          </div>
          <TokenGrid type={this.state.activeTab} tokens={contentMap[this.state.activeTab].tokens} onFinish={(token) => this.finishToken(token)}></TokenGrid>
        </div>
      </div>
    );
  }
}

export default App;
