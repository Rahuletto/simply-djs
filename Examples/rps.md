# rps Function
#### This is an example of rps (Thanks to ImpassiveMoon for making this.)

## With Customization
```js
const simplydjs = require('simply-djs')
// message Event
// RPS command
simplydjs.rps(message, {
            embedColor: "hex code", // default: #075FFF
            timeoutEmbedColor: "hex code", // default: #075FFF
            drawEmbedColor: "hex code", // default: #075FFF
            winEmbedColor: "hex code", // default: #c90000
            embedFooter: "A Game of RPS",
            rockColor: "colors", // default: grey
            paperColor: "colors", // default: grey
            scissorsColor: "colors", // default: grey
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
- **embedColor** - The color of the main 2 embeds
- **timeoutEmbedColor** - The color of the timeout embeds
- **drawEmbedColor** - The color of the tie embed
- **winEmbedColor** - The color of the winner embed
- **credit** - Give credits to this package (Boolean [true/false]) Default: true

### Buttons
- **rockColor** - The style of the rock button (Only red, green, grey/gray, blurple allowed)
- **paperColor** - The style of the paper button (Only red, green, grey/gray, blurple allowed)
- **scissorsColor** - The style of the scissors button (Only red, green, grey/gray, blurple allowed)
