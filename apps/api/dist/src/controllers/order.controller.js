"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const cart_action_1 = require("@/services/cart/cart.action");
const order_action_1 = require("@/services/order/order.action");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = require("@/helpers/nodemailer");
const address_action_1 = require("@/services/address/address.action");
const pdf_1 = require("@/helpers/pdf");
const stock_action_1 = require("@/services/stock/stock.action");
class OrderController {
    checkCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { c } = req.query;
            try {
                if (typeof c !== "string")
                    throw 'Invalid request';
                const cart = yield (0, cart_action_1.getCart)(c);
                res.json(cart);
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, variantId, quantity, color, size } = req.body;
            try {
                const cart = yield (0, cart_action_1.getOrCreateCart)(userId);
                yield (0, cart_action_1.addOrUpdateCartItem)(cart.id, variantId, color, size, quantity);
                yield (0, cart_action_1.getCartItemsWithTotal)(cart.id);
                const items = yield (0, cart_action_1.getCartItem)(userId);
                res.json(items);
            }
            catch (error) {
                res.json(error);
            }
        });
    }
    getCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield (0, cart_action_1.getCartItem)(req.body.userId);
                if (cart !== null) {
                    res.json(cart);
                }
                else {
                    res.json({ message: 'no cart' });
                }
            }
            catch (error) {
                res.json(error);
            }
        });
    }
    updateCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { itemId, newQuantity, userId } = req.body;
            try {
                yield (0, cart_action_1.updateCartItem)(itemId, newQuantity);
                const cart = yield (0, cart_action_1.getCartItem)(userId);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update cart item' });
            }
        });
    }
    deleteCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { itemId, userId } = req.body;
            try {
                yield (0, cart_action_1.deleteCartItem)(itemId);
                const cart = yield (0, cart_action_1.getCartItem)(userId);
                if (Array.isArray(cart === null || cart === void 0 ? void 0 : cart.items) && cart.items.length === 0) {
                    yield (0, cart_action_1.deleteCart)(cart.id);
                    res.json({ message: 'cart deleted' });
                }
                else {
                    res.status(200).json(cart);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete cart item' });
            }
        });
    }
    getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                const cart = yield (0, order_action_1.getOrderById)(orderId);
                if ((cart === null || cart === void 0 ? void 0 : cart.addressID) !== null && cart) {
                    const address = yield (0, address_action_1.getAddressById)(cart === null || cart === void 0 ? void 0 : cart.addressID);
                    const warehouse = yield (0, address_action_1.getWarehouseById)(cart === null || cart === void 0 ? void 0 : cart.warehouseId);
                    const shippingCost = (cart === null || cart === void 0 ? void 0 : cart.totalAmount) - (cart === null || cart === void 0 ? void 0 : cart.items.reduce((acc, item) => acc + item.price, 0));
                    res.json({ cart, address, warehouse: { coordinate: warehouse === null || warehouse === void 0 ? void 0 : warehouse.coordinate }, shippingCost });
                }
                else {
                    if (cart !== null)
                        res.json(cart);
                    res.json({ message: 'no cart' });
                }
            }
            catch (error) {
                res.json(error);
            }
        });
    }
    checkStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                const stock = yield (0, cart_action_1.getStock)(orderId);
                res.json(stock);
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const { orderId, shippingCost, subTotal, warehouseId, userAddress, shipping, selectedShipping } = req.body;
                const stockData = yield (0, cart_action_1.getStock)(orderId);
                const stockDataWarehouse = yield (0, cart_action_1.getStockByWarehouse)(orderId, warehouseId);
                const warehouse = yield (0, address_action_1.getWarehouseById)(warehouseId);
                const outOfStockItems = stockData.filter(item => item.totalStock < item.orderedQuantity);
                if (outOfStockItems.length > 0)
                    res.status(400).json({
                        message: "Some items are out of stock",
                    });
                const itemsToMutate = [];
                for (const item of stockDataWarehouse) {
                    if (item.totalStock < item.orderedQuantity) {
                        const warehouseAddress = yield (0, address_action_1.getAddressCoordinates)(`${warehouse === null || warehouse === void 0 ? void 0 : warehouse.address}, ${warehouse === null || warehouse === void 0 ? void 0 : warehouse.city_name}, ${warehouse === null || warehouse === void 0 ? void 0 : warehouse.province}, Indonesia`);
                        const warehouses = yield (0, address_action_1.getAllWarehouseAddress)();
                        const closestWarehouse = yield (0, address_action_1.findClosestWarehouse)(warehouseAddress, warehouses);
                        for (const closest of closestWarehouse) {
                            const closestWarehouseId = yield (0, address_action_1.getWarehouseByName)(closest.warehouseKey);
                            const closestStockData = yield (0, cart_action_1.getStockByWarehouse)(orderId, closestWarehouseId === null || closestWarehouseId === void 0 ? void 0 : closestWarehouseId.id);
                            const closestStock = closestStockData.find(stock => stock.productVariantId === item.productVariantId && stock.size === item.size);
                            if (closestStock && closestStock.totalStock >= item.orderedQuantity - item.totalStock) {
                                itemsToMutate.push({
                                    productVariantId: item.productVariantId,
                                    size: item.size,
                                    quantity: item.orderedQuantity - item.totalStock,
                                    fromWarehouse: closestWarehouseId,
                                    toWarehouse: warehouseId
                                });
                                item.totalStock = item.orderedQuantity;
                                break;
                            }
                        }
                    }
                }
                for (const mutation of itemsToMutate) {
                    const createMutationSender = yield (0, stock_action_1.createMutation)((_a = mutation.fromWarehouse) === null || _a === void 0 ? void 0 : _a.id, mutation.toWarehouse, 'TRANSFER', 'ACCEPTED');
                    yield (0, stock_action_1.createMutationItem)(createMutationSender, mutation.quantity, (_b = mutation.fromWarehouse) === null || _b === void 0 ? void 0 : _b.id, mutation.productVariantId, mutation.size);
                    const createMutationInbound = yield (0, stock_action_1.createMutation)(mutation.toWarehouse, (_c = mutation.fromWarehouse) === null || _c === void 0 ? void 0 : _c.id, 'INBOUND', 'ACCEPTED');
                    yield (0, stock_action_1.createMutationItem)(createMutationInbound, mutation.quantity, (_d = mutation.fromWarehouse) === null || _d === void 0 ? void 0 : _d.id, mutation.productVariantId, mutation.size);
                    yield (0, stock_action_1.reduceStockWarehouse)((_e = mutation.fromWarehouse) === null || _e === void 0 ? void 0 : _e.id, mutation.productVariantId, mutation.size, mutation.quantity);
                    yield (0, stock_action_1.addStockWarehouse)(mutation.toWarehouse, mutation.productVariantId, mutation.size, mutation.quantity);
                }
                const orderItems = yield (0, cart_action_1.getCartItemsByOrderId)(orderId);
                for (const item of orderItems) {
                    const createMutationTransactions = yield (0, stock_action_1.createMutationTransaction)(warehouseId, 'TRANSACTION', 'ACCEPTED');
                    yield (0, stock_action_1.createMutationItem)(createMutationTransactions.id, item.quantity, warehouseId, item.productVariantId, item.size);
                }
                const order = yield (0, cart_action_1.updateToOrder)(orderId, shippingCost, subTotal, warehouseId, userAddress, shipping, selectedShipping.service, selectedShipping.description, selectedShipping.cost[0].etd);
                if (order) {
                    let data = {
                        transaction_details: {
                            order_id: order.id,
                            gross_amount: subTotal + shippingCost,
                        },
                        expiry: {
                            unit: 'minutes',
                            duration: 60
                        }
                    };
                    const paymentLink = yield (0, order_action_1.getPaymentLink)(data);
                    res.json(paymentLink);
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.transaction_status === 'settlement') {
                    const existTransaction = yield (0, order_action_1.existingTransaction)(req.body.order_id);
                    if (existTransaction) {
                        const updateOrder = yield (0, order_action_1.successOrder)(req.body.order_id);
                        const user = yield (0, order_action_1.getUserById)(updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.userId);
                        const warehouse = yield (0, address_action_1.getWarehouseById)(updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.warehouseId);
                        const shippingCost = (updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.totalAmount) - (updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.items.reduce((acc, item) => acc + item.price, 0));
                        const address = yield (0, address_action_1.getAddressById)(updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.addressID);
                        const templatePath = path_1.default.join(__dirname, "../templates", "invoice.html");
                        const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                        const compiledTemplate = handlebars_1.default.compile(templateSource);
                        const inputData = {
                            orderId: updateOrder.id,
                            name: user === null || user === void 0 ? void 0 : user.username,
                            status: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.status,
                            paymentStatus: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.paymentStatus,
                            orderItem: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.items,
                            totalAmount: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.totalAmount,
                            createdAt: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.createdAt,
                            warehouse: warehouse === null || warehouse === void 0 ? void 0 : warehouse.warehouseName,
                            warehouseLoc: warehouse === null || warehouse === void 0 ? void 0 : warehouse.coordinate,
                            shippingCost: shippingCost,
                            address: address === null || address === void 0 ? void 0 : address.coordinate,
                            qrData: process.env.PUBLIC_URL + `/order/${updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.id}`
                        };
                        const html = compiledTemplate(inputData);
                        const pdf = yield (0, pdf_1.generateInvoicePdf)(inputData);
                        yield nodemailer_1.transporter.sendMail({
                            from: process.env.MAIL_USER,
                            to: user === null || user === void 0 ? void 0 : user.email,
                            subject: `Your Order Details on WearDrobe`,
                            html,
                            attachments: [{ path: pdf }]
                        });
                    }
                }
                else if (req.body.transaction_status === 'failed') {
                    yield (0, order_action_1.failedOrder)(req.body.order_id);
                }
                else {
                    return;
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    getOrderByAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminId, userId, date } = req.body;
                let { q: query, page, limit, w } = req.query;
                if (typeof query !== "string")
                    throw 'Invalid request';
                if (typeof w !== "string")
                    throw 'Invalid request';
                if (typeof page !== "string" || isNaN(+page))
                    page = '1';
                if (typeof limit !== "string" || isNaN(+limit))
                    limit = '10';
                const fromDate = new Date(date.from);
                fromDate.setHours(0, 0, 0, 0);
                const toDate = new Date(date.to);
                toDate.setDate(toDate.getDate());
                toDate.setHours(23, 59, 0, 0);
                const warehouse = yield (0, address_action_1.getWarehouseByName)(w);
                if (userId) {
                    const orderList = yield (0, order_action_1.getOrderByUser)(userId, query, page, limit, fromDate, toDate);
                    const totalOrders = yield (0, order_action_1.getTotalOrderByUser)(userId, query);
                    const totalPages = Math.ceil(totalOrders / +limit);
                    const currentPage = +page;
                    res.json({ orderList, totalPages, currentPage });
                }
                if (adminId) {
                    const orderList = yield (0, order_action_1.getOrderByAdmin)(adminId, query, page, limit, warehouse === null || warehouse === void 0 ? void 0 : warehouse.id, fromDate, toDate);
                    const totalOrders = yield (0, order_action_1.getTotalOrderByAdmin)(adminId, query);
                    const totalPages = Math.ceil(totalOrders / +limit);
                    const currentPage = +page;
                    res.json({ orderList, totalPages, currentPage });
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    cancelOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, adminId, userId, date } = req.body;
                let { q: query, page, limit, w } = req.query;
                if (typeof query !== "string")
                    throw 'Invalid request';
                if (typeof w !== "string")
                    throw 'Invalid request';
                if (typeof page !== "string" || isNaN(+page))
                    page = '1';
                if (typeof limit !== "string" || isNaN(+limit))
                    limit = '10';
                const cancel = yield (0, order_action_1.cancelOrder)(orderId);
                const fromDate = new Date(date.from);
                fromDate.setHours(0, 0, 0, 0);
                const toDate = new Date(date.to);
                toDate.setDate(toDate.getDate());
                toDate.setHours(23, 59, 0, 0);
                const warehouse = yield (0, address_action_1.getWarehouseByName)(w);
                if (cancel) {
                    if (adminId) {
                        const orderList = yield (0, order_action_1.getOrderByAdmin)(adminId, query, page, limit, warehouse === null || warehouse === void 0 ? void 0 : warehouse.id, fromDate, toDate);
                        res.json(orderList);
                    }
                    if (userId) {
                        const orderList = yield (0, order_action_1.getOrderByUser)(userId, query, page, limit, fromDate, toDate);
                        res.json(orderList);
                    }
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    changeToShipped(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, adminId, date } = req.body;
                let { q: query, page, limit, w } = req.query;
                if (typeof query !== "string")
                    throw 'Invalid request';
                if (typeof w !== "string")
                    throw 'Invalid request';
                if (typeof page !== "string" || isNaN(+page))
                    page = '1';
                if (typeof limit !== "string" || isNaN(+limit))
                    limit = '10';
                const fromDate = new Date(date.from);
                fromDate.setHours(0, 0, 0, 0);
                const toDate = new Date(date.to);
                toDate.setDate(toDate.getDate());
                toDate.setHours(23, 59, 0, 0);
                const updateToShipped = yield (0, order_action_1.updateShipped)(orderId);
                if (updateToShipped) {
                    const warehouse = yield (0, address_action_1.getWarehouseByName)(w);
                    const orderList = yield (0, order_action_1.getOrderByAdmin)(adminId, query, page, limit, warehouse === null || warehouse === void 0 ? void 0 : warehouse.id, fromDate, toDate);
                    res.json(orderList);
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    confirmOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, userId, date } = req.body;
                let { q: query, page, limit, w } = req.query;
                if (typeof query !== "string")
                    throw 'Invalid request';
                if (typeof w !== "string")
                    throw 'Invalid request';
                if (typeof page !== "string" || isNaN(+page))
                    page = '1';
                if (typeof limit !== "string" || isNaN(+limit))
                    limit = '10';
                const fromDate = new Date(date.from);
                fromDate.setHours(0, 0, 0, 0);
                const toDate = new Date(date.to);
                toDate.setDate(toDate.getDate());
                toDate.setHours(23, 59, 0, 0);
                const updateToCompleted = yield (0, order_action_1.updateCompletedOrder)(orderId);
                if (updateToCompleted) {
                    const orderList = yield (0, order_action_1.getOrderByUser)(userId, query, page, limit, fromDate, toDate);
                    res.json(orderList);
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
}
exports.OrderController = OrderController;
