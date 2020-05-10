import React from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import SocketIOClient from 'socket.io-client';

import { themeStyle } from './src/themeStyle';
import { Queue } from './src/Queue';
import { MyToken } from './src/MyToken';
import { NewToken } from './src/NewToken';
import PushNotificationManager from './src/PushNotificationManager';

// default socket URL is the IP that Android emulator uses for local machine
const socketUrl = process.env.SOCKET_URL || "http://10.0.2.2:3000";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      queue: [],
      selected: [],
      finished: [],
      myToken: null,
      averageWaitingTime: null,
    };

    this.socket = SocketIOClient(socketUrl, {
      transports: ['websocket']
    });

    this.socket.on('connect', () => this.setState({ loading: false }));
    this.socket.on('token-created', token => this.saveMyToken(token));
    this.socket.on('token-revoked', () => this.deleteMyToken());
    this.socket.on('queue-updated', structure => this.refreshQueue(structure));

    // reset token state
    // this.emitRevokeToken();
    // this.deleteMyToken();

    this.restoreState();
  }

  async restoreState() {
    const myToken = JSON.parse(await AsyncStorage.getItem('myToken'));

    this.setState({ myToken });
  }

  async emitCreateToken() {
    const deviceId = await AsyncStorage.getItem('deviceId');
    this.socket.emit('create-token', deviceId);
  }

  emitRevokeToken() {
    this.socket.emit('revoke-token', this.state.myToken._id);
  }

  refreshQueue({ queue, selected, finished, averageWaitingTime }) {
    this.setState({ queue, selected, finished, averageWaitingTime });
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

    console.log('current state: ', this.state);

    if (this.state.myToken) {
      const isYourTurn = this.state.selected.some(token => token._id == this.state.myToken._id);
      const isFinished = this.state.finished.some(token => token._id == this.state.myToken._id && !!token.finishDate);
      const [nextItemOfQueue] = this.state.queue;
      const isYouNext = nextItemOfQueue && nextItemOfQueue._id === this.state.myToken._id;

      actionView =
        <MyToken
            token={this.state.myToken}
            isYourTurn={isYourTurn}
            isYouNext={isYouNext}
            isFinished={isFinished}
            onClearToken={() => this.deleteMyToken()}
            onRevokeToken={() => this.emitRevokeToken()}
        />;
    }

    return (
      <View style={{ width: '100%' }}>
        { actionView }
        <View style={themeStyle.tokenQueueContainer}>
          <Queue queue={this.state.queue} selected={this.state.selected} averageWaitingTime={this.state.averageWaitingTime} />
        </View>
      </View>
    );
  }

  render() {
    let loadingView = <ActivityIndicator></ActivityIndicator>;

    return (
      <View style={themeStyle.mainContainer}>
        {this.state.loading ? loadingView : this.getContentView()}
        <PushNotificationManager />
      </View>
    );
  }
}
