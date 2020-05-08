import { StyleSheet } from 'react-native';

export const themeStyle = StyleSheet.create({
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
  yourToken: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20
  },
  yourTurn: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: 'green'
  },
  youAreNext: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: 'orange'
  },
  tokenQueueContainer: {
    marginRight: 'auto',
    marginVertical: 20
  }
});
