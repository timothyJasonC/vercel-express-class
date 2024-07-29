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
exports.SalesController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const apiResponse_1 = require("@/helpers/apiResponse");
class SalesController {
    getAllSales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { w, p, l } = req.query;
            const { date, g, t, c, q } = req.body;
            const limit = l ? l : 10;
            const fromDate = new Date(date.from);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(date.to);
            toDate.setHours(23, 59, 59, 999);
            try {
                let warehouse = yield prisma_1.default.warehouse.findFirst({
                    where: {
                        warehouseName: String(w)
                    }
                });
                const salesProduct = yield prisma_1.default.product.findMany({
                    where: {
                        name: q
                            ? { contains: String(q) }
                            : { not: undefined },
                        category: {
                            gender: g
                                ? String(g).toUpperCase()
                                : { not: undefined },
                            type: t
                                ? String(t).toUpperCase()
                                : { not: undefined },
                            category: c
                                ? String(c)
                                : { not: undefined }
                        },
                        variants: {
                            some: {
                                orderItems: {
                                    some: {
                                        order: {
                                            status: 'COMPLETED',
                                            warehouseId: warehouse ? warehouse.id : { not: undefined },
                                            createdAt: {
                                                gte: fromDate,
                                                lte: toDate
                                            },
                                        },
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        category: true,
                    },
                    take: +limit,
                    skip: (+p - 1) * +limit,
                });
                const SalesList = yield Promise.all(salesProduct.map((item) => __awaiter(this, void 0, void 0, function* () {
                    let analytics = null;
                    analytics = yield prisma_1.default.orderItem.aggregate({
                        _sum: { price: true, quantity: true },
                        _count: { id: true },
                        where: {
                            productVariant: {
                                product: {
                                    id: item.id
                                }
                            },
                            order: {
                                status: 'COMPLETED',
                                warehouseId: warehouse ? warehouse.id : { not: undefined },
                                createdAt: {
                                    gte: fromDate,
                                    lte: toDate
                                },
                            }
                        }
                    });
                    return Object.assign(Object.assign({}, item), { analytics });
                })));
                const totalSales = yield prisma_1.default.orderItem.aggregate({
                    where: {
                        order: {
                            status: 'COMPLETED',
                            warehouseId: warehouse ? warehouse.id : { not: undefined },
                        },
                        productVariant: {
                            product: {
                                name: q
                                    ? { contains: String(q) }
                                    : { not: undefined },
                                category: {
                                    gender: g
                                        ? String(g).toUpperCase()
                                        : { not: undefined },
                                    type: t
                                        ? String(t).toUpperCase()
                                        : { not: undefined },
                                    category: c
                                        ? String(c)
                                        : { not: undefined }
                                },
                            }
                        }
                    },
                    _sum: {
                        price: true,
                        quantity: true
                    },
                    _count: true
                });
                res.status(200).send({
                    status: 'ok',
                    message: 'sales found',
                    SalesList,
                    totalSales
                });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getSalesSlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { w, p, l } = req.query;
            const { slug } = req.params;
            const limit = l ? l : 10;
            const { date, v, s } = req.body;
            const fromDate = new Date(date.from);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(date.to);
            toDate.setHours(23, 59, 59, 999);
            let size = s == 'One Size' ? 'ONESIZE' : String(s).toUpperCase();
            try {
                const validSlug = yield prisma_1.default.product.findFirst({
                    where: {
                        slug
                    }
                });
                if (!validSlug)
                    throw 'No product found.';
                const warehouse = yield prisma_1.default.warehouse.findFirst({
                    where: {
                        warehouseName: String(w)
                    }
                });
                const productSales = yield prisma_1.default.orderItem.findMany({
                    where: {
                        color: v
                            ? String(v)
                            : { not: undefined },
                        size: size
                            ? size
                            : { not: undefined },
                        productVariant: {
                            product: {
                                slug
                            }
                        },
                        updatedAt: { gte: fromDate, lte: toDate },
                        order: {
                            status: 'COMPLETED',
                            warehouseId: warehouse
                                ? warehouse.id
                                : { not: undefined },
                        }
                    },
                    include: {
                        order: {
                            include: {
                                user: {
                                    select: {
                                        addresses: {
                                            select: {
                                                city_name: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        productVariant: {
                            include: {
                                product: true
                            }
                        }
                    },
                    take: +limit,
                    skip: (+p - 1) * +limit,
                });
                const totalGross = yield prisma_1.default.orderItem.aggregate({
                    where: {
                        productVariant: {
                            product: {
                                slug
                            }
                        },
                        updatedAt: { gte: fromDate, lte: toDate },
                        order: {
                            status: 'COMPLETED',
                            warehouseId: warehouse
                                ? warehouse.id
                                : { not: undefined },
                        }
                    },
                    _sum: {
                        price: true,
                        quantity: true
                    },
                    _count: true
                });
                res.status(200).send({
                    status: 'ok',
                    message: 'Sales details found.',
                    productSales,
                    totalGross
                });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.SalesController = SalesController;
