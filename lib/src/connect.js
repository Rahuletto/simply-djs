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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Error_1 = require("./Error/Error");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const simplydjs_1 = require("../simplydjs");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * Connect to a mongo database to access some functions ! *Requires* ***[mongodb uri](https://mongodb.com/)***
 * @param db mongoDbUri
 * @param notify
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/connect***
 * @example simplydjs.connect('mongoURI', true)
 */
function connect(db, notify) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!db)
                throw new Error_1.SimplyError({
                    name: 'NOT_SPECIFIED | Provide an valid mongodb uri string.',
                    tip: `Expected an MongoDB URI. Received ${db || 'undefined'}`
                });
            mongoose_1.default
                .connect(db)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (notify !== false) {
                    const json = yield axios_1.default
                        .get('https://registry.npmjs.org/simply-djs')
                        .then((res) => res.data);
                    const v = json['dist-tags'].latest;
                    if (v.toString() != simplydjs_1.version) {
                        console.log(`\n\t\tUpdate available | ${chalk_1.default.grey(simplydjs_1.version)} ${chalk_1.default.magenta('→')} ${chalk_1.default.green(v)}\n\t\tRun [${chalk_1.default.blue('npm i simply-djs@latest')}] to update\n`);
                    }
                    console.log('{ S-DJS } Database Connected');
                }
                resolve(true);
            }))
                .catch((err) => {
                reject(err.stack);
            });
        }));
    });
}
exports.connect = connect;
