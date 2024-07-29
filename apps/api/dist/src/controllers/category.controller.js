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
exports.CategoryController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const client_1 = require("@prisma/client"); // Import the enum type
const uuid_1 = require("uuid");
const apiResponse_1 = require("@/helpers/apiResponse");
class CategoryController {
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gender, type } = req.query;
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    if (!gender && !type) {
                        const category = yield tx.productCategory.findMany({
                            orderBy: {
                                category: 'asc'
                            }
                        });
                        const totalCategory = yield tx.productCategory.count();
                        return res.status(200).send({
                            status: 'ok',
                            message: 'Categories found',
                            category,
                            totalCategory
                        });
                    }
                    if (typeof gender === 'string' && !type) {
                        const productGender = gender.toUpperCase();
                        const tops = yield tx.productCategory.findMany({
                            where: {
                                gender: productGender,
                                type: "TOPS"
                            },
                            orderBy: {
                                category: 'asc'
                            }
                        });
                        const bottoms = yield tx.productCategory.findMany({
                            where: {
                                gender: productGender,
                                type: "BOTTOMS"
                            },
                            orderBy: {
                                category: 'asc'
                            }
                        });
                        const accessories = yield tx.productCategory.findMany({
                            where: {
                                gender: productGender,
                                type: "ACCESSORIES"
                            },
                            orderBy: {
                                category: 'asc'
                            }
                        });
                        return res.status(200).send({
                            status: 'ok',
                            message: 'Categories found',
                            tops,
                            bottoms,
                            accessories
                        });
                    }
                    if (typeof gender === 'string' && typeof type === 'string') {
                        const productGender = gender.toUpperCase();
                        const productTypes = type.toUpperCase();
                        const category = yield tx.productCategory.findMany({
                            where: {
                                gender: productGender,
                                type: productTypes,
                            },
                            orderBy: {
                                category: 'asc'
                            }
                        });
                        return res.status(200).send({
                            status: 'ok',
                            message: 'Categories found',
                            category
                        });
                    }
                }));
            }
            catch (error) {
                res.status(400).send({
                    status: 'error',
                    message: error,
                });
            }
        });
    }
    getCategorySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gender, type } = req.query;
                const { slug } = req.params;
                if (!gender || !type || !slug)
                    throw "Incomplete query.";
                const category = yield prisma_1.default.productCategory.findFirst({
                    where: {
                        gender: String(gender).toUpperCase(),
                        type: String(type).toUpperCase(),
                        slug: String(slug)
                    }
                });
                if (!category)
                    throw 'Product not found.';
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Category found.', category);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, gender, category } = req.body;
                const existingCategory = yield prisma_1.default.productCategory.findMany({
                    where: {
                        gender,
                    }
                });
                const checkDuplicate = existingCategory.find((cat) => cat.category.toLowerCase() === category.toLowerCase());
                if (checkDuplicate)
                    throw "Category already exists.";
                yield prisma_1.default.productCategory.create({
                    data: Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, req.body), { slug: category.toLowerCase().replace(" ", "-") })
                });
                res.status(200).send({
                    status: 'ok',
                    message: 'Category created.'
                });
            }
            catch (error) {
                res.status(400).send({
                    status: 'error',
                    message: error,
                });
            }
        });
    }
    editCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, gender, category, newCategory } = req.body;
                const currentCategory = yield prisma_1.default.productCategory.findFirst({
                    where: {
                        gender,
                        type,
                        category
                    }
                });
                const existingCategory = yield prisma_1.default.productCategory.findMany({
                    where: {
                        gender,
                    }
                });
                const checkDuplicate = existingCategory.find((cat) => cat.category.toLowerCase() === newCategory.toLowerCase() && cat.id !== (currentCategory === null || currentCategory === void 0 ? void 0 : currentCategory.id));
                if (checkDuplicate)
                    throw "Category already exists.";
                const toEditCategory = yield prisma_1.default.productCategory.findFirst({
                    where: {
                        gender,
                        type,
                        category
                    }
                });
                yield prisma_1.default.productCategory.update({
                    where: {
                        id: toEditCategory === null || toEditCategory === void 0 ? void 0 : toEditCategory.id
                    },
                    data: {
                        category: newCategory,
                        slug: newCategory.toLowerCase().replace(' ', '-')
                    }
                });
                res.status(200).send({
                    status: 'ok',
                    message: 'Category edited.'
                });
            }
            catch (error) {
                res.status(400).send({
                    status: 'error',
                    message: error,
                });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const containsProducts = yield prisma_1.default.product.findFirst({
                    where: {
                        categoryID: id
                    }
                });
                if (containsProducts)
                    throw "Cannot delete category that is being used.";
                yield prisma_1.default.productCategory.delete({
                    where: {
                        id
                    }
                });
                res.status(200).send({
                    status: 'ok',
                    message: 'Category deleted.'
                });
            }
            catch (error) {
                res.status(400).send({
                    status: 'error',
                    message: error,
                });
            }
        });
    }
    getMenCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menCategories = yield prisma_1.default.productCategory.findMany({ where: { gender: client_1.ProductGender.MEN } });
                if (!menCategories)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Men Categories have not been created');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Men categories found!', menCategories);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWomenCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const womenCategories = yield prisma_1.default.productCategory.findMany({ where: { gender: client_1.ProductGender.WOMEN } });
                if (!womenCategories)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Women Categories have not been created');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Women categories found!', womenCategories);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.CategoryController = CategoryController;
