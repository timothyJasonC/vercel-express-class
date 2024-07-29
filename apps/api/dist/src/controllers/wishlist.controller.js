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
exports.WishlistController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const apiResponse_1 = require("@/helpers/apiResponse");
class WishlistController {
    createWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { id: req.body.userId } });
                const product = yield prisma_1.default.product.findFirst({ where: { id: req.body.productId } });
                if (!product)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Product not found');
                if (!user)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'User not found');
                const existingWishlist = yield prisma_1.default.wishList.findFirst({ where: { userId: user.id, productId: product.id } });
                if (existingWishlist) {
                    yield prisma_1.default.wishList.delete({ where: { id: existingWishlist.id } });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${product === null || product === void 0 ? void 0 : product.name} has been removed from your wishlist!`);
                }
                const newWistlist = yield prisma_1.default.wishList.create({ data: { productId: product.id, userId: user.id } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${product === null || product === void 0 ? void 0 : product.name} has been added to your wishlist!`, newWistlist);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId } = req.body;
                const wishlist = yield prisma_1.default.wishList.findFirst({ where: {
                        userId, productId
                    } });
                if (!wishlist)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'item on wishlist not found');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `wishlist found!`, wishlist);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getTotalLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const likes = yield prisma_1.default.wishList.findMany({ where: { productId: productId } });
                if (!likes)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'wishlist total likes not found');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `wishlists found!`, likes);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWishlistById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const wishlist = yield prisma_1.default.wishList.findMany({ where: { userId } });
                if (!wishlist)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'wishlist is empty');
                let items = [];
                for (const wish of wishlist) {
                    const item = yield prisma_1.default.product.findFirst({ where: { id: wish.productId } });
                    if (item)
                        items.push(item);
                }
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `wishlists found!`, items);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.WishlistController = WishlistController;
