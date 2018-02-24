# Token Care API

## Routes

### ```HTTP GET /queue```
- Retrieve current queue state
#### Params: 
- showAll (boolean): Show deactivated tokens

### ```HTTP POST /queue/actions```
- Execute actions in queue. 
- Send action in body: ```{ "action": "actionName" }```
#### Actions:
- *next*: Deactivate the first token

### ```HTTP POST /queue/token```
- Creates a token, inserts at the end of the queue and return its value

### ```HTTP DELETE /queue/token/:id```
- Delete token with id from queue
