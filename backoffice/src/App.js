import React, { Component } from 'react';
import io from 'socket.io-client';

import 'bulma/css/bulma.css'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: [],
      finished: [],
      selected: [],
      activeTab: 'selected'
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

  getRows(queue, showFinish) {
    if (!queue || queue.length === 0) {
      return (
        <tr>
          <td>No token found</td>
        </tr>
      );
    }
    
    return queue.map(token => (
      <tr key={token.id}>
        <td>{token.id}</td>
        <td>{token.createDate}</td>
        { showFinish && (
          <td>
            <button className="button is-warning" onClick={() => this.finishToken(token)}>Finish</button>
          </td>
        )}
      </tr>
    ));
  }

  getTable(tokens, showFinish = false) {
    return (
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            { showFinish && <th></th>}
          </tr>
        </thead>
        <tbody>
          {this.getRows(tokens, showFinish)}
        </tbody>
      </table>
    );
  }

  showSelectedTokens(tokens) {
    if (tokens.length === 0) {
      return <div className="column">No selected tokens</div>;
    }
    
    return (
      <div>
        <ul>
          {tokens.map(token => (
            <li key={token.id}>
              {token.createDate} - {token.id} 
              <button className="button is-warning" onClick={() => this.finishToken(token)}>Finish</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  selectTab(name) {
    this.setState({ activeTab: name });
  }

  render() {
    const { queue, selected } = this.state;
    const tabContent = { queue, selected };
    const showFinish = this.state.activeTab === 'selected';

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
              <li className={this.state.activeTab === 'selected' ? 'is-active' : ''} onClick={() => this.selectTab('selected')}>
                <a>Selected</a>
              </li>
              <li className={this.state.activeTab === 'queue' ? 'is-active' : ''} onClick={() => this.selectTab('queue')}>
                <a>Queue</a>
              </li>
            </ul>
          </div>
          {this.getTable(tabContent[this.state.activeTab], showFinish)}
        </div>
      </div>
    );
  }
}

export default App;
