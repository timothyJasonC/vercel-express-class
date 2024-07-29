"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const user_controller_1 = require("@/controllers/user.controller");
const account_controller_1 = require("@/controllers/account.controller");
const express_1 = require("express");
const account_middleware_1 = require("@/middlewares/account.middleware");
class UserRouter {
    constructor() {
        this.userController = new user_controller_1.UserController();
        this.accountController = new account_controller_1.AccountController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.userController.createUser);
        this.router.post('/create-sso-user', this.userController.createSSOUser);
        this.router.post('/setup-verify-user', account_middleware_1.verifyToken, this.userController.setupUser, this.accountController.verifyUser);
        this.router.get('/', this.userController.getUsers);
        this.router.get('/:id', this.userController.getUserById);
        this.router.patch('/re-verify-account', account_middleware_1.verifyToken, this.accountController.verifyUser);
        this.router.patch('/:id', this.userController.updatePhoto);
        this.router.patch('/personal/:id', this.userController.updatePersonalInfo);
        this.router.delete('/:id', this.userController.removePhoto);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
