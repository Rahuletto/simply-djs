"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleObj = void 0;
const discord_js_1 = require("discord.js");
/**
 * An object to convert legacy button styles (string) to ButtonStyle counterparts for v14
 */
exports.styleObj = {
    PRIMARY: discord_js_1.ButtonStyle.Primary,
    SECONDARY: discord_js_1.ButtonStyle.Secondary,
    SUCCESS: discord_js_1.ButtonStyle.Success,
    DANGER: discord_js_1.ButtonStyle.Danger,
    LINK: discord_js_1.ButtonStyle.Link
};
