"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRouter = void 0;
const sales_controller_1 = require("@/controllers/sales.controller");
const express_1 = require("express");
class SalesRouter {
    constructor() {
        this.salesController = new sales_controller_1.SalesController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.salesController.getAllSales);
        this.router.post('/:slug', this.salesController.getSalesSlug);
    }
    getRouter() {
        return this.router;
    }
}
exports.SalesRouter = SalesRouter;
