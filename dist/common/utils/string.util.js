"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomString = void 0;
function createRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    Array.from(Array(length)).forEach(() => {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    });
    return text;
}
exports.createRandomString = createRandomString;
//# sourceMappingURL=string.util.js.map