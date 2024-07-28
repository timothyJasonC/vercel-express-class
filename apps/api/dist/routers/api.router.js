"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = void 0;
const express_1 = require("express");
const test_router_1 = require("./test.router");
class ApiRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.testRouter = new test_router_1.TestRouter();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use('/test', this.testRouter.getRouter());
    }
    getRouter() {
        return this.router;
    }
}
exports.ApiRouter = ApiRouter;
