"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockRouter = void 0;
const stock_controller_1 = require("@/controllers/stock.controller");
const express_1 = require("express");
class StockRouter {
    constructor() {
        this.stockController = new stock_controller_1.StockController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.stockController.createStock);
        this.router.get('/:variant', this.stockController.getStockByVariant);
        this.router.post('/all', this.stockController.getAllStock);
        this.router.post('/:slug', this.stockController.getStockSlug);
    }
    getRouter() {
        return this.router;
    }
}
exports.StockRouter = StockRouter;
