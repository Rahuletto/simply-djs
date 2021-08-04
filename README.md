
<p align="center"><img align="center" style="margin-bottom:-6px" src="https://i.imgur.com/HxeQNT7_d.webp?maxwidth=128&fidelity=grand"></p>


<h2 style="font-size:2.5rem; color:#075FFF" align="center">Simply-DJS</h2>

<h2 align="center"> A Simple, Easy and Beginner friendly Discord.js Package for everyone. <br>Uses Discord.js v12<br><br>Developed by Rahuletto#0243</h2>
 
<br>
<p align="center">
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://img.shields.io/npm/v/simply-djs.svg?style=flat-square" /></a><br>
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://nodei.co/npm/simply-djs.png?downloadRank=true&downloads=true&downloadRank=true&stars=true" /></a><br>
   <a href="https://discord.gg/3JzDV9T5Fn"><img src="https://invidget.switchblade.xyz/3JzDV9T5Fn" /></a>
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

## **[suggestSys](https://github.com/Rahuletto/simply-djs/blob/main/Examples/suggestSys.md)**

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
simplydjs.suggestSys(client, message, args, {
   embedColor: 'hex color', // defaultL #075FFF
   yesEmoji: 'emoji id', // default: ☑️
   yesColor: 'buttonColor', // default: green 
   noEmoji: 'emoji id', // default: X
   noColor: 'buttonColor', // default: red
})

```
<br>


# [Examples](https://github.com/Rahuletto/simply-djs/tree/main/Examples) have been moved.
- [stealEmoji](https://github.com/Rahuletto/simply-djs/blob/main/Examples/stealEmoji.md) - Gets emoji png/gif and uploads to the current server
- [tictactoe](https://github.com/Rahuletto/simply-djs/blob/main/Examples/tictactoe.md) - (Requires discord-buttons) - A TicTacToe game using buttons
- [calculator](https://github.com/Rahuletto/simply-djs/blob/main/Examples/calculator.md) - (Requires discord-buttons) - A Simple Handy Calculator using buttons
- [embedPages](https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md) - (Requires discord-buttons) - Paginator/Embed (or) Message Pages using buttons
- [ticketSystem](https://github.com/Rahuletto/simply-djs/blob/main/Examples/ticketSystem.md) - (Requires discord-buttons and clickBtn function) - A Ticket System using buttons
- [webhooks](https://github.com/Rahuletto/simply-djs/blob/main/Examples/webhooks.md) - A Simple way to send messages with webhooks using channel id
- [ytNotify](https://github.com/Rahuletto/simply-djs/blob/main/Examples/ytNotify.md) - Notifies when your favorite youtuber posts a video (Finally Back)
- [chatbot](https://github.com/Rahuletto/simply-djs/blob/main/Examples/chatbot.md) - Chats with you like a friend. Credits: [Brainshop](https://brainshop.ai)
- [suggestSys](https://github.com/Rahuletto/simply-djs/blob/main/Examples/suggestSys.md) - A Complex suggestion system which can be used easily.

 <h1>Contact us | Support</h1>
 <p>
<a href="https://discord.gg/3JzDV9T5Fn"><img src="https://invidget.switchblade.xyz/3JzDV9T5Fn" /></a>
</p>
