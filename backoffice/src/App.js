import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: [],
      finished: [],
      selected: []
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

  getRows(queue) {
    if (queue && queue.length > 0) {
      return queue.map(token => (
        <tr key={token.id}>
          <td>{token.id}</td>
          <td>{token.createDate}</td>
        </tr>
      ));
    }
    
    return (
      <tr>
        <td>There is no token created</td>
      </tr>
    );
  }

  showSelectedTokens(tokens) {
    if (tokens.length === 0) {
      return <div>No selected tokens</div>;
    }
    
    return (
      <ul>
        {tokens.map(token => (
          <li key={token.id}>{token.createDate} - {token.id} <button onClick={() => this.finishToken(token)}>Finish</button></li>
        ))}
      </ul>
    );
  }

  render() {
    const { queue, selected } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Token Care Backoffice</h1>
        </header>
        <p className="App-intro">
          <button onClick={() => this.createToken()}>Create Token</button>
          <button onClick={() => this.next()}>Next</button>
        </p>
        {this.showSelectedTokens(selected)}
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {this.getRows(queue)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
