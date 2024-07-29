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
exports.MutationController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const uuid_1 = require("uuid");
const apiResponse_1 = require("@/helpers/apiResponse");
class MutationController {
    createMutationRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { selectedWH, targetWH, variant, size, qty } = req.body;
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const current = yield tx.warehouse.findFirst({ where: { warehouseName: selectedWH } });
                    if (!current)
                        throw 'Invalid current warehouse.';
                    const target = yield tx.warehouse.findFirst({ where: { warehouseName: targetWH } });
                    if (!target)
                        throw 'Invalid target warehouse.';
                    const product = yield tx.warehouseProduct.findFirst({
                        where: {
                            isDelete: false,
                            productVariantID: variant,
                            size: size,
                            warehouseID: current.id
                        }
                    });
                    const mutation = yield tx.stockMutation.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            type: "INBOUND",
                            status: "WAITING",
                            warehouseID: current.id,
                            associatedWarehouseID: target.id,
                        }
                    });
                    yield tx.stockMutationItem.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            quantity: qty,
                            stockMutationID: mutation.id,
                            warehouseProductID: product.id,
                        }
                    });
                }));
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'stock mutation request created.');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getMutation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { wh } = req.params;
            const { type, status, p, l } = req.query;
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({
                    where: {
                        warehouseName: wh
                    }
                });
                if (!warehouse)
                    throw 'Invalid warehouse.';
                const mutationList = yield prisma_1.default.stockMutation.findMany({
                    where: {
                        warehouseID: warehouse.id,
                        type: String(type).toUpperCase(),
                        status: status === 'completed'
                            ? {
                                not: { equals: 'WAITING' },
                            }
                            : String(status).toUpperCase(),
                        StockMutationItem: {
                            none: {
                                WarehouseProduct: {
                                    isDelete: true,
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        StockMutationItem: {
                            include: {
                                WarehouseProduct: {
                                    include: {
                                        productVariant: {
                                            include: {
                                                product: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    take: +l,
                    skip: (+p - 1) * +l,
                });
                const formattedMutationList = yield Promise.all(mutationList.map((mutation) => __awaiter(this, void 0, void 0, function* () {
                    const associatedWarehouse = yield prisma_1.default.warehouse.findFirst({
                        where: {
                            id: mutation.associatedWarehouseID,
                        },
                    });
                    return Object.assign(Object.assign({}, mutation), { associatedWarehouseName: associatedWarehouse === null || associatedWarehouse === void 0 ? void 0 : associatedWarehouse.warehouseName });
                })));
                const total = yield prisma_1.default.stockMutation.count({
                    where: {
                        warehouseID: warehouse.id,
                        type: String(type).toUpperCase(),
                        status: status === 'completed'
                            ? {
                                not: { equals: 'WAITING' },
                            }
                            : String(status).toUpperCase()
                    },
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'mutation found', { mutationList: formattedMutationList, total });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getMutationRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { wh } = req.params;
            const { status, p, l } = req.query;
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({
                    where: {
                        warehouseName: wh
                    }
                });
                if (!warehouse)
                    throw 'Invalid warehouse.';
                const mutationList = yield prisma_1.default.stockMutation.findMany({
                    where: {
                        associatedWarehouseID: warehouse.id,
                        type: 'INBOUND',
                        status: status === 'completed'
                            ? {
                                not: { equals: 'WAITING' },
                            }
                            : String(status).toUpperCase(),
                        StockMutationItem: {
                            none: {
                                WarehouseProduct: {
                                    isDelete: true,
                                },
                            },
                        },
                    }, orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        StockMutationItem: {
                            include: {
                                WarehouseProduct: {
                                    include: {
                                        productVariant: {
                                            include: {
                                                product: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    take: +l,
                    skip: (+p - 1) * +l,
                });
                const formattedMutationList = yield Promise.all(mutationList.map((mutation) => __awaiter(this, void 0, void 0, function* () {
                    const requestingWarehouse = yield prisma_1.default.warehouse.findFirst({
                        where: {
                            id: mutation.warehouseID,
                        },
                    });
                    return Object.assign(Object.assign({}, mutation), { requestingWarehouse: requestingWarehouse === null || requestingWarehouse === void 0 ? void 0 : requestingWarehouse.warehouseName });
                })));
                const total = yield prisma_1.default.stockMutation.count({
                    where: {
                        associatedWarehouseID: warehouse.id,
                        type: "INBOUND",
                        status: status === 'completed'
                            ? {
                                not: { equals: 'WAITING' },
                            }
                            : String(status).toUpperCase(),
                    },
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'mutation found', { mutationList: formattedMutationList, total });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    acceptMutation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const mutation = yield tx.stockMutation.update({
                        data: {
                            status: 'ACCEPTED',
                            updatedAt: new Date()
                        },
                        where: {
                            id
                        },
                        include: {
                            StockMutationItem: {
                                include: {
                                    WarehouseProduct: {
                                        include: {
                                            productVariant: true
                                        }
                                    }
                                }
                            }
                        }
                    });
                    const whproduct = yield tx.warehouseProduct.findFirst({
                        where: {
                            id: mutation.StockMutationItem[0].warehouseProductID,
                            isDelete: false
                        }
                    });
                    if (!whproduct)
                        throw 'Product variant does not exists.';
                    const wpUpdate = yield tx.warehouseProduct.update({
                        where: {
                            id: mutation.StockMutationItem[0].warehouseProductID
                        },
                        data: {
                            stock: whproduct.stock + mutation.StockMutationItem[0].quantity
                        },
                        select: {
                            productVariant: true
                        }
                    });
                    yield tx.product.update({
                        data: {
                            stockUpdatedAt: new Date()
                        },
                        where: {
                            id: wpUpdate.productVariant.productID
                        }
                    });
                    const mutationAsc = yield tx.stockMutation.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            type: "TRANSFER",
                            status: 'ACCEPTED',
                            createdAt: new Date(),
                            warehouseID: mutation.associatedWarehouseID,
                            associatedWarehouseID: mutation.warehouseID,
                        },
                        include: {
                            StockMutationItem: true
                        }
                    });
                    const whProductAsc = yield tx.warehouseProduct.findFirst({
                        where: {
                            warehouseID: mutation.associatedWarehouseID,
                            isDelete: false,
                            productVariantID: mutation.StockMutationItem[0].WarehouseProduct.productVariant.id,
                            size: mutation.StockMutationItem[0].WarehouseProduct.size
                        }
                    });
                    if (!whProductAsc)
                        throw 'Product variant does not exists.';
                    yield tx.stockMutationItem.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            quantity: mutation.StockMutationItem[0].quantity,
                            warehouseProductID: whProductAsc.id,
                            stockMutationID: mutationAsc.id,
                        }
                    });
                    if (whProductAsc.stock < mutation.StockMutationItem[0].quantity)
                        throw 'Stock at warehouse is lower than requested amount.';
                    const wpUpdateAsc = yield tx.warehouseProduct.update({
                        where: {
                            id: whProductAsc.id
                        },
                        data: {
                            stock: whProductAsc.stock - mutation.StockMutationItem[0].quantity
                        },
                        select: {
                            productVariant: true
                        }
                    });
                    yield tx.product.update({
                        data: {
                            stockUpdatedAt: new Date()
                        },
                        where: {
                            id: wpUpdateAsc.productVariant.productID
                        }
                    });
                }));
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Stock successfully transfered.');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    rejectMutation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.stockMutation.update({
                    data: {
                        status: 'REJECTED',
                        updatedAt: new Date()
                    },
                    where: {
                        id
                    },
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Stock mutation rejected.');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error');
            }
        });
    }
    cancelMutation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.stockMutationItem.deleteMany({
                    where: {
                        stockMutationID: id
                    }
                });
                yield prisma_1.default.stockMutation.delete({
                    where: {
                        id
                    },
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Stock mutation request deleted.');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error');
            }
        });
    }
}
exports.MutationController = MutationController;
