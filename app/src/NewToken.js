import React from 'react';
import { View, Text, Button } from 'react-native';

import { themeStyle } from './themeStyle';

export class NewToken extends React.Component {
  render() {
    return (
      <View style={[themeStyle.btn]}>
        <Button title={'New Token'} color={'blue'} onPress={() => this.props.onNewToken()} />
      </View>
    );
  }
}
