"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitError = void 0;
const Error_1 = require("../Error/Error");
/**
 * Produce error messages just like Simply DJS
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/emitError***
 * @example simplydjs.emitError({ name: "Test", tip: "This is just to test" })
 */
function emitError(options = {
    tip: 'Join the Support Server [https://discord.gg/3JzDV9T5Fn]'
}) {
    return __awaiter(this, void 0, void 0, function* () {
        throw new Error_1.SimplyError(options);
    });
}
exports.emitError = emitError;
