# modmail function
#### This is an example of modmail
<br>

### Required
```
Intents.FLAGS.DIRECT_MESSAGES
```

### With Customization
```js
const simplydjs = require('simply-djs')

// messageCreate event
// modmail command
simplydjs.modmail(client, message, {
  content: 'Hi' // default: ***Support Team***
  role: 'role id', // support role
  dmToggle: true, // default: true
  blacklistUser: ['userid'], // blacklisted user id's
  blacklistGuild: ['guildid'], // server that disabled modmail
  categoryID: 'id', // category id
  embedColor: 'hex code', // default: #075FFF
  
  delColor: 'DANGER', // default: DANGER
  delEmoji: 'emoji id', // default: '❌'
})
```

### Without Customization
```js
const simplydjs = require('simply-djs')

// messageCreate event
// modmail command
simplydjs.modmail(client, message)
```

# Output
![image](https://user-images.githubusercontent.com/71836991/130611260-64590a47-6065-4af6-8d04-dd8995ee353f.png)

<br>

# Options for modmail function (Optional)
- **content:** Message Content outside of the embed
- **role:** Support Role ID (also mentions when creating if there is no options.content)
- **dmToggle:** Toggle ON/OFF the dm modmail feature
- **blacklistUser:** Blacklist users if they are spamming
- **blacklistGuild:** Set Guilds in blacklist zone so you can't create modmails in that guild
- **categoryID:** Category ID to make the server clean
- **embedColor:** Color of the embed which is sent in starboard
- **credit:** Give credits to the package by making it true (Only Boolean true/false)

## Options for modmail buttons (Optional)
- **delColor:** Button Color which discord supports
- **delEmoji:** Emoji that the button has.. (Emoji ID)
