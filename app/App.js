import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: null,
      next: null,
      generated: null
    };
  }

  generateNewToken() {
    const generated = +new Date(); // TODO: call service

    this.setState({ generated });
  }

  revokeToken() {
    const state = this.state;
    delete state.generated;

    // TODO: call service

    this.setState(state);
  }

  render() {
    let contentView = (
      <View style={[themeStyle.btn, themeStyle.newTokenBtn]}>
        <Button title={'New Token'} color={'white'} onPress={() => this.generateNewToken()} />
      </View>
    );

    if (this.state.generated) {
      contentView = (
        <View style={{ width: '100%' }}>
          <Text style={themeStyle.yourToken}>Your token is: {this.state.generated}</Text>
          <View style={[themeStyle.btn, themeStyle.revokeTokenBtn]}>
            <Button title={'Revoke Token'} style={{ fontSize: 20 }} color={'white'} onPress={() => this.revokeToken()} />
          </View>
        </View>
      );
    }

    return (
      <View style={themeStyle.mainContainer}>
        {contentView}
        <View style={themeStyle.tokenQueueContainer}>
          <Text>Current: {this.state.current || 'Unavailable'}</Text>
          <Text>Next: {this.state.next || 'Unavailable'}</Text>
        </View>
      </View>
    );
  }
}

const themeStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: 20
  },
  btn: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%'
  },
  newTokenBtn: {
    backgroundColor: '#008CFF'
  },
  revokeTokenBtn: {
    backgroundColor: '#FF3333',
  },
  yourToken: {
    fontSize: 30, 
    textAlign: 'center',
    marginBottom: 20
  },
  tokenQueueContainer: {
    marginRight: 'auto',
    marginVertical: 20
  }
});
