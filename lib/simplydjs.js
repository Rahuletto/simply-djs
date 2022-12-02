"use strict";
// ------------------------------
// -------- E R R O R S ---------
// ------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.tictactoe = exports.ticketSystem = exports.suggestBtn = exports.suggestSystem = exports.stealEmoji = exports.starboard = exports.rps = exports.nqn = exports.menuPages = exports.manageSug = exports.manageBtn = exports.giveawaySystem = exports.ghostPing = exports.embedPages = exports.embedCreate = exports.chatbot = exports.clickBtn = exports.connect = exports.calculator = exports.bumpSystem = exports.btnRole = exports.betterBtnRole = exports.automeme = exports.ms = exports.emitError = exports.toRgb = exports.version = void 0;
const Error_1 = require("./src/Error/Error");
if (+process.version.slice(1, 3) - 0 < 16)
    throw new Error_1.SimplyError({
        name: `NodeJS Version 16 or newer is required, but you are using ${process.version}.`,
        tip: `Install nodejs 16 or higher in https://nodejs.org/`
    });
try {
    require('discord.js');
}
catch (e) {
    throw new Error_1.SimplyError({
        name: 'Discord.JS is required for this package to run',
        tip: 'This package is optimized to run with discord.js'
    });
}
const { version: discordJSVersion } = require(require('path').join(require.resolve('discord.js'), '..', '..', 'package.json'));
if (Number(discordJSVersion.slice(0, 2)) < 13)
    throw new Error_1.SimplyError({
        name: `Discord.JS version 13 or higher is required, but you are using ${discordJSVersion}. See https://www.npmjs.com/package/discord.js`,
        tip: 'This package is not optimized for Discord.JS v12 or lower.'
    });
// ------------------------------
// ------- E X P O R T S --------
// ------------------------------
exports.version = '3.0.1';
var toRgb_1 = require("./src/Others/toRgb");
Object.defineProperty(exports, "toRgb", { enumerable: true, get: function () { return toRgb_1.toRgb; } });
var emitError_1 = require("./src/Others/emitError");
Object.defineProperty(exports, "emitError", { enumerable: true, get: function () { return emitError_1.emitError; } });
var ms_1 = require("./src/Others/ms");
Object.defineProperty(exports, "ms", { enumerable: true, get: function () { return ms_1.ms; } });
var automeme_1 = require("./src/automeme");
Object.defineProperty(exports, "automeme", { enumerable: true, get: function () { return automeme_1.automeme; } });
var betterBtnRole_1 = require("./src/betterBtnRole");
Object.defineProperty(exports, "betterBtnRole", { enumerable: true, get: function () { return betterBtnRole_1.betterBtnRole; } });
var btnrole_1 = require("./src/btnrole");
Object.defineProperty(exports, "btnRole", { enumerable: true, get: function () { return btnrole_1.btnRole; } });
var bumpSys_1 = require("./src/bumpSys");
Object.defineProperty(exports, "bumpSystem", { enumerable: true, get: function () { return bumpSys_1.bumpSystem; } });
var calc_1 = require("./src/calc");
Object.defineProperty(exports, "calculator", { enumerable: true, get: function () { return calc_1.calculator; } });
var connect_1 = require("./src/connect");
Object.defineProperty(exports, "connect", { enumerable: true, get: function () { return connect_1.connect; } });
var clickBtn_1 = require("./src/clickBtn");
Object.defineProperty(exports, "clickBtn", { enumerable: true, get: function () { return clickBtn_1.clickBtn; } });
var chatbot_1 = require("./src/chatbot");
Object.defineProperty(exports, "chatbot", { enumerable: true, get: function () { return chatbot_1.chatbot; } });
var embed_1 = require("./src/embed");
Object.defineProperty(exports, "embedCreate", { enumerable: true, get: function () { return embed_1.embedCreate; } });
var embedPages_1 = require("./src/embedPages");
Object.defineProperty(exports, "embedPages", { enumerable: true, get: function () { return embedPages_1.embedPages; } });
var ghostPing_1 = require("./src/ghostPing");
Object.defineProperty(exports, "ghostPing", { enumerable: true, get: function () { return ghostPing_1.ghostPing; } });
var giveaway_1 = require("./src/giveaway");
Object.defineProperty(exports, "giveawaySystem", { enumerable: true, get: function () { return giveaway_1.giveawaySystem; } });
var manageBtn_1 = require("./src/manageBtn");
Object.defineProperty(exports, "manageBtn", { enumerable: true, get: function () { return manageBtn_1.manageBtn; } });
var manageSug_1 = require("./src/manageSug");
Object.defineProperty(exports, "manageSug", { enumerable: true, get: function () { return manageSug_1.manageSug; } });
var menuPages_1 = require("./src/menuPages");
Object.defineProperty(exports, "menuPages", { enumerable: true, get: function () { return menuPages_1.menuPages; } });
var nqn_1 = require("./src/nqn");
Object.defineProperty(exports, "nqn", { enumerable: true, get: function () { return nqn_1.nqn; } });
var rps_1 = require("./src/rps");
Object.defineProperty(exports, "rps", { enumerable: true, get: function () { return rps_1.rps; } });
var starboard_1 = require("./src/starboard");
Object.defineProperty(exports, "starboard", { enumerable: true, get: function () { return starboard_1.starboard; } });
var stealEmoji_1 = require("./src/stealEmoji");
Object.defineProperty(exports, "stealEmoji", { enumerable: true, get: function () { return stealEmoji_1.stealEmoji; } });
var suggest_1 = require("./src/suggest");
Object.defineProperty(exports, "suggestSystem", { enumerable: true, get: function () { return suggest_1.suggestSystem; } });
var suggestBtn_1 = require("./src/suggestBtn");
Object.defineProperty(exports, "suggestBtn", { enumerable: true, get: function () { return suggestBtn_1.suggestBtn; } });
var ticketSystem_1 = require("./src/ticketSystem");
Object.defineProperty(exports, "ticketSystem", { enumerable: true, get: function () { return ticketSystem_1.ticketSystem; } });
var tictactoe_1 = require("./src/tictactoe");
Object.defineProperty(exports, "tictactoe", { enumerable: true, get: function () { return tictactoe_1.tictactoe; } });
