import React from 'react';
import { View, Text } from 'react-native';

export class Queue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: null,
      next: null
    };
  }

  componentWillReceiveProps(props) {
    const [current, next] = props.queue;

    this.setState({ current, next });
  }

  render() {
    return (
      <View>
        <Text>Current: {this.state.current && this.state.current.id || 'Unavailable'}</Text>
        <Text>Next: {this.state.next && this.state.next.id || 'Unavailable'}</Text>
      </View>
    )
  }
}
