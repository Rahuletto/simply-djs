"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gw = new mongoose_1.default.Schema({
    message: { type: String },
    prize: { type: String },
    started: { type: Number },
    entry: { type: Array() },
    entered: { type: Number },
    winCount: { type: Number },
    requirements: { type: Object },
    endTime: { type: String },
    host: { type: String },
    desc: { type: String } // Giveaway Embed Desc
});
exports.default = mongoose_1.default.model('Giveaway-System', gw);
