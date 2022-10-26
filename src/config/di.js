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
const box2d_wasm_1 = __importDefault(require("box2d-wasm"));
const inversify_1 = require("inversify");
require("reflect-metadata");
const app_1 = require("../app");
const container = new inversify_1.Container({
    autoBindInjectable: true,
    skipBaseClassChecks: true,
});
container
    .bind("Box2D")
    .toDynamicValue(() => (0, box2d_wasm_1.default)({
    locateFile(url) {
        return "assets/" + url;
    },
}))
    .inSingletonScope();
container.bind("Box2D.b2World").toDynamicValue((context) => __awaiter(void 0, void 0, void 0, function* () {
    return context.container.getAsync("Box2D").then((box2d) => {
        return new box2d.b2World(10);
    });
}));
container.bind(app_1.App).toSelf();
exports.default = container;
