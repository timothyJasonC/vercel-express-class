"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const apiResponse_1 = require("@/helpers/apiResponse");
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    var _a;
    try {
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            throw new Error("Token not found!");
        let verifiedAccount = (0, jsonwebtoken_1.verify)(token, process.env.KEY_JWT);
        req.body.account = verifiedAccount;
        next();
    }
    catch (error) {
        (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
    }
};
exports.verifyToken = verifyToken;
