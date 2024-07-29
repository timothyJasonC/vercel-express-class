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
exports.StockController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const uuid_1 = require("uuid");
const apiResponse_1 = require("@/helpers/apiResponse");
class StockController {
    createStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ProductSize;
            (function (ProductSize) {
                ProductSize["S"] = "S";
                ProductSize["M"] = "M";
                ProductSize["L"] = "L";
                ProductSize["XL"] = "XL";
            })(ProductSize || (ProductSize = {}));
            try {
                const sizeArray = [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL];
                const { warehouseName, type, variant } = req.body;
                if (!warehouseName || !type || !variant)
                    throw "Invalid stock data input.";
                if (["RESTOCK", "TRANSFER", "RESTOCK", "REMOVE", "TRANSACTION", "INBOUND", "DELETE"].includes(type) == false)
                    throw "Invalid stock data input.";
                const mutationType = type.toUpperCase();
                const warehouseCheck = yield prisma_1.default.warehouse.findFirst();
                if (!warehouseCheck)
                    throw 'There is no existing warehouse.';
                if (warehouseName === "All Warehouses" || warehouseName === '') {
                    const wareHouseList = yield prisma_1.default.warehouse.findMany({
                        where: {
                            isActive: true
                        }
                    });
                    yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                        for (let w = 0; w < wareHouseList.length; w++) {
                            const stockMutation = yield tx.stockMutation.create({
                                data: {
                                    id: (0, uuid_1.v4)(),
                                    warehouseID: wareHouseList[w].id,
                                    type: mutationType
                                }
                            });
                            for (let i = 0; i < variant.length; i++) {
                                if (variant[i].size === "All Sizes") {
                                    for (let k = 0; k < sizeArray.length; k++) {
                                        let currentStock;
                                        currentStock = yield tx.warehouseProduct.findFirst({
                                            where: {
                                                productVariantID: variant[i].id,
                                                size: sizeArray[k],
                                                warehouseID: stockMutation.warehouseID
                                            }, include: {
                                                productVariant: {
                                                    include: {
                                                        product: {
                                                            select: {
                                                                name: true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                        if (!currentStock) {
                                            currentStock = yield tx.warehouseProduct.create({
                                                data: {
                                                    id: (0, uuid_1.v4)(),
                                                    size: sizeArray[k],
                                                    stock: 0,
                                                    isDelete: false,
                                                    productVariantID: variant[i].id,
                                                    warehouseID: stockMutation.warehouseID
                                                }, include: {
                                                    productVariant: {
                                                        include: {
                                                            product: {
                                                                select: {
                                                                    name: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        if (currentStock.stock < variant[i].qty && type == "REMOVE")
                                            throw `Failed to remove, insufficient stock at ${wareHouseList[w].warehouseName} (${currentStock.stock}, ${currentStock === null || currentStock === void 0 ? void 0 : currentStock.productVariant.color}, ${sizeArray[k]})`;
                                        const newStockLog = yield tx.stockMutationItem.create({
                                            data: {
                                                id: (0, uuid_1.v4)(),
                                                quantity: variant[i].qty,
                                                stockMutationID: stockMutation.id,
                                                warehouseProductID: currentStock.id
                                            }
                                        });
                                        yield tx.warehouseProduct.update({
                                            where: {
                                                id: currentStock === null || currentStock === void 0 ? void 0 : currentStock.id,
                                            },
                                            data: {
                                                stock: Number(mutationType == "RESTOCK" || mutationType === "INBOUND"
                                                    ? newStockLog.quantity + currentStock.stock
                                                    : currentStock.stock > newStockLog.quantity
                                                        ? currentStock.stock - newStockLog.quantity
                                                        : 0),
                                                updatedAt: new Date()
                                            }
                                        });
                                    }
                                }
                                else {
                                    let currentStock;
                                    currentStock = yield tx.warehouseProduct.findFirst({
                                        where: {
                                            productVariantID: variant[i].id,
                                            size: variant[i].size.toUpperCase(),
                                            warehouseID: stockMutation.warehouseID
                                        }, include: {
                                            productVariant: {
                                                include: {
                                                    product: {
                                                        select: {
                                                            name: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    if (!currentStock) {
                                        currentStock = yield tx.warehouseProduct.create({
                                            data: {
                                                id: (0, uuid_1.v4)(),
                                                size: variant[i].size.toUpperCase(),
                                                stock: 0,
                                                isDelete: false,
                                                productVariantID: variant[i].id,
                                                warehouseID: stockMutation.warehouseID
                                            }, include: {
                                                productVariant: {
                                                    include: {
                                                        product: {
                                                            select: {
                                                                name: true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    if (currentStock.stock < variant[i].qty && type == "REMOVE")
                                        throw `Failed to remove, insufficient stock at  ${wareHouseList[w].warehouseName} (${currentStock.stock}, ${currentStock === null || currentStock === void 0 ? void 0 : currentStock.productVariant.color}, ${variant[i].size.toUpperCase()}`;
                                    const newStockLog = yield tx.stockMutationItem.create({
                                        data: {
                                            id: (0, uuid_1.v4)(),
                                            quantity: variant[i].qty,
                                            stockMutationID: stockMutation.id,
                                            warehouseProductID: currentStock.id
                                        }
                                    });
                                    yield tx.warehouseProduct.update({
                                        where: {
                                            id: currentStock === null || currentStock === void 0 ? void 0 : currentStock.id,
                                        },
                                        data: {
                                            stock: Number(mutationType == "RESTOCK" || mutationType === "INBOUND"
                                                ? newStockLog.quantity + currentStock.stock
                                                : currentStock.stock > newStockLog.quantity
                                                    ? currentStock.stock - newStockLog.quantity
                                                    : 0)
                                        }
                                    });
                                }
                            }
                        }
                    }));
                }
                else {
                    yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                        const wareHouseList = yield tx.warehouse.findFirst({
                            where: {
                                warehouseName,
                                isActive: true
                            }
                        });
                        if (!wareHouseList)
                            throw "Warehouse is inactive, please activate the warehouse.";
                        const stockMutation = yield tx.stockMutation.create({
                            data: {
                                id: (0, uuid_1.v4)(),
                                warehouseID: wareHouseList.id,
                                type: mutationType
                            }
                        });
                        for (let i = 0; i < variant.length; i++) {
                            if (variant[i].size === "All Sizes") {
                                for (let k = 0; k < sizeArray.length; k++) {
                                    let currentStock;
                                    currentStock = yield tx.warehouseProduct.findFirst({
                                        where: {
                                            productVariantID: variant[i].id,
                                            size: sizeArray[k],
                                            warehouseID: stockMutation.warehouseID
                                        }, include: {
                                            productVariant: {
                                                include: {
                                                    product: {
                                                        select: {
                                                            name: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    if (!currentStock) {
                                        currentStock = yield tx.warehouseProduct.create({
                                            data: {
                                                id: (0, uuid_1.v4)(),
                                                size: sizeArray[k],
                                                stock: 0,
                                                isDelete: false,
                                                productVariantID: variant[i].id,
                                                warehouseID: stockMutation.warehouseID
                                            }, include: {
                                                productVariant: {
                                                    include: {
                                                        product: {
                                                            select: {
                                                                name: true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    if (currentStock.stock < variant[i].qty && type == "REMOVE")
                                        throw `Failed to remove, insufficient stock at ${wareHouseList.warehouseName} (${currentStock.stock}, ${currentStock === null || currentStock === void 0 ? void 0 : currentStock.productVariant.color}, ${sizeArray[k]})`;
                                    const newStockLog = yield tx.stockMutationItem.create({
                                        data: {
                                            id: (0, uuid_1.v4)(),
                                            quantity: variant[i].qty,
                                            stockMutationID: stockMutation.id,
                                            warehouseProductID: currentStock.id
                                        }
                                    });
                                    yield tx.warehouseProduct.update({
                                        where: {
                                            id: currentStock === null || currentStock === void 0 ? void 0 : currentStock.id,
                                        },
                                        data: {
                                            stock: Number(mutationType == "RESTOCK" || mutationType === "INBOUND"
                                                ? newStockLog.quantity + currentStock.stock
                                                : currentStock.stock > newStockLog.quantity
                                                    ? currentStock.stock - newStockLog.quantity
                                                    : 0),
                                            updatedAt: new Date()
                                        }
                                    });
                                }
                            }
                            else {
                                let currentStock;
                                currentStock = yield tx.warehouseProduct.findFirst({
                                    where: {
                                        productVariantID: variant[i].id,
                                        size: variant[i].size.toUpperCase(),
                                        warehouseID: stockMutation.warehouseID
                                    }, include: {
                                        productVariant: {
                                            include: {
                                                product: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                                if (!currentStock) {
                                    currentStock = yield tx.warehouseProduct.create({
                                        data: {
                                            id: (0, uuid_1.v4)(),
                                            size: variant[i].size.toUpperCase(),
                                            stock: 0,
                                            isDelete: false,
                                            productVariantID: variant[i].id,
                                            warehouseID: stockMutation.warehouseID
                                        }, include: {
                                            productVariant: {
                                                include: {
                                                    product: {
                                                        select: {
                                                            name: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                                if (currentStock.stock < variant[i].qty && type == "REMOVE")
                                    throw `Failed to remove, insufficient stock at ${wareHouseList.warehouseName} (${currentStock.stock}, ${currentStock === null || currentStock === void 0 ? void 0 : currentStock.productVariant.color}, ${variant[i].size.toUpperCase()})`;
                                const newStockLog = yield tx.stockMutationItem.create({
                                    data: {
                                        id: (0, uuid_1.v4)(),
                                        quantity: variant[i].qty,
                                        stockMutationID: stockMutation.id,
                                        warehouseProductID: currentStock.id
                                    }
                                });
                                yield tx.warehouseProduct.update({
                                    where: {
                                        id: currentStock === null || currentStock === void 0 ? void 0 : currentStock.id,
                                    },
                                    data: {
                                        stock: Number(mutationType == "RESTOCK" || mutationType === "INBOUND"
                                            ? newStockLog.quantity + currentStock.stock
                                            : currentStock.stock > newStockLog.quantity
                                                ? currentStock.stock - newStockLog.quantity
                                                : 0)
                                    }
                                });
                            }
                        }
                    }));
                }
                const getProduct = yield prisma_1.default.productVariant.findUnique({
                    where: {
                        id: variant[0].id
                    }, select: {
                        product: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
                yield prisma_1.default.product.update({
                    data: {
                        stockUpdatedAt: new Date()
                    },
                    where: {
                        id: getProduct.product.id
                    }
                });
                return res.status(200).send({
                    status: 'ok',
                    message: 'stock updated'
                });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getStockByVariant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { s, w } = req.query;
                const { variant } = req.params;
                if (w && !s) {
                    const stock = yield prisma_1.default.warehouseProduct.groupBy({
                        by: ['size'],
                        _sum: {
                            stock: true
                        },
                        where: {
                            productVariantID: String(variant),
                            warehouse: {
                                warehouseName: String(w)
                            }
                        },
                    });
                    const totalStock = yield prisma_1.default.warehouseProduct.aggregate({
                        _sum: {
                            stock: true
                        },
                        where: {
                            productVariantID: String(variant),
                        },
                    });
                    (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'stock found', { stock, totalStock });
                }
                else if (w && s) {
                    const stock = yield prisma_1.default.warehouseProduct.aggregate({
                        _sum: {
                            stock: true
                        },
                        where: {
                            productVariantID: String(variant),
                            size: String(s).toUpperCase(),
                            warehouse: {
                                warehouseName: String(w)
                            }
                        },
                    });
                    (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'stock found', stock._sum);
                }
                else {
                    const stock = yield prisma_1.default.warehouseProduct.aggregate({
                        _sum: {
                            stock: true
                        },
                        where: {
                            productVariantID: String(variant),
                            size: String(s).toUpperCase(),
                        },
                    });
                    (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'stock found', stock._sum);
                }
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', 'stock not found', error);
            }
        });
    }
    getAllStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { w, p, l } = req.query;
                const { date, g, t, c, q } = req.body;
                const limit = l ? l : 10;
                const fromDate = new Date(date.from);
                fromDate.setHours(0, 0, 0, 0);
                const toDate = new Date(date.to);
                toDate.setHours(23, 59, 59, 999);
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const products = yield tx.product.findMany({
                        include: {
                            images: true,
                            variants: {
                                include: {
                                    warehouseProduct: {
                                        select: {
                                            warehouseID: true,
                                            id: true,
                                            size: true,
                                            stock: true,
                                            updatedAt: true,
                                        }
                                    }
                                }, where: {
                                    isDeleted: false
                                },
                            },
                            category: true,
                        },
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
                                    warehouseProduct: {
                                        some: {
                                            warehouse: {
                                                warehouseName: w ? String(w) : { not: undefined },
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        take: +limit,
                        skip: (+p - 1) * +limit,
                        orderBy: {
                            stockUpdatedAt: 'desc'
                        }
                    });
                    const productsWithStock = products.map(product => (Object.assign(Object.assign({}, product), { variants: product.variants.map(variant => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) })));
                    const productList = yield Promise.all(productsWithStock.map((product) => __awaiter(this, void 0, void 0, function* () {
                        const totalStock = yield prisma_1.default.warehouseProduct.aggregate({
                            where: {
                                warehouse: {
                                    warehouseName: w
                                        ? String(w)
                                        : { not: undefined }
                                },
                                productVariant: {
                                    product: {
                                        id: product.id
                                    }
                                }
                            },
                            _sum: {
                                stock: true
                            }
                        });
                        const stockIn = yield prisma_1.default.stockMutationItem.aggregate({
                            _sum: {
                                quantity: true,
                            },
                            where: {
                                WarehouseProduct: {
                                    warehouse: {
                                        warehouseName: w
                                            ? String(w)
                                            : { not: undefined }
                                    },
                                    productVariant: {
                                        product: {
                                            id: product.id
                                        }
                                    }
                                },
                                stockMutation: {
                                    AND: [
                                        { OR: [
                                                { AND: [
                                                        { type: "INBOUND" },
                                                        { status: 'ACCEPTED' }
                                                    ]
                                                },
                                                { type: 'RESTOCK' }
                                            ] },
                                        { createdAt: { gte: fromDate, lte: toDate } }
                                    ]
                                },
                            },
                        });
                        const stockOut = yield prisma_1.default.stockMutationItem.aggregate({
                            _sum: {
                                quantity: true,
                            },
                            where: {
                                WarehouseProduct: {
                                    warehouse: {
                                        warehouseName: w
                                            ? String(w)
                                            : { not: undefined }
                                    },
                                    productVariant: {
                                        product: {
                                            id: product.id
                                        }
                                    }
                                },
                                stockMutation: {
                                    AND: [
                                        { OR: [
                                                { type: 'DELETE' },
                                                { type: 'REMOVE' },
                                                { type: 'TRANSACTION' },
                                                { AND: [
                                                        { type: 'TRANSFER' },
                                                        { status: 'ACCEPTED' }
                                                    ] },
                                            ] },
                                        { createdAt: { gte: fromDate, lte: toDate } }
                                    ]
                                },
                            },
                        });
                        const toDateStockIn = yield prisma_1.default.stockMutationItem.aggregate({
                            _sum: {
                                quantity: true,
                            },
                            where: {
                                WarehouseProduct: {
                                    warehouse: {
                                        warehouseName: w
                                            ? String(w)
                                            : { not: undefined }
                                    },
                                    productVariant: {
                                        product: {
                                            id: product.id
                                        }
                                    }
                                },
                                stockMutation: {
                                    AND: [
                                        { OR: [
                                                { AND: [
                                                        { type: "INBOUND" },
                                                        { status: 'ACCEPTED' }
                                                    ]
                                                },
                                                { type: 'RESTOCK' }
                                            ] },
                                        { createdAt: { lte: toDate } }
                                    ]
                                },
                            },
                        });
                        const toDateStockOut = yield prisma_1.default.stockMutationItem.aggregate({
                            _sum: {
                                quantity: true,
                            },
                            where: {
                                WarehouseProduct: {
                                    warehouse: {
                                        warehouseName: w
                                            ? String(w)
                                            : { not: undefined }
                                    },
                                    productVariant: {
                                        product: {
                                            id: product.id
                                        }
                                    }
                                },
                                stockMutation: {
                                    AND: [
                                        { OR: [
                                                { type: 'DELETE' },
                                                { type: 'REMOVE' },
                                                { type: 'TRANSACTION' },
                                                { AND: [
                                                        { type: 'TRANSFER' },
                                                        { status: 'ACCEPTED' }
                                                    ] },
                                            ] },
                                        { createdAt: { lte: toDate } }
                                    ]
                                },
                            },
                        });
                        const toDateStock = (toDateStockIn._sum.quantity ? toDateStockIn._sum.quantity : 0) - (toDateStockOut._sum.quantity ? toDateStockOut._sum.quantity : 0);
                        return Object.assign(Object.assign({}, product), { stockIn,
                            stockOut,
                            toDateStock, totalStock: totalStock._sum.stock });
                    })));
                    const totalStock = yield tx.warehouseProduct.aggregate({
                        _sum: {
                            stock: true
                        },
                        where: {
                            warehouse: {
                                warehouseName: w
                                    ? String(w)
                                    : { not: undefined }
                            }
                        }
                    });
                    const totalProduct = yield tx.product.count({
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
                                    warehouseProduct: {
                                        some: {
                                            warehouse: {
                                                warehouseName: w ? String(w) : { not: undefined },
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    });
                    return res.status(200).send({
                        status: 'ok',
                        message: 'product found',
                        productList,
                        totalStock: totalStock._sum.stock,
                        totalProduct
                    });
                }));
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getStockSlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { w, p, l } = req.query;
            const { slug } = req.params;
            const { date, t, v, s } = req.body;
            const fromDate = new Date(date.from);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(date.to);
            toDate.setHours(23, 59, 59, 999);
            const limit = l ? l : 10;
            let size = s == 'One Size' ? 'ONESIZE' : String(s).toUpperCase();
            try {
                const validSlug = yield prisma_1.default.product.findFirst({
                    where: {
                        slug
                    }
                });
                if (!validSlug)
                    throw 'No product found.';
                const stocks = yield prisma_1.default.stockMutationItem.findMany({
                    where: {
                        WarehouseProduct: {
                            size: size
                                ? size
                                : { not: undefined },
                            productVariant: {
                                color: v
                                    ? String(v)
                                    : { not: undefined },
                                product: { slug }
                            }
                        }, stockMutation: {
                            createdAt: {
                                gte: fromDate,
                                lte: toDate
                            },
                            type: t ? String(t).toUpperCase()
                                : { not: undefined },
                            warehouse: {
                                warehouseName: w ? String(w)
                                    : { not: undefined }
                            },
                            OR: [
                                { status: "ACCEPTED" },
                                { status: null }
                            ]
                        }
                    },
                    include: {
                        stockMutation: true,
                        WarehouseProduct: {
                            include: {
                                productVariant: true,
                                warehouse: true
                            }
                        }
                    },
                    take: +limit,
                    skip: (+p - 1) * +limit,
                    orderBy: {
                        stockMutation: {
                            createdAt: 'desc'
                        }
                    }
                });
                const totalData = yield prisma_1.default.stockMutationItem.count({
                    where: {
                        WarehouseProduct: {
                            size: size
                                ? size
                                : { not: undefined },
                            productVariant: {
                                color: v
                                    ? String(v)
                                    : { not: undefined },
                                product: { slug }
                            }
                        }, stockMutation: {
                            type: t ? String(t).toUpperCase()
                                : { not: undefined },
                            warehouse: {
                                warehouseName: w ? String(w)
                                    : { not: undefined }
                            },
                            OR: [
                                { status: "ACCEPTED" },
                                { status: null }
                            ]
                        }
                    },
                });
                const stockList = yield Promise.all(stocks.map((item) => __awaiter(this, void 0, void 0, function* () {
                    let associatedWH = null;
                    if (item.stockMutation.associatedWarehouseID) {
                        associatedWH = yield prisma_1.default.warehouse.findFirst({
                            where: {
                                id: item.stockMutation.associatedWarehouseID
                            }
                        });
                    }
                    return Object.assign(Object.assign({}, item), { associatedWH });
                })));
                res.status(200).send({
                    status: 'ok',
                    message: 'Stock data found',
                    stockList,
                    totalData
                });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.StockController = StockController;
