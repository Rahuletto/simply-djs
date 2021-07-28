# tictactoe function
#### This is an example of tictactoe (discord-buttons required)
<br>

## With Customization
```js
const simplydjs = require('simply-djs')

// message event
// tictactoe command
simplydjs.tictactoe(message, {
    xEmoji: 'emoji id', //default: ❌
    oEmoji: 'emoji id', //default: ⭕
    idleEmoji: 'emoji id', //default: ➖
    embedColor: 'hex code', //default: #075FFF
    embedFoot: 'text for footer' //default: 'Make sure to win ;)' 
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')

// message event
// tictactoe command
simplydjs.tictactoe(message)
```

# Options for tictactoe function (Optional)
### Embed
- **embedFoot:** The Embed Foot of the embed which is sent when the ticket has been opened
- **embedColor:** The Embed Color of the embed which is sent when the ticket has been opened

### Buttons
- **xEmoji:** Emoji for X user [Player 1] (Only Emoji ID)
- **oEmoji:** Emoji for O user [Player 2] (Only Emoji ID)
- **idleEmoji:** Emoji when the space is not occupied (Only Emoji ID)
