"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplyError = void 0;
class SimplyError extends Error {
    /**
     * Emit errors
     * @param {String} name
     * @param {String} tip
     */
    constructor(options = {
        tip: 'Join the Support Server [https://discord.gg/3JzDV9T5Fn]'
    }) {
        const msg = '"' + options.name + '"' + '\n' + 'Tip: ' + options.tip + '\n';
        super(msg);
    }
}
exports.SimplyError = SimplyError;
Object.defineProperty(SimplyError.prototype, 'name', {
    value: 'SimplyError'
});
