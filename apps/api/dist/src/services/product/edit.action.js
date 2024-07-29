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
exports.editProduct = editProduct;
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function editProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { slug } = req.params;
        const { name, isVisible, description, price, thumbnailURL, additionalURL, additionalDelete, colorVariantEdit, colorVariantNew, colorVariantDelete, categoryData } = req.body;
        const symbolRegex = /[^a-zA-Z0-9\s-]/;
        if (name.length > 30 || name.length < 2 || name.trim().length === 0 || symbolRegex.test(name))
            throw "Invalid name input.";
        if (description.length > 500 || description.length < 15 || description.trim().length === 0)
            throw "Invalid description input.";
        if (isNaN(price) || price < 1000)
            throw "Invalid price input.";
        if (!categoryData)
            throw "Invalid category input.";
        const sizeArray = ['S', 'M', 'L', 'XL'];
        const wareHouseList = yield prisma.warehouse.findMany();
        const productCategory = yield prisma.productCategory.findFirst({
            where: {
                gender: categoryData.gender.toUpperCase(),
                type: categoryData.type.toUpperCase(),
                category: categoryData.category
            }
        });
        yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const product = yield tx.product.update({
                data: {
                    name,
                    description,
                    price,
                    isActive: isVisible,
                    slug: name.toLowerCase().replaceAll(" ", "-"),
                    categoryID: productCategory.id,
                    updatedAt: new Date()
                },
                where: {
                    slug
                }
            });
            if (thumbnailURL) {
                yield tx.product.update({
                    data: {
                        thumbnailURL
                    },
                    where: {
                        slug
                    }
                });
            }
            if (additionalURL.length > 0) {
                for (let i = 0; i < additionalURL.length; i++) {
                    yield tx.productImage.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            image: additionalURL[i],
                            productID: product.id
                        }
                    });
                }
            }
            if (additionalDelete.length > 0) {
                for (let i = 0; i < additionalDelete.length; i++) {
                    yield tx.productImage.delete({
                        where: {
                            id: additionalDelete[i]
                        }
                    });
                }
            }
            if (colorVariantEdit.length > 0) {
                for (let i = 0; i < colorVariantEdit.length; i++) {
                    yield tx.productVariant.update({
                        where: {
                            id: colorVariantEdit[i].id
                        },
                        data: {
                            color: colorVariantEdit[i].name,
                            HEX: colorVariantEdit[i].code,
                            image: colorVariantEdit[i].variantImageURL
                        }
                    });
                }
            }
            if (colorVariantNew.length > 0) {
                for (let i = 0; i < colorVariantNew.length; i++) {
                    const variant = yield tx.productVariant.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            productID: product.id,
                            color: colorVariantNew[i].name,
                            HEX: colorVariantNew[i].code,
                            image: colorVariantNew[i].variantImageURL
                        }
                    });
                    for (let k = 0; k < wareHouseList.length; k++) {
                        if (product.oneSize) {
                            yield tx.warehouseProduct.create({
                                data: {
                                    id: (0, uuid_1.v4)(),
                                    warehouseID: wareHouseList[k].id,
                                    productVariantID: variant.id,
                                    size: 'ONESIZE',
                                    stock: 0
                                }
                            });
                        }
                        else {
                            for (let s = 0; s < sizeArray.length; s++) {
                                yield tx.warehouseProduct.create({
                                    data: {
                                        id: (0, uuid_1.v4)(),
                                        warehouseID: wareHouseList[k].id,
                                        productVariantID: variant.id,
                                        size: sizeArray[s],
                                        stock: 0
                                    }
                                });
                            }
                        }
                    }
                }
            }
            if (colorVariantDelete.length > 0) {
                for (let i = 0; i < colorVariantDelete.length; i++) {
                    for (let k = 0; k < wareHouseList.length; k++) {
                        const currentStock = yield tx.warehouseProduct.findMany({
                            where: {
                                warehouseID: wareHouseList[k].id,
                                productVariantID: colorVariantDelete[i]
                            }
                        });
                        if (currentStock.length > 0) {
                            const stockLog = yield tx.stockMutation.create({
                                data: {
                                    id: (0, uuid_1.v4)(),
                                    warehouseID: wareHouseList[k].id,
                                    type: 'DELETE',
                                }
                            });
                            for (let c = 0; c < currentStock.length; c++) {
                                yield tx.stockMutationItem.create({
                                    data: {
                                        id: (0, uuid_1.v4)(),
                                        quantity: currentStock[c].stock,
                                        stockMutationID: stockLog.id,
                                        warehouseProductID: currentStock[c].id
                                    }
                                });
                                yield tx.warehouseProduct.updateMany({
                                    where: {
                                        productVariantID: colorVariantDelete[i],
                                        warehouseID: wareHouseList[k].id
                                    },
                                    data: {
                                        isDelete: true,
                                        stock: 0
                                    }
                                });
                            }
                        }
                        yield tx.productVariant.update({
                            where: {
                                id: colorVariantDelete[i]
                            },
                            data: {
                                isDeleted: true
                            }
                        });
                    }
                }
            }
            return res.status(200).send({
                status: 'ok',
                message: 'product updated'
            });
        }));
    });
}
