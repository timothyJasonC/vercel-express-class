import { OrderController } from "../controllers/order.controller";
import { Router } from "express";

export class OrderRouter {
    private router: Router
    private orderController: OrderController

    constructor() {
        this.orderController = new OrderController
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/cart', this.orderController.checkCart)
        this.router.post('/cart', this.orderController.addToCart)
        this.router.post('/cart_item', this.orderController.getCartItems)
        this.router.post('/updateCartItem', this.orderController.updateCartItems)
        this.router.post('/deleteCartItem', this.orderController.deleteCartItems)
        this.router.post('/orderDetail', this.orderController.getOrderById)

        this.router.post('/', this.orderController.createOrder)
        this.router.post('/status', this.orderController.checkStatus)
        this.router.post('/stock', this.orderController.checkStock)

        this.router.post('/warehouseOrder', this.orderController.getOrderByAdmin)
        this.router.post('/cancelOrder', this.orderController.cancelOrder)
        this.router.post('/changeToShipped', this.orderController.changeToShipped)
        this.router.post('/confirmOrder', this.orderController.confirmOrder)
    }

    getRouter() {
        return this.router
    }
}