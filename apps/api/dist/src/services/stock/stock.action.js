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
exports.createMutation = createMutation;
exports.createMutationTransaction = createMutationTransaction;
exports.createMutationItem = createMutationItem;
exports.reduceStockWarehouse = reduceStockWarehouse;
exports.addStockWarehouse = addStockWarehouse;
exports.handleWarehouseDelete = handleWarehouseDelete;
exports.handleNewWarehouseStock = handleNewWarehouseStock;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
function getWarehouseProductId(warehouseID, productVariantID, size) {
    return __awaiter(this, void 0, void 0, function* () {
        const warehouseProduct = yield prisma.warehouseProduct.findFirst({
            where: {
                warehouseID,
                productVariantID,
                size: size
            },
            select: {
                id: true
            }
        });
        return warehouseProduct ? warehouseProduct.id : null;
    });
}
function createMutation(warehouseID, associatedWarehouseID, type, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const stockMutation = yield prisma.stockMutation.create({
            data: {
                id: (0, uuid_1.v4)(),
                warehouseID,
                associatedWarehouseID,
                type: type,
                status: status,
            }
        });
        return stockMutation.id;
    });
}
function createMutationTransaction(warehouseID, type, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const stockMutation = yield prisma.stockMutation.create({
            data: {
                id: (0, uuid_1.v4)(),
                warehouseID,
                type: type,
                status: status,
            }
        });
        return stockMutation;
    });
}
function createMutationItem(stockMutationID, quantity, warehouseId, productVariantId, size) {
    return __awaiter(this, void 0, void 0, function* () {
        const warehouse = yield getWarehouseProductId(warehouseId, productVariantId, size);
        const item = yield prisma.stockMutationItem.create({
            data: {
                id: (0, uuid_1.v4)(),
                quantity,
                warehouseProductID: warehouse,
                stockMutationID
            }
        });
        return item;
    });
}
function reduceStockWarehouse(warehouseID, productVariantID, size, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.warehouseProduct.updateMany({
            where: {
                warehouseID,
                productVariantID,
                size: size
            },
            data: {
                stock: {
                    decrement: quantity
                }
            }
        });
    });
}
function addStockWarehouse(warehouseID, productVariantID, size, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.warehouseProduct.updateMany({
            where: {
                warehouseID,
                productVariantID,
                size: size
            },
            data: {
                stock: {
                    increment: quantity
                }
            }
        });
    });
}
function handleWarehouseDelete(warehouseID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const whProducts = yield tx.warehouseProduct.findMany({
                where: {
                    warehouseID
                }
            });
            const mutation = yield tx.stockMutation.create({
                data: {
                    type: "DELETE",
                    warehouseID
                }
            });
            for (let i = 0; i < whProducts.length; i++) {
                yield tx.stockMutationItem.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        quantity: whProducts[i].stock,
                        stockMutationID: mutation.id,
                        warehouseProductID: whProducts[i].id
                    }
                });
            }
            yield tx.warehouseProduct.updateMany({
                where: {
                    warehouseID
                },
                data: {
                    stock: 0
                }
            });
            return 'stock emptied';
        }));
    });
}
function handleNewWarehouseStock(warehouseID) {
    return __awaiter(this, void 0, void 0, function* () {
        const sizeArray = ['S', 'M', 'L', 'XL'];
        const productList = yield prisma.product.findMany();
        for (let i = 0; i < productList.length; i++) {
            const variants = yield prisma.productVariant.findMany({
                where: {
                    productID: productList[i].id
                }
            });
            for (let v = 0; v < variants.length; v++) {
                if (productList[i].oneSize) {
                    yield prisma.warehouseProduct.create({
                        data: {
                            warehouseID: warehouseID,
                            productVariantID: variants[v].id,
                            size: 'ONESIZE',
                            stock: 0
                        }
                    });
                }
                else {
                    for (let z = 0; z < sizeArray.length; z++) {
                        yield prisma.warehouseProduct.create({
                            data: {
                                warehouseID: warehouseID,
                                productVariantID: variants[v].id,
                                size: sizeArray[z],
                                stock: 0
                            }
                        });
                    }
                }
            }
        }
    });
}
