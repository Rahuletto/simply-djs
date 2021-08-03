# chatbot function
#### This is an example of chatbot
<br>

## With Customization
```js
const simplydjs = require('simply-djs')

// message event
simplydjs.chatbot(client, message, {
chid: 'channel id',
name: 'chatbot', // default: Your bot name
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')

// message event
simplydjs.chatbot(client, message, {
chid: 'channel id',
})
```
# Output
![image](https://user-images.githubusercontent.com/71836991/128004987-058f76b2-37ff-4009-a14e-e69cd8cb3747.png)

<br>

# Options for chatbot function (Required)
- **chid:** Channel id for where to speak (Can be an array)

# Options for chatbot function (Optional)
- **name:** ChatBot name
