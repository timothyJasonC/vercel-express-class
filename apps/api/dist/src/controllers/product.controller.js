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
exports.ProductController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const edit_action_1 = require("@/services/product/edit.action");
const create_action_1 = require("@/services/product/create.action");
const apiResponse_1 = require("@/helpers/apiResponse");
var ProductSize;
(function (ProductSize) {
    ProductSize["S"] = "S";
    ProductSize["M"] = "M";
    ProductSize["L"] = "L";
    ProductSize["XL"] = "XL";
})(ProductSize || (ProductSize = {}));
class ProductController {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, create_action_1.createProduct)(req, res);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getProductName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { n } = req.query;
                const query = {
                    select: {
                        name: true,
                        slug: true
                    },
                    where: {
                        name: n ? { contains: String(n) } : { not: undefined }
                    },
                    orderBy: {
                        name: 'asc'
                    }
                };
                if (n) {
                    query.take = 6;
                }
                const productNameList = yield prisma_1.default.product.findMany(query);
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'product name found.', productNameList);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getProduct(req, res) {
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
                                        }, orderBy: {
                                            updatedAt: 'desc'
                                        }
                                    }
                                }, where: {
                                    isDeleted: false
                                }
                            },
                            category: true,
                        },
                        where: {
                            name: q
                                ? { contains: String(q) }
                                : { not: undefined },
                            createdAt: { gte: fromDate, lte: toDate },
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
                                    isDeleted: false,
                                }
                            }
                        },
                        take: +limit,
                        skip: (+p - 1) * +limit
                    });
                    const productsWithStock = products.map(product => (Object.assign(Object.assign({}, product), { variants: product.variants.map(variant => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) })));
                    const productList = productsWithStock.map(product => (Object.assign(Object.assign({}, product), { totalStock: product.variants.reduce((total, variant) => {
                            return total + variant.warehouseProduct.reduce((variantTotal, wp) => variantTotal + wp.stock, 0);
                        }, 0) })));
                    const totalStock = yield tx.warehouseProduct.aggregate({
                        _sum: {
                            stock: true
                        },
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
    // async getProductBySlug(req: Request, res: Response) {
    //     try {
    //         const {slug} = req.params
    //         const {w, s} = req.query
    //         await prisma.$transaction(async (tx)=> {
    //             const products = await tx.product.findFirst({
    //                 where: {
    //                     slug,
    //                     variants: {
    //                         some: {
    //                             isDeleted: false,
    //                             warehouseProduct: {
    //                                 some: {
    //                                     warehouse: {
    //                                         warehouseName: w ? String(w) : {not: undefined},
    //                                     },
    //                                     size: s ? String(s).toUpperCase() as ProductSize : {not: undefined},
    //                                     isDelete: false
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 },
    //                 include: {
    //                     images: true,
    //                     variants: {
    //                         include: {
    //                             warehouseProduct: {
    //                                 where: {
    //                                     warehouse: {
    //                                         warehouseName: w ? String(w) : {not: undefined},
    //                                     },
    //                                     size: s ? String(s).toUpperCase() as ProductSize : {not: undefined},
    //                                     isDelete: false
    //                                 }
    //                                 ,orderBy: {
    //                                     updatedAt: 'desc'
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     category: true
    //                 }
    //             })
    //             const productsWithStock = {
    //                 ...products,
    //                 variants: products!.variants.map((variant:any) => ({
    //                 ...variant,
    //                 totalStock: variant.warehouseProduct.reduce((total:any, wp:any) => total + wp.stock, 0)
    //                 }))
    //             }
    //             const productList = {
    //                 ...productsWithStock,
    //                 totalStock: products!.variants.reduce((total:any, variant:any) => {
    //                 return total + variant.warehouseProduct.reduce((variantTotal:any, wp:any) => variantTotal + wp.stock, 0);
    //                 }, 0)
    //             }
    //             const sizeSum = await tx.warehouseProduct.groupBy({
    //                 by: ['size'!, 'productVariantID'],
    //                 _sum: {
    //                     stock: true
    //                 }, 
    //                 where: {
    //                     productVariant: {
    //                         product: {
    //                             slug
    //                         }
    //                     },
    //                 },
    //             })
    //             return res.status(200).send({
    //                 status: 'ok',
    //                 message: 'product found',
    //                 productList,
    //                 sizeSum
    //             })
    //         })
    //     } catch (error:any) {
    //         serverResponse(res, 400, 'error', error)
    //     } 
    // }
    getProductBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const { w, s } = req.query;
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    if (w === "All Warehouses" || w === '') {
                        if (s) {
                            const products = yield tx.product.findFirst({
                                where: {
                                    slug
                                },
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
                                                }, orderBy: {
                                                    updatedAt: 'desc'
                                                }, where: {
                                                    size: String(s).toUpperCase(),
                                                    isDelete: false
                                                }
                                            }
                                        },
                                        where: {
                                            isDeleted: false
                                        }
                                    },
                                    category: true
                                }
                            });
                            const productsWithStock = Object.assign(Object.assign({}, products), { variants: products.variants.map((variant) => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) });
                            const productList = Object.assign(Object.assign({}, productsWithStock), { totalStock: products.variants.reduce((total, variant) => {
                                    return total + variant.warehouseProduct.reduce((variantTotal, wp) => variantTotal + wp.stock, 0);
                                }, 0) });
                            return res.status(200).send({
                                status: 'ok',
                                message: 'product found',
                                productList
                            });
                        }
                        else {
                            const products = yield tx.product.findFirst({
                                where: {
                                    slug
                                },
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
                                                }, orderBy: {
                                                    updatedAt: 'desc'
                                                }, where: {
                                                    isDelete: false
                                                }
                                            }
                                        }, where: {
                                            isDeleted: false
                                        }
                                    },
                                    category: true
                                }
                            });
                            const productsWithStock = Object.assign(Object.assign({}, products), { variants: products.variants.map((variant) => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) });
                            const productList = Object.assign(Object.assign({}, productsWithStock), { totalStock: products.variants.reduce((total, variant) => {
                                    return total + variant.warehouseProduct.reduce((variantTotal, wp) => variantTotal + wp.stock, 0);
                                }, 0) });
                            const sizeSum = yield tx.warehouseProduct.groupBy({
                                by: ['size', 'productVariantID'],
                                _sum: {
                                    stock: true
                                },
                                where: {
                                    productVariant: {
                                        product: {
                                            slug
                                        }
                                    },
                                },
                            });
                            return res.status(200).send({
                                status: 'ok',
                                message: 'product found',
                                productList,
                                sizeSum
                            });
                        }
                    }
                    else {
                        if (s) {
                            const products = yield tx.product.findFirst({
                                where: {
                                    slug,
                                },
                                include: {
                                    images: true,
                                    variants: {
                                        include: {
                                            warehouseProduct: {
                                                where: {
                                                    warehouse: {
                                                        warehouseName: String(w)
                                                    },
                                                    size: String(s).toUpperCase(),
                                                    isDelete: false
                                                },
                                                select: {
                                                    warehouseID: true,
                                                    id: true,
                                                    size: true,
                                                    stock: true,
                                                    updatedAt: true,
                                                }, orderBy: {
                                                    updatedAt: 'desc'
                                                }
                                            }
                                        }, where: {
                                            isDeleted: false
                                        }
                                    },
                                    category: true
                                }
                            });
                            const productsWithStock = Object.assign(Object.assign({}, products), { variants: products.variants.map((variant) => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) });
                            const productList = Object.assign(Object.assign({}, productsWithStock), { totalStock: products.variants.reduce((total, variant) => {
                                    return total + variant.warehouseProduct.reduce((variantTotal, wp) => variantTotal + wp.stock, 0);
                                }, 0) });
                            return res.status(200).send({
                                status: 'ok',
                                message: 'product found',
                                productList
                            });
                        }
                        else {
                            const products = yield tx.product.findFirst({
                                where: {
                                    slug,
                                },
                                include: {
                                    images: true,
                                    variants: {
                                        include: {
                                            warehouseProduct: {
                                                where: {
                                                    warehouse: {
                                                        warehouseName: String(w),
                                                    }, isDelete: false
                                                },
                                                select: {
                                                    warehouseID: true,
                                                    id: true,
                                                    size: true,
                                                    stock: true,
                                                    updatedAt: true,
                                                }, orderBy: {
                                                    updatedAt: 'desc'
                                                }
                                            }
                                        }, where: {
                                            isDeleted: false
                                        }
                                    },
                                    category: true
                                }
                            });
                            const productsWithStock = Object.assign(Object.assign({}, products), { variants: products.variants.map((variant) => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) });
                            const productList = Object.assign(Object.assign({}, productsWithStock), { totalStock: products.variants.reduce((total, variant) => {
                                    return total + variant.warehouseProduct.reduce((variantTotal, wp) => variantTotal + wp.stock, 0);
                                }, 0) });
                            return res.status(200).send({
                                status: 'ok',
                                message: 'product found',
                                productList
                            });
                        }
                    }
                }));
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    editProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, edit_action_1.editProduct)(req, res);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.stockMutationItem.deleteMany({
                        where: {
                            WarehouseProduct: {
                                productVariant: {
                                    product: {
                                        slug
                                    }
                                }
                            }
                        }
                    });
                    yield tx.warehouseProduct.deleteMany({
                        where: {
                            productVariant: {
                                product: {
                                    slug
                                }
                            }
                        }
                    });
                    yield tx.productVariant.deleteMany({
                        where: {
                            product: {
                                slug
                            }
                        }
                    });
                    yield tx.productImage.deleteMany({
                        where: {
                            product: {
                                slug
                            }
                        }
                    });
                    yield tx.product.delete({
                        where: {
                            slug
                        }
                    });
                    return res.status(200).send({
                        status: 'ok',
                        message: 'Product deleted.'
                    });
                }));
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getCatalogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { g, t, c, p, l, s, q } = req.query;
                let limit = l ? l : 10;
                let sort = 'createdAt';
                let direction = 'desc';
                if (s == 'a-z') {
                    sort = 'name';
                    direction = 'asc';
                }
                if (s == 'low-to-high') {
                    sort = 'price';
                    direction = 'asc';
                }
                if (s == 'high-to-low') {
                    sort = 'price';
                    direction = 'desc';
                }
                const products = yield prisma_1.default.product.findMany({
                    where: {
                        name: q
                            ? { contains: String(q) }
                            : { not: undefined },
                        category: {
                            slug: c
                                ? String(c)
                                : { not: undefined },
                            type: t
                                ? String(t).toUpperCase()
                                : { not: undefined },
                            gender: g
                                ? String(g).toUpperCase()
                                : { not: undefined }
                        },
                        isActive: true,
                    },
                    include: {
                        images: true,
                        variants: {
                            include: {
                                warehouseProduct: {
                                    select: {
                                        stock: true,
                                    },
                                    where: {
                                        isDelete: false
                                    }
                                }
                            },
                            where: {
                                isDeleted: false
                            }
                        },
                        category: true
                    },
                    orderBy: {
                        [sort]: direction
                    }
                });
                const productsWithStock = products.map(product => (Object.assign(Object.assign({}, product), { variants: product.variants.map(variant => (Object.assign(Object.assign({}, variant), { totalStock: variant.warehouseProduct.reduce((total, wp) => total + wp.stock, 0) }))) })));
                const productWithAndWithoutStock = productsWithStock.map(product => (Object.assign(Object.assign({}, product), { totalStock: product.variants.reduce((total, variant) => total + variant.totalStock, 0) })));
                const productsWithStockOnly = productWithAndWithoutStock.filter(product => product.totalStock > 0);
                const productsWithoutStockOnly = productWithAndWithoutStock.filter(product => product.totalStock === 0);
                const combinedProductList = [...productsWithStockOnly, ...productsWithoutStockOnly];
                const paginatedProductList = combinedProductList.slice((+p - 1) * +limit, +p * +limit);
                const totalProduct = yield prisma_1.default.product.count({
                    where: {
                        name: q
                            ? { contains: String(q) }
                            : { not: undefined },
                        category: {
                            slug: c
                                ? String(c)
                                : { not: undefined },
                            type: t
                                ? String(t).toUpperCase()
                                : { not: undefined },
                            gender: g
                                ? String(g).toUpperCase()
                                : { not: undefined }
                        },
                        isActive: true,
                    },
                });
                return res.status(200).send({
                    status: 'ok',
                    message: 'product found',
                    productList: paginatedProductList,
                    totalProduct,
                });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.ProductController = ProductController;
