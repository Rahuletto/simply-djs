# ytNotify function (BETA)
#### This is an example of ytNotify (May cause errors and issues)
<br>

## Setup
#### You really need quick.db to check if the video is already posted.
```
npm install quick.db
```
#### Didn't work ? Giving errors when downloading quick.db ? Try this !
```
npm install python
```
#### Then try to install quick.db
<br>

## With Customization
```js
const simplydjs = require('simply-djs')
 
const db = require('quick-db') // REQUIRED (to check if the vid is already posted in discord)
const startAt = Date.now() // REQUIRED (to check if the vid is uploaded after the bot started)

// ready event
simplydjs.ytNotify(client, db, {
 ytID: 'yt channel id', // channel id from URL || You can also make as Array like ['channel 1', 'channel 2']
 // Use ytID or ytURL. Dont use both.
 ytURL: 'yt channel URL', // channel URL || You can also make as Array like ['channel 1', 'channel 2']
 
 chid: 'discord channel id', // Discord channel id to post the message
 startAt: startAt, // REQUIRED (to check if the vid is uploaded after the bot started)

msg: 'Hello someone posted', // default: Hello ! **{author}** just uploaded a new video **{title}**\n\n*{url}*
  // NOTE: You should use these variables ({author} , {title}, {url}) to build the message
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')
 
const db = require('quick-db') // REQUIRED (to check if the vid is already posted in discord)
const startAt = Date.now() // REQUIRED (to check if the vid is uploaded after the bot started)

// ready event
simplydjs.ytNotify(client, db, {
 ytID: 'yt channel id', // channel id from URL || You can also make as Array like ['channel 1', 'channel 2']
 // Use ytID or ytURL. Dont use both.
 ytURL: 'yt channel URL', // channel URL || You can also make as Array like ['channel 1', 'channel 2']
 
 chid: 'discord channel id', // Discord channel id to post the message
 startAt: startAt, // REQUIRED (to check if the vid is uploaded after the bot started)
})
```

# Options for ytNotify function [(Required)](https://github.com/Rahuletto/simply-djs/edit/main/Examples/ytNotify.md)
- **ytID:** Youtube channel ID from the URL
### (or)
- **ytURL:** Youtube channel URL
- **chid:** Discord channel id to post message there
- **startAt:** This checks if the video is posted after starting the bot.

### You need to specify atleast ytID (or) ytURL

# Options for ytNotify function (Optional)
- **msg:** Message sent when the youtuber posts a video

## This function is still buggy so please contact our [Discord Server](https://discord.gg/3JzDV9T5Fn)
