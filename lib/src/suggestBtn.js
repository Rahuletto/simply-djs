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
exports.suggestBtn = void 0;
const manageSug_1 = require("./manageSug");
const Deprecate_1 = require("../src/Error/Deprecate");
/**
 * @deprecated Use {@link manageSug()}
 */
function suggestBtn(button, options) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, Deprecate_1.Deprecated)({ desc: 'suggestBtn() is now manageSug()' });
        yield (0, manageSug_1.manageSug)(button, options);
    });
}
exports.suggestBtn = suggestBtn;
