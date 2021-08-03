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
  firstEmoji: 'emoji id', // default: ⏪
  backEmoji: 'emoji id', // default: ◀️
  delEmoji: 'emoji id', // default: 🗑️
  forwardEmoji: 'emoji id', // default: ▶️
  lastEmoji: 'emoji id', // default: ⏩
  
  btncolor: 'colors', // default: green 
  delcolor: 'colors', // default: red
  skipcolor: 'colors', // default: blurple
   // Colors that discord-buttons support. like red, blurple, grey, green
   
  skipBtn: true,
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
# Output
![image](https://user-images.githubusercontent.com/71836991/127869308-72817b88-a41a-4e46-af2b-5e556bafafa3.png)

<br>

# Options for embedPagesfunction (Optional)
### Buttons
- **firstEmoji:** Emoji for First Page button (Only Emoji ID)
- **backEmoji:** Emoji for Back Page button (Only Emoji ID)
- **delEmoji:** Emoji for Delete message button (Only Emoji ID)
- **forwardEmoji:** Emoji for Next Page button (Only Emoji ID)
- **lastEmoji:** Emoji for Last Page button (Only Emoji ID)

### Button Color
- **btncolor:** Color of the Next/Previous Page Buttons (Only red, green, grey/gray, blurple allowed)
- **delcolor:** Color of the Delete Message Buttons (Only red, green, grey/gray, blurple allowed)
- **skipcolor:** Color of the Last/First Page Buttons (Only red, green, grey/gray, blurple allowed)

### Button Option
- **skipBtn:** Turn on/off the Last/First Page Buttons. (Only boolean [true/false])
