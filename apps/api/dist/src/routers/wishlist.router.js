"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRouter = void 0;
const wishlist_controller_1 = require("@/controllers/wishlist.controller");
const express_1 = require("express");
class WishlistRouter {
    constructor() {
        this.WishlistController = new wishlist_controller_1.WishlistController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.WishlistController.createWishlist);
        this.router.post('/get-wishlist', this.WishlistController.getWishlist);
        this.router.post('/total-likes', this.WishlistController.getTotalLikes);
        this.router.get('/:userId', this.WishlistController.getWishlistById);
    }
    getRouter() {
        return this.router;
    }
}
exports.WishlistRouter = WishlistRouter;
