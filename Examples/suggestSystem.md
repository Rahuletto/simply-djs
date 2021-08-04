# suggestSystem function
#### This is an example of suggestSystem (discord-buttons required)
<br>

## With Customization
```js
const simplydjs = require('simply-djs')
let users = new Map()
// (or) let db = require('quick.db')

client.on('clickButton', async (button) => {

simplydjs.suggestBtn(button, users, {
   yesEmoji: 'emoji id', // default: ☑️
   yesColor: 'buttonColor', // default: green 
   noEmoji: 'emoji id', // default: X
   noColor: 'buttonColor', // default: red
   denyEmbColor: 'hex color', // default: RED
   agreeEmbColor: 'hex color', // default: GREEN
   })
   
})
// message event
simplydjs.suggestSystem(client, message, args, {
   chid: 'channel id',
   embedColor: 'hex color', // defaultL #075FFF
   yesEmoji: 'emoji id', // default: ☑️
   yesColor: 'buttonColor', // default: green 
   noEmoji: 'emoji id', // default: X
   noColor: 'buttonColor', // default: red
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')
let users = new Map()
// (or) let db = require('quick.db')

client.on('clickButton', async (button) => {
   simplydjs.suggestBtn(button, users)
})
// message event
simplydjs.suggestSystem(client, message, args, {
   chid: 'channel id'
})
```
# Output
![image](https://user-images.githubusercontent.com/71836991/128165290-aa3f9c50-1fc3-4f5c-805d-e32e0e0b7be3.png)

<br>

# Options for suggestBtn function (Optional)
### Buttons
- **yesEmoji:** Emoji for Accept suggestion button (Only Emoji ID)
- **yesColor:** Color for the Accept Suggestion button (Only blurple/red/green/grey)
- **noEmoji:** Emoji for Reject suggestion button (Only Emoji ID)
- **noColor:** Color for the Reject suggestion button (Only blurple/red/green/grey)

### Embeds
- **denyEmbColor:** Color for the Rejected Suggestion embed (Hex code)
- **agreeEmbColor:** Color for the Accepted Suggestion embed (Hex code)

# Options for suggestSystem function (Optional)
### Buttons
- **yesEmoji:** Emoji for Accept suggestion button (Only Emoji ID)
- **yesColor:** Color for the Accept Suggestion button (Only blurple/red/green/grey)
- **noEmoji:** Emoji for Reject suggestion button (Only Emoji ID)
- **noColor:** Color for the Reject suggestion button (Only blurple/red/green/grey)

### Embeds
- **embedColor:** Color for the Suggestion embed (Hex code)
- **credit:** Give credits to this package (Boolean [true/false]) Default: true
