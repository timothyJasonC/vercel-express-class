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
const client_1 = require("@prisma/client");
const users_1 = require("./models/users");
const admin_1 = require("./models/admin");
const warehouse_1 = require("./models/warehouse");
const product_1 = require("./models/product");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, users_1.listUsers)();
            yield prisma.user.createMany({
                data: users,
                skipDuplicates: true
            });
            const admins = yield (0, admin_1.listAdmin)();
            yield prisma.admin.createMany({
                data: admins,
                skipDuplicates: true
            });
            const warehouses = yield (0, warehouse_1.listWarehouse)();
            yield prisma.warehouse.createMany({
                data: warehouses,
                skipDuplicates: true
            });
            const productCategories = yield (0, product_1.listProductCategory)();
            yield prisma.productCategory.createMany({
                data: productCategories,
                skipDuplicates: true
            });
            const products = yield (0, product_1.listProduct)();
            yield prisma.product.createMany({
                data: products,
                skipDuplicates: true
            });
            const productVariants = yield (0, product_1.listProductVariant)();
            yield prisma.productVariant.createMany({
                data: productVariants,
                skipDuplicates: true
            });
            const productImages = yield (0, product_1.listProductImage)();
            yield prisma.productImage.createMany({
                data: productImages,
                skipDuplicates: true
            });
            console.log('Data successfully seeded.');
        }
        catch (error) {
            console.error('Error seeding data:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main()
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
