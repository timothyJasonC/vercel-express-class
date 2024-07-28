"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRouter = void 0;
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
class TestRouter {
    constructor() {
        this.TestController = new test_controller_1.TestController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.TestController.Test);
    }
    getRouter() {
        return this.router;
    }
}
exports.TestRouter = TestRouter;
