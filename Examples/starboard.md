# starboard function
#### This is an example of starboard
<br>

### With Customization
```js
const simplydjs = require('simply-djs')

// outside of event (no event)
  simplydjs.starboard(client, {
    chid: 'channel id',
    embedColor: 'hex code', // default: #FFC83D
    emoji:"emoji id", // default: ⭐
    min: 2, // default: 2
  })
```

### Without Customization
```js
const simplydjs = require('simply-djs')

// outside of event (no event)
  simplydjs.starboard(client, {
    chid: 'channel id',
  })
```

# Output
![image](https://user-images.githubusercontent.com/71836991/129900817-becb2c35-5ad5-44fd-972f-4a9dcafb0551.png)

<br>

# Options for starboard function [(Required)](https://github.com/Rahuletto/simply-djs/blob/main/Examples/starboard.md)
- **chid:** Starboard channel ID

# Options for starboard function (Optional)
- **embedColor:** Color of the embed which is sent in starboard
- **emoji:** Other emojis can also be a star.. (Only Emoji ID)
- **min:** Minimum stars needed to be on starboard (Integer not String)
- **credit:** Give credits to the package by making it true (Only Boolean true/false)
- **embedFoot:** Embed footer when the credits are set to false.
