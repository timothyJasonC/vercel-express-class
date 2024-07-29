"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const product_controller_1 = require("@/controllers/product.controller");
const express_1 = require("express");
class ProductRouter {
    constructor() {
        this.productController = new product_controller_1.ProductController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/lists', this.productController.getProduct);
        this.router.post('/', this.productController.createProduct);
        this.router.get('/names', this.productController.getProductName);
        this.router.get('/catalogs', this.productController.getCatalogs);
        this.router.get('/:slug', this.productController.getProductBySlug);
        this.router.patch('/:slug', this.productController.editProduct);
        this.router.delete('/:slug', this.productController.deleteProduct);
    }
    getRouter() {
        return this.router;
    }
}
exports.ProductRouter = ProductRouter;
