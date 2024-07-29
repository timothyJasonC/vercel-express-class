"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const category_controller_1 = require("@/controllers/category.controller");
const express_1 = require("express");
class CategoryRouter {
    constructor() {
        this.categoryController = new category_controller_1.CategoryController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.categoryController.getCategory);
        this.router.get('/men-cat', this.categoryController.getMenCategory);
        this.router.get('/women-cat', this.categoryController.getWomenCategory);
        this.router.get('/:slug', this.categoryController.getCategorySlug);
        this.router.post('/', this.categoryController.createCategory);
        this.router.patch('/', this.categoryController.editCategory);
        this.router.delete('/:id', this.categoryController.deleteCategory);
    }
    getRouter() {
        return this.router;
    }
}
exports.CategoryRouter = CategoryRouter;
