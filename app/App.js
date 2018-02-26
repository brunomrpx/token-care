import React from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import SocketIOClient from 'socket.io-client';

import { themeStyle } from './src/themeStyle';
import { Queue } from './src/Queue';
import { MyToken } from './src/MyToken';
import { NewToken } from './src/NewToken';

const socketUrl = process.env.SOCKET_URL;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      queue: [],
      myToken: null
    };

    this.socket = SocketIOClient(socketUrl, {
      transports: ['websocket']
    });

    this.socket.on('connect', () => this.setState({ loading: false }));
    this.socket.on('token-created', token => this.saveMyToken(token));
    this.socket.on('token-revoked', () => this.deleteMyToken());
    this.socket.on('queue-updated', queue => this.updateQueue(queue));

    this.restoreState();
  }

  async restoreState() {
    const myToken = JSON.parse(await AsyncStorage.getItem('myToken'));

    this.setState({ myToken });
  }

  emitCreateToken() {
    this.socket.emit('create-token');
  }

  emitRevokeToken() {
    this.socket.emit('revoke-token', this.state.myToken);
  }

  updateQueue(queue) {
    this.setState({ queue });
  }

  deleteMyToken() {
    const state = this.state;
    delete state.myToken;

    this.setState(state);

    AsyncStorage.removeItem('myToken');
  }

  saveMyToken(myToken) {
    AsyncStorage.setItem('myToken', JSON.stringify(myToken));

    this.setState({ myToken });
  }

  getContentView() {
    let actionView = <NewToken onNewToken={() => this.emitCreateToken()} />;

    if (this.state.myToken) {
      actionView = <MyToken token={this.state.myToken} onRevokeToken={() => this.emitRevokeToken()} />;
    }

    return (
      <View style={{ width: '100%' }}>
        { actionView }
        <View style={themeStyle.tokenQueueContainer}>
          <Queue queue={this.state.queue} />
        </View>
      </View>
    );
  }

  render() {
    let loadingView = <ActivityIndicator></ActivityIndicator>;

    return (
      <View style={themeStyle.mainContainer}>
        {this.state.loading ? loadingView : this.getContentView()}
      </View>
    );
  }
}
