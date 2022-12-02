"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const suggest = new mongoose_1.default.Schema({
    message: { type: String },
    author: { type: String },
    votes: { type: Array() } // Array of votes
});
exports.default = mongoose_1.default.model('Suggest-System', suggest);
