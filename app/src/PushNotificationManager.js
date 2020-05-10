import { useEffect } from 'react'
import { AsyncStorage } from 'react-native';
import PushNotification from 'react-native-push-notification'

const PushNotificationManager = () => {
  useEffect(() => {
    PushNotification.configure({
      onRegister: function(token) {
        AsyncStorage.setItem('deviceId', token.token);
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification)
        // process the notification here
      },
      // Android only: GCM or FCM Sender ID
      // senderID: '256218572662',
      popInitialNotification: true,
      requestPermissions: true
    })
  }, [])
  return null
}

export default PushNotificationManager
