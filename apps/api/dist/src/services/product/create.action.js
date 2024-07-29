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
exports.createProduct = createProduct;
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const apiResponse_1 = require("@/helpers/apiResponse");
const prisma = new client_1.PrismaClient();
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, categoryData, oneSize, colorVariant, thumbnailURL, additionalURL } = req.body;
            const sizeArray = ['S', 'M', 'L', 'XL'];
            const symbolRegex = /[^a-zA-Z0-9\s-]/;
            if (name.length > 30 || name.length < 2 || name.trim().length === 0 || symbolRegex.test(name))
                throw "Invalid name input.";
            if (description.length > 500 || description.length < 15 || description.trim().length === 0)
                throw "Invalid description input.";
            if (isNaN(price) || price < 1000)
                throw "Invalid price input.";
            if (!categoryData)
                throw "Invalid category input.";
            if (!colorVariant)
                throw "Invalid color variant input.";
            if (!thumbnailURL)
                throw "Invalid thumbnail input.";
            const wareHouseList = yield tx.warehouse.findMany();
            if (!wareHouseList)
                throw "No warehouse found, please create warehouse.";
            const validateName = yield tx.product.findFirst({ where: { name } });
            if (validateName)
                throw "product name already exists";
            const productCategory = yield tx.productCategory.findFirst({
                where: {
                    gender: categoryData.gender.toUpperCase(),
                    type: categoryData.type.toUpperCase(),
                    category: categoryData.category
                }
            });
            const newProduct = yield tx.product.create({
                data: { id: (0, uuid_1.v4)(), name, slug: name.toLowerCase().replaceAll(" ", "-"), description, price, categoryID: productCategory.id, oneSize: oneSize, thumbnailURL }
            });
            for (let i = 0; i < additionalURL.length; i++) {
                yield tx.productImage.create({ data: { id: (0, uuid_1.v4)(), productID: newProduct.id, image: additionalURL[i] } });
            }
            for (let i = 0; i < colorVariant.length; i++) {
                const variant = yield tx.productVariant.create({
                    data: { id: (0, uuid_1.v4)(), productID: newProduct.id, color: colorVariant[i].name,
                        HEX: colorVariant[i].code, image: colorVariant[i].variantImageURL }
                });
                for (let w = 0; w < wareHouseList.length; w++) {
                    if (newProduct.oneSize) {
                        yield tx.warehouseProduct.create({
                            data: {
                                warehouseID: wareHouseList[w].id,
                                productVariantID: variant.id,
                                size: 'ONESIZE',
                                stock: 0
                            }
                        });
                    }
                    else {
                        for (let z = 0; z < sizeArray.length; z++) {
                            yield tx.warehouseProduct.create({
                                data: {
                                    warehouseID: wareHouseList[w].id,
                                    productVariantID: variant.id,
                                    size: sizeArray[z],
                                    stock: 0
                                }
                            });
                        }
                    }
                }
            }
            return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Product successfully created.');
        }));
    });
}
