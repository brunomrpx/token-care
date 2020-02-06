import React from 'react';
import { View, Text, Button } from 'react-native';

import { themeStyle } from './themeStyle';

export class MyToken extends React.Component {
  render() {
    return (
      <View>
        <Text style={themeStyle.yourToken}>Your token is: {this.props.token.id}</Text>
        <View style={[themeStyle.btn]}>
          <Button title={'Revoke Token'} style={{ fontSize: 20 }} color={'red'} onPress={() => this.props.onRevokeToken()} />
        </View>
      </View>
    )
  }
}
