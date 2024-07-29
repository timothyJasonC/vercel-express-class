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
exports.getUserById = getUserById;
exports.getOrderById = getOrderById;
exports.getPaymentLink = getPaymentLink;
exports.existingTransaction = existingTransaction;
exports.successOrder = successOrder;
exports.failedOrder = failedOrder;
exports.getOrderByUser = getOrderByUser;
exports.getTotalOrderByUser = getTotalOrderByUser;
exports.getTotalOrderByAdmin = getTotalOrderByAdmin;
exports.getOrderByAdmin = getOrderByAdmin;
exports.cancelOrder = cancelOrder;
exports.updateShipped = updateShipped;
exports.updateCompletedOrder = updateCompletedOrder;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const orderDetail = {
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
};
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        return user;
    });
}
function getOrderById(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = yield prisma.order.findFirst({
            where: {
                id: orderId
            },
            include: orderDetail,
        });
        return cart;
    });
}
function getPaymentLink(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.MIDTRANS_PUBLIC_SECRET;
        const encededSecret = Buffer.from(secret).toString('base64');
        const basicAuth = `Basic ${encededSecret}`;
        const response = yield fetch(`${process.env.MIDTRANS_PUBLIC_API}`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'true',
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': basicAuth
            },
            body: JSON.stringify(data)
        });
        const paymentLink = yield response.json();
        return paymentLink;
    });
}
function existingTransaction(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existOrder = yield prisma.order.findUnique({
            where: {
                id,
                paymentStatus: 'PENDING'
            }
        });
        return existOrder;
    });
}
function updateSuccessStock(items, warehouseID) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of items) {
            const { productVariantId, quantity, size } = item;
            yield prisma.warehouseProduct.updateMany({
                where: { productVariantID: productVariantId, size, warehouseID },
                data: {
                    stock: {
                        increment: -quantity
                    }
                }
            });
        }
        return;
    });
}
function successOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateOrder = yield prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                paymentStatus: "COMPLETED",
                status: "PROCESSED",
            },
            include: orderDetail,
        });
        yield updateSuccessStock(updateOrder.items, updateOrder.warehouseId);
        return updateOrder;
    });
}
function failedOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateOrder = yield prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                id: (0, uuid_1.v4)(),
                paymentStatus: "FAILED",
                status: "CANCELLED",
            }
        });
        return updateOrder;
    });
}
function getAllOrder(warehouseId, query, page, limit, warehouse, fromDate, toDate) {
    return __awaiter(this, void 0, void 0, function* () {
        if (warehouseId === 'none')
            return null;
        const whereCondition = {
            AND: [
                { createdAt: { gte: fromDate, lte: toDate } },
                {
                    OR: [
                        { id: { contains: query } },
                    ]
                },
                {
                    NOT: {
                        status: {
                            in: ['CART'],
                        },
                    },
                },
            ]
        };
        if (warehouseId) {
            whereCondition.AND.push({ warehouseId: warehouseId });
        }
        else {
            whereCondition.AND.push({ warehouseId: warehouse });
        }
        const order = yield prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: whereCondition,
            skip: (+page - 1) * +limit,
            take: +limit
        });
        return order;
    });
}
function totalTransactionByAdmin(warehouseId, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (warehouseId === 'none')
            return null;
        const order = yield prisma.order.count({
            where: warehouseId ? {
                AND: [
                    { warehouseId: warehouseId },
                    {
                        NOT: {
                            status: {
                                in: ['CART', 'CANCELLED'],
                            },
                        },
                    },
                ],
                OR: [
                    { id: { contains: query } },
                ]
            } : {
                AND: [
                    {
                        NOT: {
                            status: {
                                in: ['CART'],
                            },
                        },
                    },
                ],
                OR: [
                    { id: { contains: query } },
                ]
            }
        });
        return order;
    });
}
function getOrderByUser(userId, query, page, limit, fromDate, toDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const orders = yield prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                AND: [
                    { userId: userId },
                    { createdAt: { gte: fromDate, lte: toDate } },
                    {
                        NOT: {
                            status: {
                                in: ['CART'],
                            },
                        },
                    },
                ],
                OR: [
                    { id: { contains: query } },
                ]
            },
            skip: (+page - 1) * +limit,
            take: +limit
        });
        return orders;
    });
}
function getTotalOrderByUser(userId, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const orders = yield prisma.order.count({
            where: {
                AND: [
                    { userId: userId }
                ],
                OR: [
                    { id: { contains: query } },
                ]
            }
        });
        return orders;
    });
}
function getTotalOrderByAdmin(adminId, query) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const admin = yield prisma.admin.findUnique({
            where: { id: adminId },
            include: {
                Warehouse: true
            }
        });
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === 'superAdm') {
            const totalPages = yield totalTransactionByAdmin(null, query);
            return totalPages;
        }
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === 'warAdm') {
            const totalPages = yield totalTransactionByAdmin(((_a = admin.Warehouse) === null || _a === void 0 ? void 0 : _a.id) ? admin.Warehouse.id : 'none', query);
            return totalPages;
        }
    });
}
function getOrderByAdmin(adminId, query, page, limit, warehouse, fromDate, toDate) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const admin = yield prisma.admin.findUnique({
            where: { id: adminId },
            include: {
                Warehouse: true
            }
        });
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === 'superAdm') {
            const orders = yield getAllOrder(null, query, page, limit, warehouse, fromDate, toDate);
            return orders;
        }
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === 'warAdm') {
            const orders = yield getAllOrder(((_a = admin.Warehouse) === null || _a === void 0 ? void 0 : _a.id) ? admin.Warehouse.id : 'none', query, page, limit, warehouse, fromDate, toDate);
            return orders;
        }
    });
}
function updateCanceledStock(items, warehouseID) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of items) {
            const { productVariantId, quantity, size } = item;
            yield prisma.warehouseProduct.updateMany({
                where: { productVariantID: productVariantId, size, warehouseID },
                data: {
                    stock: {
                        increment: quantity
                    }
                }
            });
        }
        return;
    });
}
function cancelOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateOrder = yield prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "CANCELLED"
                },
                include: {
                    items: {
                        select: {
                            quantity: true,
                            productVariantId: true,
                            size: true
                        }
                    }
                }
            });
            yield updateCanceledStock(updateOrder.items, updateOrder.warehouseId);
            return updateOrder;
        }
        catch (err) {
            return null;
        }
    });
}
function updateShipped(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateOrder = yield prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "SHIPPED",
                    shippedAt: new Date()
                }
            });
            return updateOrder;
        }
        catch (err) {
            return null;
        }
    });
}
function updateCompletedOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateOrder = yield prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "COMPLETED",
                    shippedAt: new Date()
                }
            });
            return updateOrder;
        }
        catch (err) {
            return null;
        }
    });
}
