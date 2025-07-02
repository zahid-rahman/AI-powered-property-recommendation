"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoService = void 0;
async function printMessage(message) {
    try {
        return Promise.resolve(message);
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.demoService = { printMessage };
