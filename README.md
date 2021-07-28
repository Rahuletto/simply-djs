
<p align="center"><img align="center" style="margin-bottom:-6px" src="https://cdn.discordapp.com/icons/867999056172052551/1808ea6e6a79f23a62945cba0df807dd.png?size=128"></p>


<h2 style="font-size:2.5rem; color:#075FFF" align="center">Simply-DJS</h2>

<h2 align="center"> A Simple, Easy and Beginner friendly Discord.js Package for everyone. Uses Discord.js v12 </h2>
<br>
<br>
<p align="center">
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://img.shields.io/npm/v/simply-djs.svg?style=flat-square" /></a><br>
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://nodei.co/npm/simply-djs.png?downloadRank=true&downloads=true&downloadRank=true&stars=true" /></a><br>
   <a href="https://discord.gg/3JzDV9T5Fn"><img src="https://invidget.switchblade.xyz/CjHX8eTK" /></a>
</p>

<br>

## <b>How to install ?
```
npm install simply-djs
```
<br>


## **Need Help ? Join the [Discord Server](https://discord.gg/3JzDV9T5Fn)**
### We love to help people. Join the server. Dont be shy.
<br>

## <b>When Using Buttons
```
npm install discord-buttons
```
```js
// Code Example
const Discord = require('discord.js')
const disbut = require('discord-buttons')
const client = new Discord.Client()
disbut(client)

// disbut(client) needs to be below the client
```

<br>

## Whats New ?
<br>

## **Webhooks**
```js
const simplydjs = require('simply-djs')

// any event
simplydjs.webhooks(client, {
    chid: 'channel id', // required
    msg: 'message (not embed)',
    embed: exampleEmbed, // an embed
    // u need atleast one (msg or embed) to send or it will give errors
    username: 'webhook username', // default: ur bot username
    avatar: 'webhook avatar', // default: ur bot avatar
})
```
<br>

#

## **Steal Emoji**
```js
const simplydjs = require('simply-djs')
// message event
// steal command
simplydjs.stealEmoji(message, args, {
    embedTitle: 'Title', // default: `Emoji Added ;)`
    embedColor: 'hex code', //default: #075FFF;
    embedFoot: 'Text for Footer', // default: 'Stop stealing.. its illegal.'
    failedMsg: 'sorry emoji not found' //default: "Couldn't find an emoji from it"
})
```
<br>

## **Ghost Ping**
```js
const simplydjs = require('simply-djs')
// message event
simplydjs.ghostPing(message, {
    embedColor: 'hex code', //default: #075FFF;
    embedFoot: 'Text for Footer' //default: 'Ghost Ping'
})
```
<br>

## <b>TicTacToe (Using Buttons)
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
<br>

## <b>Calculator (Using Buttons)
```js
const simplydjs = require('simply-djs')

// message event
// calculator command
simplydjs.calculator(message, {
    embedColor: 'hex code', //default: #075FFF
})
```
<br>

## **Embed Pages**
```js
const simplydjs = require('simply-djs')

// message event
// any command
let embed1 = new Discord.MessageEmbed()
.setTitle('Page 1');

let embed2 = new Discord.MessageEmbed()
.setTitle('Page 2');

let pages = [embed1, embed2] 

// its still possible without embed
// let pages = ['page1', 'page2', 'page3']

simplydjs.embedPages(client, message, pages, {
  forwardEmoji: 'emoji id', // default: ⏩
  backEmoji: 'emoji id', // default: ⏪
  color: 'colors' // default: blurple 

 // Colors that discord-buttons support. like red, blurple, grey, green
})
```
<br>

## <b>Ticket System (Using Buttons)
### Need to tell that this is one of the easiest and compact code you gonna use. with Permission Management. meaning others without admin cant setup ticket system
<br>

### **With Customization**
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

// message event
// setup-ticket command

simplydjs.ticketSystem(message, message.channel, {
     embedDesc: 'embed description', // default: '🎫 Create a ticket by clicking the button 🎫'
    embedColor: 'hex code', // default: #075FFFF
    embedFoot: 'footer text', // default: message.guild.name
    emoji: 'emoji id', // default: 🎫
    color: 'color from buttons' // default: blurple
})

//Dont think its messy.. it is with all customization.
```

### **Without Customization**
```js
const simplydjs = require('simply-djs')

client.on('clickButton', async(button) => {
simplydjs.clickBtn(button)
})

// message event
// setup-ticket command

simplydjs.ticketSystem(message, message.channel)
```
<br>


 <h1>Contact us | Support</h1>
 <p>
<a href="https://discord.gg/3JzDV9T5Fn"><img src="https://invidget.switchblade.xyz/CjHX8eTK" /></a>
</p>
