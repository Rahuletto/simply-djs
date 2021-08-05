# rps Function
#### This is an example of rps (Thanks to ImpassiveMoon for making this.)

## With Customization
```js
const simplydjs = require('simply-djs')
// message Event
// RPS command
simplydjs.rps(message, {
    embedColor: 'hex code', //Default 0x075FFF
    embedFoot: 'text for footer' //Default "Rock Paper Scissors"
})
```

## Without Customization
```js
const simplydjs = require('simly-djs')
// message Event
// RPS Command
simplydjs.rps(message)
```

# Options for rps function (Optional)
### Embed
- **embedColor:** The color of all the embeds
- **embedFoot:** The Embed Footer of all embeds
- **credit:** Give credits to this package (Boolean [true/false]) Default: true
