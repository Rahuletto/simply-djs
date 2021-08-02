# webhooks function
#### This is an example of webhooks (Easier way to send messages using webhooks)
<br>

## With Customization
```js
const simplydjs = require('simply-djs')

// any event
simplydjs.webhooks(client, {
    chid: 'channel id', // required
    msg: 'message (not embed)',
    embed: exampleEmbed, // an embed
    // u need atleast one (msg or embed) to send or it will give errors
    username: 'webhook username', // default: ur bot username
    avatar: 'webhook avatar', // default: ur bot avatar
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')

// any event
simplydjs.webhooks(client, {
    chid: 'channel id', // required
    msg: 'message (not embed)',
    embed: exampleEmbed, // an embed
    // u need atleast one (msg or embed) to send or it will give errors
})
```
# Output
![image](https://user-images.githubusercontent.com/71836991/127870208-e790a498-99af-4fcc-a359-1f90607c59a5.png)

<br>

# Options for webhooks function [(Required)](https://github.com/Rahuletto/simply-djs/edit/main/Examples/webhooks.md)
- **chid:** Channel id where you want to send the message
- **msg:** The Message you want to send using webhooks
### (or)
- **embed:** The Embed you want to send using webhooks

### You need to specify atleast an embed or message.

# Options for webhooks function (Optional)
- **username:** The Username of the webhook user
- **avatar:** The Avatar of the webhook user (Only URL)
