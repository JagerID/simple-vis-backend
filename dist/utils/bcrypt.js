"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const ROUNDS = 10;
const hashPassword = async (password) => {
    const salt = await (0, bcryptjs_1.genSalt)(ROUNDS);
    const passwordHash = await (0, bcryptjs_1.hash)(password, salt);
    return passwordHash;
};
exports.hashPassword = hashPassword;
//# sourceMappingURL=bcrypt.js.map