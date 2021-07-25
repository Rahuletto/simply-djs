
<p align="center"><img align="center" style="margin-bottom:-6px" src="https://cdn.discordapp.com/icons/867999056172052551/1808ea6e6a79f23a62945cba0df807dd.png?size=128"></p>


<h2 style="font-size:2.5rem; color:#075FFF" align="center">Simply-DJS</h2>

<h2 align="center"> A Simple, Easy and Beginner friendly Discord.js Package for everyone. Uses Discord.js v12 </h2>
<br>
<br>
<p align="center">
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://img.shields.io/npm/v/simply-djs.svg?style=flat-square" /></a><br>
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://nodei.co/npm/simply-djs.png?downloadRank=true&downloads=true&downloadRank=true&stars=true" /></a><br>
   <a href="https://discord.gg/CjHX8eTK"><img src="https://invidget.switchblade.xyz/CjHX8eTK" /></a>
</p>

<br>

## <b>How to install ?
```
npm install simply-djs
```
<br>


## **Need Help ? Join the [Discord Server](https://discord.gg/CjHX8eTK)**
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

## <b>Antiswear
### Total of 350+ swear words as default

```js
const simplydjs = require('simply-djs')

// message event
simplydjs.antiSwear(message, {
    words: ['1', '2', '3'] // or words: 'one word only'
    whitelistwords: ['1', '2', '3'] // or whitelistwords: 'one word only'
    msg: 'stop swearing ;(' // default: @ping `You are not allowed to say that..`
})
```
<br>

## **Antiswear options.** (not required)

**words:** Custom Blacklisted words.. Need to be array if its more than one (words: ['this is', 'an Array'])

**whitelistwords:** Some people dont want to delete some swear words. Need to be array if its more than on (whitelistwords: ['this is', 'an Array'])

**msg:** Message sent when someone swears
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

## **Ghost Ping options.** (not required)

 **embedColor:** Embed Color for the ghost ping message

 **embedFooter:** Embed Footer for the ghost ping message

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

## **TicTacToe options.** (not required)

**xEmoji:** Emoji for the "X" user and symbol for buttons (X & O in tictactoe)

**oEmoji:** Emoji for the "O" user and symbol for buttons (X & O in tictactoe)

**idleEmoji:** Emoji when the spot is empty in tictactoe

**embedColor:** Embed Color for the tictactoe guide

**embedFoot:** Embed Footer for the tictactoe guide
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

## **Calculator options.** (not required)

**embedColor:** Embed Color for the calculator results
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

## **Embed Pages options.** (not required)

 **forwardEmoji:** Emoji for the button which moves the page forward

 **embedFooter:** Emoji for the button which moves the page backward

 **color:** Button Color. | Only colors that Discord Buttons support. like red, blurple, grey, green

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

### See.. Its small and simple right ?
<br>

## **Ticket System options.** (not required)

### **simplydjs.ticketSystem Options**
#### Customization that occurs before ticket has been opened.
<br>

**embedDesc:** The Description for the Ticket System Embed (Embed that has ticket button that opens a ticket)

**embedColor:** The Color of the Ticket System Embed (Embed that has ticket button that opens a ticket)

**embedFoot:** The Footer for the Ticket System Embed (Embed that has ticket button that opens a ticket)

**emoji:** The Emoji for the Ticket Button which opens a ticket

**color:** The Color for the Ticket Button which opens a ticket. | Only colors that Discord Buttons support. like red, blurple, grey, green

<br>

### **simplydjs.clickBtn Options**
#### Customization that occurs when ticket has been opened.
<br>

**embedDesc:** The Description for the Ticket System Embed (Embed which sends after creating ticket)

**embedColor:** The Color of the Ticket System Embed (Embed which sends after creating ticket)

**embedFoot:** The Footer for the Ticket System Embed (Embed which sends after creating ticket)
<br>

#### Ticket Buttons Customization

**closeEmoji/delEmoji/openEmoji:** The Emoji used for the close/delete/reopen ticket button

**closeColor/delColor/openColor:** The Color used for the close/delete/reopen ticket button | Only red, blurple, grey, green

<br>

 <h1>Contact us | Support</h1>
 <p>
<a href="https://discord.gg/CjHX8eTK"><img src="https://invidget.switchblade.xyz/CjHX8eTK" /></a>
</p>
