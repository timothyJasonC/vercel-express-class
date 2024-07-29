"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = void 0;
const express_1 = require("express");
const account_router_1 = require("./account.router");
const user_router_1 = require("./user.router");
const category_router_1 = require("./category.router");
const order_router_1 = require("./order.router");
const warehouse_router_1 = require("./warehouse.router");
const product_router_1 = require("./product.router");
const stock_router_1 = require("./stock.router");
const address_router_1 = require("./address.router");
const admin_router_1 = require("./admin.router");
const mutation_router_1 = require("./mutation.router");
const sales_router_1 = require("./sales.router");
const wishlist_router_1 = require("./wishlist.router");
class ApiRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.accountRouter = new account_router_1.AccountRouter();
        this.userRouter = new user_router_1.UserRouter();
        this.adminRouter = new admin_router_1.AdminRouter();
        this.categoryRouter = new category_router_1.CategoryRouter();
        this.orderRouter = new order_router_1.OrderRouter();
        this.warehouseRouter = new warehouse_router_1.WarehouseRouter();
        this.productRouter = new product_router_1.ProductRouter();
        this.stockRouter = new stock_router_1.StockRouter();
        this.addressRouter = new address_router_1.AddressRouter();
        this.mutationRouter = new mutation_router_1.MutationRouter();
        this.salesRouter = new sales_router_1.SalesRouter();
        this.wishlistRouter = new wishlist_router_1.WishlistRouter();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use('/account', this.accountRouter.getRouter());
        this.router.use('/user', this.userRouter.getRouter());
        this.router.use('/admin', this.adminRouter.getRouter());
        this.router.use('/categories', this.categoryRouter.getRouter());
        this.router.use('/order', this.orderRouter.getRouter());
        this.router.use('/warehouses', this.warehouseRouter.getRouter());
        this.router.use('/products', this.productRouter.getRouter());
        this.router.use('/stocks', this.stockRouter.getRouter());
        this.router.use('/address', this.addressRouter.getRouter());
        this.router.use('/mutations', this.mutationRouter.getRouter());
        this.router.use('/sales', this.salesRouter.getRouter());
        this.router.use('/wishlist', this.wishlistRouter.getRouter());
    }
    getRouter() {
        return this.router;
    }
}
exports.ApiRouter = ApiRouter;
