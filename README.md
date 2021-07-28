
<p align="center"><img align="center" style="margin-bottom:-6px" src="https://cdn.discordapp.com/icons/867999056172052551/1808ea6e6a79f23a62945cba0df807dd.png?size=128"></p>


<h2 style="font-size:2.5rem; color:#075FFF" align="center">Simply-DJS</h2>

<h2 align="center"> A Simple, Easy and Beginner friendly Discord.js Package for everyone. <br>Uses Discord.js v12<br><br>Developed by Rahuletto#0243</h2>
 
<br>
<p align="center">
   <a href="https://www.npmjs.com/package/simply-djs"><img src="https://img.shields.io/npm/v/simply-djs.svg?style=flat-square" /></a>  <a href="https://www.npmjs.com/package/simply-djs"><img src="https://img.shields.io/npm/dt/simply-djs.svg?style=flat-square" /></a><br>
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

# [Examples](https://github.com/Rahuletto/simply-djs/tree/main/Examples) have been moved.
- [stealEmoji](https://github.com/Rahuletto/simply-djs/blob/main/Examples/stealEmoji.md) - Gets emoji png/gif and uploads to the current server
- [tictactoe](https://github.com/Rahuletto/simply-djs/blob/main/Examples/tictactoe.md) - (Requires discord-buttons) - A TicTacToe game using buttons
- [calculator](https://github.com/Rahuletto/simply-djs/blob/main/Examples/calculator.md) - (Requires discord-buttons) - A Simple Handy Calculator using buttons
- [embedPages](https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md) - (Requires discord-buttons) - Paginator/Embed (or) Message Pages using buttons
- [ticketSystem](https://github.com/Rahuletto/simply-djs/blob/main/Examples/ticketSystem.md) - (Requires discord-buttons and clickBtn function) - A Ticket System using buttons
- [webhooks](https://github.com/Rahuletto/simply-djs/blob/main/Examples/webhooks.md) - A Simple way to send messages with webhooks using channel id

 <h1>Contact us | Support</h1>
 <p>
<a href="https://discord.gg/3JzDV9T5Fn"><img src="https://invidget.switchblade.xyz/CjHX8eTK" /></a>
</p>
