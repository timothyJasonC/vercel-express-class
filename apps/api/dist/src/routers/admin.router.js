"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const account_controller_1 = require("@/controllers/account.controller");
const express_1 = require("express");
const admin_controller_1 = require("@/controllers/admin.controller");
const account_middleware_1 = require("@/middlewares/account.middleware");
class AdminRouter {
    constructor() {
        this.accountController = new account_controller_1.AccountController();
        this.adminController = new admin_controller_1.AdminController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.adminController.createAdmin);
        this.router.post('/setup-verify-admin', account_middleware_1.verifyToken, this.adminController.setupAdmin, this.accountController.verifyAdmin);
        this.router.get('/', this.adminController.getAdmins);
        this.router.get('/availableAdmins', this.adminController.getAvaliableAdmins);
        this.router.get('/:id', this.adminController.getAdminById);
        this.router.patch('/re-verify-account', account_middleware_1.verifyToken, this.accountController.verifyAdmin);
        this.router.patch('/personal/:id', this.adminController.updatePersonalInfo);
        this.router.patch('/email/:id', this.adminController.editEmail);
        this.router.patch('/name/:id', this.adminController.editFullName);
        this.router.patch('/:id', this.adminController.updatePhoto);
        this.router.delete('/photo/:id', this.adminController.removePhoto);
        this.router.delete('/:id', this.adminController.dischargeAdmin);
    }
    getRouter() {
        return this.router;
    }
}
exports.AdminRouter = AdminRouter;
