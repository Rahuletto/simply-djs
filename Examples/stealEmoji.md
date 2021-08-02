# stealEmoji function
#### This is an example of stealEmoji

## With Customization
```js
const simplydjs = require('simply-djs')
// message event
// steal command
simplydjs.stealEmoji(message, args, {
    embedTitle: 'Title', // default: `Emoji Added ;)`
    embedColor: 'hex code', //default: #075FFF;
    embedFoot: 'Text for Footer', // default: 'Stop stealing.. its illegal.'
    failedMsg: 'sorry emoji not found' //default: "Couldn't find an emoji from it"
})
```

## Without Customization
```js
const simplydjs = require('simply-djs')
// message event
// steal command
simplydjs.stealEmoji(message, args)
```
# Output
![image](https://user-images.githubusercontent.com/71836991/127869837-880e67da-9a32-4df7-a070-6f2ae89e6a3f.png)

<br>

# Options for stealEmoji function (Optional)
### Embed
- **embedTitle:** The Embed Title of the embed which is sent after uploading the emoji
- **embedColor:** The Embed Color of the embed which is sent after uploading the emoji
- **embedFoot:** The Embed Footer of the embed which is sent after uploading the emoji
- **failedMsg:** The message sent when emoji id is invalid (or) emoji not found
