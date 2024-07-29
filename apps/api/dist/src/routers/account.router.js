"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRouter = void 0;
const account_controller_1 = require("@/controllers/account.controller");
const express_1 = require("express");
class AccountRouter {
    constructor() {
        this.accountController = new account_controller_1.AccountController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/login', this.accountController.loginAccount);
        this.router.post('/refresh-token', this.accountController.refreshToken);
        this.router.post('/request-forgot-pass', this.accountController.checkEmail, this.accountController.checkTokenExp, this.accountController.reRequestToken, this.accountController.requestForgotPassword);
        this.router.post('/request-reset-pass', this.accountController.checkEmail, this.accountController.checkTokenExp, this.accountController.reRequestToken, this.accountController.requestResetPassword);
        this.router.post('/check-password', this.accountController.checkCurrentPassword);
        this.router.patch('/update-pass', this.accountController.resetPassword);
    }
    getRouter() {
        return this.router;
    }
}
exports.AccountRouter = AccountRouter;
