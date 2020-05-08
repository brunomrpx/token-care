import React from 'react';
import { View, Text, Button } from 'react-native';

import { themeStyle } from './themeStyle';

export class MyToken extends React.Component {

  getFinishedContent() {
    return (
      <View>
        <Text style={themeStyle.youAreNext}>Your token has been collected</Text>
        <Button title={'Clear'} style={{ fontSize: 20 }} color={'green'} onPress={() => this.props.onClearToken()} />
      </View>
    );
  }

  getWaitingContent() {
    return (
      <View>
          {this.props.isYourTurn && <Text style={themeStyle.yourTurn}>It's your turn!</Text>}
          {this.props.isYouNext && <Text style={themeStyle.youAreNext}>You're the next</Text>}
          <Button title={'Revoke Token'} style={{ fontSize: 20 }} color={'red'} onPress={() => this.props.onRevokeToken()}></Button>
      </View>
    );
  }

  render() {
    return (
      <View>
        <Text style={themeStyle.yourToken}>Your token is: {"\n"}{this.props.token._id}</Text>
        <View style={[themeStyle.btn]}>
          { this.props.isFinished ? this.getFinishedContent() : this.getWaitingContent() }
        </View>
      </View>
    )
  }
}
