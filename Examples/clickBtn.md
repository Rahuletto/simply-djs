# clickBtn function
#### This is an example of clickBtn (Need to use this function when using ticketSystem)
<br>

## With Cusomizations
```js
const simplydjs = require('simply-djs')

client.on('clickButton', async(button) => { 
    // a discord-buttons event which fires when a button gets clicked
simplydjs.clickBtn(button, {
    embedDesc: 'embed description',
    embedColor: 'hex code', // default: #075FFF
    closeColor: 'color from buttons', //default: blurple
    closeEmoji: 'emoji id', // default: 🔒
    delColor: 'color from buttons', // default: grey
    delEmoji: 'emoji id', // default: ❌
    openColor: 'color from buttons' , // default: green
    openEmoji: 'emoji id' // default: 🔓
    })
})
```
## Without Cusomizations
```js
const simplydjs = require('simply-djs')

client.on('clickButton', async(button) => { 
    // a discord-buttons event which fires when a button gets clicked
simplydjs.clickBtn(button)
})
```

# Options for clickBtn function (Optional)
### Embed
- **embedDesc:** The Embed Description of the embed which is sent when the ticket has been opened
- **embedColor:** The Embed Color of the embed which is sent when the ticket has been opened

### Close Ticket Button
- **closeColor:** The color of the Close Ticket Button (Only red, green, grey/gray, blurple allowed)
- **closeEmoji:** The emoji for the Close Ticket Button (Only Emoji ID)

### Delete Ticket Button
- **delColor:** The color of the Delete Ticket Button (Only red, green, grey/gray, blurple allowed)
- **delEmoji:** The emoji for the Delete Ticket Button (Only Emoji ID)

### Reopen Ticket Button
- **openColor:** The color of the Delete Ticket Button (Only red, green, grey/gray, blurple allowed)
- **openEmoji:** The emoji for the Delete Ticket Button (Only Emoji ID)
