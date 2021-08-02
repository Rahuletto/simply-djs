# embedPages function
#### This is an example of embedPages (discord-buttons required)
<br>

## With Customization
```js
const simplydjs = require('simply-djs')

// message event
// any command
let embed1 = new Discord.MessageEmbed()
.setTitle('Page 1');

let embed2 = new Discord.MessageEmbed()
.setTitle('Page 2');

let pages = [embed1, embed2] // REQUIRED

// its still possible without embed
// let pages = ['page1', 'page2', 'page3']

simplydjs.embedPages(client, message, pages, {
  forwardEmoji: 'emoji id', // default: ▶️
  backEmoji: 'emoji id', // default: ◀️
  lastEmoji: 'emoji id' // default: ⏩
  firstEmoji: 'emoji id' // default: ⏪
  delEmoji: 'emoji id' // default: 🗑️
  
  btncolor: 'colors' // default: green 
  delcolor: 'colors' // default: red
  skipcolor: 'colors' // default: blurple
   // Colors that discord-buttons support. like red, blurple, grey, green
   
  skipBtn: true
})
```
## Without Customization
```js
const simplydjs = require('simply-djs')

// message event
// any command
let embed1 = new Discord.MessageEmbed()
.setTitle('Page 1');

let embed2 = new Discord.MessageEmbed()
.setTitle('Page 2');

let pages = [embed1, embed2] // REQUIRED

// its still possible without embed
// let pages = ['page1', 'page2', 'page3']

simplydjs.embedPages(client, message, pages)
```

# Options for tictactoe function (Optional)
### Buttons
- **forwardEmoji:** Emoji for Next Page button (Only Emoji ID)
- **backEmoji:** Emoji for Back Page button (Only Emoji ID)
- **color:** Color of the Buttons (Only red, green, grey/gray, blurple allowed)
