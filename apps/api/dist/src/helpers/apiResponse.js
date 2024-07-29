"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverResponse = serverResponse;
function serverResponse(res, statusCode, status, msg, data) {
    res.status(statusCode).send({
        status: status,
        message: msg,
        data
    });
}
