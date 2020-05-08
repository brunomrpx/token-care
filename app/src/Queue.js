import React from 'react';
import { View, Text } from 'react-native';

// transforms milliseconds to a string of 'HH:mm:ss'
const millisecondsToTime = milliseconds => {
  let seconds = parseInt((milliseconds / 1000) % 60, 10);
  let minutes = parseInt((milliseconds / (1000 * 60)) % 60, 10);
  let hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24, 10);

  hours = String(hours).padStart(2, 0);
  minutes = String(minutes).padStart(2, 0);
  seconds = String(seconds).padStart(2, 0);

  return `${hours}:${minutes}:${seconds}`;
}

export class Queue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: null,
      next: null,
      averageWaitingTime: null,
    };
  }

  static getDerivedStateFromProps({ selected, queue, averageWaitingTime }) {
    const [current] = selected;
    const [next] = queue;

    return { current, next, averageWaitingTime: millisecondsToTime(averageWaitingTime) };
  }

  render() {
    return (
      <View>
        <Text>Current: {this.state.current && this.state.current._id || 'Unavailable'}</Text>
        <Text>Next: {this.state.next && this.state.next._id || 'Unavailable'}</Text>
        <Text>Average waiting time: {this.state.averageWaitingTime}</Text>
      </View>
    )
  }
}
