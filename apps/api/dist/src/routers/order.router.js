"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const order_controller_1 = require("@/controllers/order.controller");
const express_1 = require("express");
class OrderRouter {
    constructor() {
        this.orderController = new order_controller_1.OrderController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/cart', this.orderController.checkCart);
        this.router.post('/cart', this.orderController.addToCart);
        this.router.post('/cart_item', this.orderController.getCartItems);
        this.router.post('/updateCartItem', this.orderController.updateCartItems);
        this.router.post('/deleteCartItem', this.orderController.deleteCartItems);
        this.router.post('/orderDetail', this.orderController.getOrderById);
        this.router.post('/', this.orderController.createOrder);
        this.router.post('/status', this.orderController.checkStatus);
        this.router.post('/stock', this.orderController.checkStock);
        this.router.post('/warehouseOrder', this.orderController.getOrderByAdmin);
        this.router.post('/cancelOrder', this.orderController.cancelOrder);
        this.router.post('/changeToShipped', this.orderController.changeToShipped);
        this.router.post('/confirmOrder', this.orderController.confirmOrder);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
