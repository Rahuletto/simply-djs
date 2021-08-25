# ticketSystem function
#### This is an example of ticketSystem (discord-buttons required)
<br>

## With Customization
```js
const simplydjs = require('simply-djs')

    // interactionCreate
simplydjs.clickBtn(interaction, {
    embedDesc: 'embed description',
    embedColor: 'hex code', // default: #075FFF
    closeColor: 'color from buttons', //default: blurple
    closeEmoji: 'emoji id', // default: 🔒
    delColor: 'color from buttons', // default: grey
    delEmoji: 'emoji id', // default: ❌
    openColor: 'color from buttons' , // default: green
    openEmoji: 'emoji id', // default: 🔓
    timeout: true, // default: true | Needs to be boolean (true/false)
    cooldownMsg: 'message',
    categoryID: 'category id',
    role: 'role id' // Role which sees the ticket channel (like Support Role)
    })

// messageCreate event
// setup-ticket command

simplydjs.ticketSystem(message, message.channel, {
     embedDesc: 'embed description', // default: '🎫 Create a ticket by clicking the button 🎫'
    embedColor: 'hex code', // default: #075FFFF
    embedFoot: 'footer text', // default: message.guild.name
    emoji: 'emoji id', // default:, 🎫
    color: 'color from buttons', // default: blurple
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')

// interactionCreate event
simplydjs.clickBtn(button)

// messageCreate event
// setup-ticket command

simplydjs.ticketSystem(message, message.channel)
```
# Output
![image](https://user-images.githubusercontent.com/71836991/127871121-30c49c7f-7b18-48df-bb93-969213817e19.png)

![image](https://user-images.githubusercontent.com/71836991/127871158-f13ee7a9-8cbe-415c-8e54-49c197accb32.png)

<br>

# Options for clickBtn function (Optional)
### Embed
- **embedDesc:** The Embed Description of the embed which is sent when the ticket has been opened
- **embedColor:** The Embed Color of the embed which is sent when the ticket has been opened
- **credit:** Give credits to this package (Boolean [true/false]) Default: true

### Close Ticket Button
- **closeColor:** The color of the Close Ticket Button (Only red, green, grey/gray, blurple allowed)
- **closeEmoji:** The emoji for the Close Ticket Button (Only Emoji ID)

### Delete Ticket Button
- **delColor:** The color of the Delete Ticket Button (Only red, green, grey/gray, blurple allowed)
- **delEmoji:** The emoji for the Delete Ticket Button (Only Emoji ID)

### Reopen Ticket Button
- **openColor:** The color of the Delete Ticket Button (Only red, green, grey/gray, blurple allowed)
- **openEmoji:** The emoji for the Delete Ticket Button (Only Emoji ID)

### Other
- **timeout:** Timeout which deletes the ticket after 10 minutes to reduce clutter (Only boolean [true (or) false] )
- **cooldownMsg:** Message sent when a ticket is already opened by the user.

# Options for ticketSystem function (Optional)
### Embed
- **embedDesc:** The Description for the Ticket System Embed (Embed that has ticket button that opens a ticket)
- **embedColor:** The Color of the Ticket System Embed (Embed that has ticket button that opens a ticket)
- **embedFoot:** The Footer for the Ticket System Embed (Embed that has ticket button that opens a ticket)
- **credit:** Give credits to this package (Boolean [true/false]) Default: true

### Buttons
- **emoji:** The Emoji for the Ticket Button which opens a ticket (Only Emoji ID)
- **color:** The Color for the Ticket Button which opens a ticket. (Only red, green, grey/gray, blurple allowed)
