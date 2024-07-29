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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.getOrCreateCart = getOrCreateCart;
exports.addOrUpdateCartItem = addOrUpdateCartItem;
exports.getCartItemsWithTotal = getCartItemsWithTotal;
exports.getCartItemsByOrderId = getCartItemsByOrderId;
exports.getStock = getStock;
exports.getStockByWarehouse = getStockByWarehouse;
exports.getCartItem = getCartItem;
exports.updateCartItem = updateCartItem;
exports.deleteCartItem = deleteCartItem;
exports.deleteCart = deleteCart;
exports.updateToOrder = updateToOrder;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
function getCart(cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        let cart = yield prisma.order.findFirst({
            where: { id: cartId }
        });
        return cart;
    });
}
function getOrCreateCart(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let cart = yield prisma.order.findFirst({
            where: {
                userId,
                paymentStatus: 'PENDING',
                status: 'CART'
            }
        });
        if (!cart) {
            const cartId = (0, uuid_1.v4)();
            cart = yield prisma.order.create({
                data: {
                    id: cartId,
                    userId,
                    paymentStatus: 'PENDING',
                }
            });
            return cart;
        }
        return cart;
    });
}
function addOrUpdateCartItem(orderId, variantId, color, size, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        let existingCartItem = yield prisma.orderItem.findFirst({
            where: {
                orderId,
                productVariantId: variantId,
                color, size
            }
        });
        const variantItem = yield prisma.productVariant.findFirst({
            where: { id: variantId },
            select: { product: true }
        });
        if (existingCartItem) {
            existingCartItem = yield prisma.orderItem.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    price: existingCartItem.price + (quantity * (variantItem === null || variantItem === void 0 ? void 0 : variantItem.product.price))
                }
            });
        }
        else {
            const orderItemId = (0, uuid_1.v4)();
            existingCartItem = yield prisma.orderItem.create({
                data: {
                    id: orderItemId,
                    orderId,
                    productVariantId: variantId,
                    quantity,
                    price: (variantItem === null || variantItem === void 0 ? void 0 : variantItem.product.price) * quantity,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    color: color,
                    size: size
                }
            });
        }
        return existingCartItem;
    });
}
function getCartItemsWithTotal(cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cartItems = yield prisma.orderItem.findMany({
            where: {
                orderId: cartId
            },
            select: {
                quantity: true,
                price: true
            }
        });
        const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const updateAmount = yield prisma.order.update({
            where: { id: cartId },
            data: {
                totalAmount: totalAmount
            }
        });
        return { items: cartItems, updateAmount };
    });
}
function getCartItemsByOrderId(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderItems = yield prisma.orderItem.findMany({
            where: { orderId },
            select: {
                productVariantId: true,
                color: true,
                size: true,
                quantity: true
            }
        });
        return orderItems;
    });
}
function getStock(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderItems = yield getCartItemsByOrderId(orderId);
        const stockPromises = orderItems.map((item) => __awaiter(this, void 0, void 0, function* () {
            const totalStock = yield prisma.warehouseProduct.aggregate({
                _sum: {
                    stock: true
                },
                where: {
                    productVariantID: item.productVariantId,
                    size: item.size,
                    isDelete: false,
                },
            });
            return {
                productVariantId: item.productVariantId,
                color: item.color,
                size: item.size,
                totalStock: totalStock._sum.stock || 0,
                orderedQuantity: item.quantity
            };
        }));
        const stockResults = yield Promise.all(stockPromises);
        return stockResults;
    });
}
function getStockByWarehouse(orderId, warehouseID) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderItems = yield getCartItemsByOrderId(orderId);
        const stockPromises = orderItems.map((item) => __awaiter(this, void 0, void 0, function* () {
            const totalStock = yield prisma.warehouseProduct.aggregate({
                _sum: {
                    stock: true
                },
                where: {
                    warehouseID,
                    productVariantID: item.productVariantId,
                    size: item.size,
                    isDelete: false,
                },
            });
            return {
                productVariantId: item.productVariantId,
                color: item.color,
                size: item.size,
                totalStock: totalStock._sum.stock || 0,
                orderedQuantity: item.quantity
            };
        }));
        const stockResults = yield Promise.all(stockPromises);
        return stockResults;
    });
}
function getCartItem(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = yield prisma.order.findFirst({
            where: {
                userId: `${userId}`,
                status: 'CART',
            },
            include: {
                items: {
                    select: {
                        id: true,
                        orderId: true,
                        productVariantId: true,
                        size: true,
                        quantity: true,
                        price: true,
                        createdAt: true,
                        updatedAt: true,
                        productVariant: {
                            select: {
                                color: true,
                                image: true,
                                product: {
                                    select: {
                                        name: true
                                    }
                                }
                            },
                        },
                    },
                },
            },
        });
        return cart;
    });
}
function updateCartItem(itemId, newQuantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderItem = yield prisma.orderItem.findFirst({
            where: {
                id: itemId
            }
        });
        if (!orderItem)
            throw 'no item';
        const variantItem = yield prisma.productVariant.findFirst({
            where: { id: orderItem === null || orderItem === void 0 ? void 0 : orderItem.productVariantId },
            select: { product: true }
        });
        const updateItem = yield prisma.orderItem.update({
            where: { id: itemId },
            data: { price: newQuantity * (variantItem === null || variantItem === void 0 ? void 0 : variantItem.product.price), quantity: newQuantity }
        });
        return updateItem;
    });
}
function deleteCartItem(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.orderItem.delete({
            where: { id: itemId }
        });
        return;
    });
}
function deleteCart(cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.order.delete({
            where: {
                id: cartId
            }
        });
        return;
    });
}
function updateToOrder(orderId, shippingCost, subTotal, warehouseId, userAddress, shipping, service, description, estimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = yield prisma.order.update({
            where: { id: orderId },
            data: {
                id: (0, uuid_1.v4)(),
                paymentStatus: "PENDING",
                status: "PENDING_PAYMENT",
                warehouseId,
                createdAt: new Date(),
                totalAmount: shippingCost + subTotal,
                addressID: userAddress,
                shippingMethod: `${shipping}, ${service}, ${description}, ${estimation}`
            }
        });
        return order;
    });
}
