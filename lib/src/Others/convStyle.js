"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convStyle = void 0;
const interfaces_1 = require("../interfaces");
/**
 * Convert Legacy button styles to new ButtonStyle
 * @param color
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/convStyle***
 * @example simplydjs.convStyle("SECONDARY")
 */
function convStyle(color) {
    if (color)
        return color;
    else if (color)
        return interfaces_1.styleObj[color];
}
exports.convStyle = convStyle;
