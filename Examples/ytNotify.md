# ytNotify function (UNDER MAINTENANCE)
#### This is an example of ytNotify (May cause errors and issues)
<br>

## With Customization
```js
const simplydjs = require('simply-djs')


// ready event
simplydjs.ytNotify('channel id', {
  ytID: 'channel ID', // youtube channel ID from url
  // Use ytID or ytURL. Dont use both.
  ytURL: 'channel URL', // youtube channel URL

  youtubeKEY: 'Google API Key', // Get api key from google dev console (optional)
  timer: 'number' // default: 60000 (1 minute)
  msg: 'Hello someone posted', // default: Hello ! **{author}** just uploaded a new video **{title}**\n\n*{url}*
  // NOTE: You should use these variables ({author} , {title}, {url}) to build the message (and) NO EMBEDS ALLOWED
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')

// ready event
simplydjs.ytNotify('channel id', {
  ytID: 'channel ID', // youtube channel ID from url
  // Use ytID or ytURL. Dont use both.
  ytURL: 'channel URL', // youtube channel URL
})
```

# Options for ytNotify function [(Required)](https://github.com/Rahuletto/simply-djs/edit/main/Examples/ytNotify.md)
- **ytID:** Youtube channel ID from the URL
### (or)
- **ytURL:** Youtube channel URL

### You need to specify atleast ytID (or) ytURL

# Options for ytNotify function (Optional)
- **timer:** The Time between Refreshes to check if the youtuber posted (Going below 60000 [1 minute] will create problems)
- **msg:** Message sent when the youtuber posts a video
- **youtubeKEY:** Youtube API key from the Google Developer Console

### Note: You will face delays (5-15 minutes) if you are not using API Key

## This function is still buggy so please contact our [Discord Server](https://discord.gg/3JzDV9T5Fn)
