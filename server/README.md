# Token Care Websocket Server

## Events

### ```next-token```
- Deactivate the first active token

### ```create-token```
- Creates a token and inserts at the end of the queue

### ```revoke-token```
- Delete token with specified id from queue

### ```queue-updated```
- Emitted on queue update

### ```token-created```
- Emitted after a successfull ```create-token``` action

### ```token-revoked```
- Emitted after a successfull ```revoke-token``` action
