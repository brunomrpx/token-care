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
      activeTab: Types.Selected
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

  getContentMap() {
    const { queue, selected, finished } = this.state;

    return new Map([
      [Types.Selected, { title: 'Selected', tokens: selected }],
      [Types.Queue, { title: 'Queue', tokens: queue }],
      [Types.Finished, { title: 'Finished', tokens: finished }],
    ]);
  }

  getTabItems(contentMap) {
    const tabItems = [];

    for (const [key, value] of contentMap.entries()) {
      tabItems.push(
        <li key={key} className={this.state.activeTab === key ? 'is-active' : ''} onClick={() => this.selectTab(key)}>
          <a>{value.title}</a>
        </li>
      );
    }

    return tabItems;
  }

  render() {
    const contentMap = this.getContentMap();
    const tabItems = this.getTabItems(contentMap);

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
            <ul>{tabItems}</ul>
          </div>
          <TokenGrid type={this.state.activeTab} tokens={contentMap.get(this.state.activeTab).tokens} onFinish={(token) => this.finishToken(token)}></TokenGrid>
        </div>
      </div>
    );
  }
}

export default App;
