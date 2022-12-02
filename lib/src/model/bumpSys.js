"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bump = new mongoose_1.default.Schema({
    counts: { type: Array() },
    channel: { type: String },
    nxtBump: { type: String },
    guild: { type: String } // Guild
});
exports.default = mongoose_1.default.model('Bump-System', bump);
