import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: []
    };

    this.socket = io.connect('http://localhost:3000');

    this.socket.on('connect', () => console.log('-> connected'));
    this.socket.on('queue-updated', queue => this.updateQueue(queue));
  }

  updateQueue(queue) {
    console.log('-> update queue: ', queue);
    this.setState({ queue });
  }

  createToken() {
    this.socket.emit('create-token');
  }

  next() {
    this.socket.emit('next-token');
  }

  getRows(queue) {
    if (queue && queue.length > 0) {
      return queue.map(token => (
        <tr key={token.id}>
          <td>{token.id}</td>
          <td>{token.date}</td>
          <td>{token.active ? 'Active' : 'Inactive'}</td>
        </tr>
      ));
    }
    
    return (
      <tr>
        <td>There is no token created</td>
      </tr>
    );
  }

  showActiveToken(token) {
    if (token && token.active) {
      return <div>{token.date} - {token.id}</div>;
    }

    return <div>No active token</div>
  }

  render() {
    const [nextToken, ...queue] = this.state.queue;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Token Care Backoffice</h1>
        </header>
        <p className="App-intro">
          <button onClick={() => this.createToken()}>Create Token</button>
          <button onClick={() => this.next()}>Next</button>
        </p>
        {this.showActiveToken(nextToken)}
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Date</th>
              <th>Active</th>
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
