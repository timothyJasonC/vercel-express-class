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
exports.WarehouseController = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const apiResponse_1 = require("@/helpers/apiResponse");
const stock_action_1 = require("@/services/stock/stock.action");
class WarehouseController {
    getWarehouseList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const adminRole = yield prisma_1.default.admin.findFirst({
                    where: {
                        id
                    }
                });
                let wareHouseList;
                if ((adminRole === null || adminRole === void 0 ? void 0 : adminRole.role) == 'superAdm') {
                    wareHouseList = yield prisma_1.default.warehouse.findMany();
                }
                else if ((adminRole === null || adminRole === void 0 ? void 0 : adminRole.role) == 'warAdm') {
                    wareHouseList = yield prisma_1.default.warehouse.findMany({
                        where: {
                            adminID: id
                        }
                    });
                }
                res.status(200).json(wareHouseList);
            }
            catch (err) {
                res.status(500).json({ error: 'Failed to get warehouse list' });
            }
        });
    }
    getAvailableWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouses = yield prisma_1.default.warehouse.findMany({ where: { adminID: null } });
                if (!warehouses)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'All warehouses are already occupied!');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Warehouses found!', warehouses);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    createWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { selectedCity, address, warehouseName, assignedAdmin } = req.body;
                const city = yield fetch(`https://api.rajaongkir.com/starter/city?id=${selectedCity}`, {
                    method: 'GET',
                    headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
                });
                const data = yield city.json();
                const result = data.rajaongkir.results;
                const newWarehouse = yield prisma_1.default.warehouse.create({
                    data: {
                        warehouseName: warehouseName,
                        coordinate: `${address}, ${result.type} ${result.city_name}, ${result.province}, Indonesia`,
                        address: address,
                        city_id: result.city_id,
                        province_id: result.province_id,
                        province: result.province,
                        type: result.type,
                        city_name: result.city_name,
                        postal_code: result.postal_code,
                        adminID: assignedAdmin ? assignedAdmin : null,
                    }
                });
                (0, stock_action_1.handleNewWarehouseStock)(newWarehouse.id);
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Warehouse successfully created!');
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWarehouseByAdminId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({ where: { adminID: req.params.id } });
                if (!warehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Admin has not been assigned to any warehouse');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Assigned warehouse found!', warehouse);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWarehouseFiltered(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter } = req.params;
                const warehouseList = yield prisma_1.default.warehouse.findMany({
                    where: {
                        warehouseName: { not: filter }
                    }
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'warehouse found', warehouseList);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWarehouses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouses = yield prisma_1.default.warehouse.findMany();
                if (!warehouses)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Warehouse not found');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Warehouses found!', warehouses);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    assignAdminToWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({ where: { id: req.body.warehouseId } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.body.adminId } });
                if (!warehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Warehouse not found');
                if (!admin)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Admin not found');
                const assignedWarehouse = yield prisma_1.default.warehouse.findFirst({ where: { adminID: admin.id } });
                if ((assignedWarehouse === null || assignedWarehouse === void 0 ? void 0 : assignedWarehouse.warehouseName) == warehouse.warehouseName)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', `${admin.fullName} has been assigned to ${assignedWarehouse.warehouseName} warehouse.`);
                if (assignedWarehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', `${admin.fullName} has been assigned to ${assignedWarehouse.warehouseName} warehouse. One warehouse can only be assigned to one admin.`);
                yield prisma_1.default.warehouse.update({ where: { id: warehouse.id }, data: { adminID: admin.id } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${admin.fullName} is successfully assigned to ${warehouse.warehouseName} warehouse`, warehouse);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    dissmissAdminFromWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({ where: { id: req.body.warehouseId } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.body.adminId } });
                if (!warehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Warehouse not found');
                if (!admin)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Admin not found');
                if (!warehouse.adminID)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', `No admin is assigned at ${warehouse.warehouseName} warehouse, yet`);
                if (warehouse.adminID != admin.id)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Admin ID does not match with the assigned admin with related warehouse');
                yield prisma_1.default.warehouse.update({ where: { id: warehouse.id }, data: { adminID: null } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${admin.fullName} is successfully dismissed from ${warehouse.warehouseName} warehouse`);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    deactivateWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({ where: { id: req.params.id } });
                if (!warehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Warehouse not found');
                if (!warehouse.isActive)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'Warehouse is already deactivated');
                if (warehouse.adminID)
                    yield prisma_1.default.warehouse.update({ where: { id: warehouse.id }, data: { adminID: null } });
                (0, stock_action_1.handleWarehouseDelete)(warehouse.id);
                yield prisma_1.default.warehouse.update({ where: { id: warehouse.id }, data: { isActive: false } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${warehouse === null || warehouse === void 0 ? void 0 : warehouse.warehouseName} warehouse is successfully deactivated`);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    reactivateWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({ where: { id: req.params.id } });
                if (!warehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Warehouse not found');
                if (warehouse.isActive)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', `${warehouse.warehouseName}Warehouse is still active`);
                yield prisma_1.default.warehouse.update({ where: { id: warehouse.id }, data: { isActive: true } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${warehouse.warehouseName} warehouse is successfully reactivated`);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    editWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { selectedCity, address, warehouseName, assignedAdmin } = req.body;
                const city = yield fetch(`https://api.rajaongkir.com/starter/city?id=${selectedCity}`, {
                    method: 'GET',
                    headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
                });
                const data = yield city.json();
                const result = data.rajaongkir.results;
                const warehouse = yield prisma_1.default.warehouse.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        warehouseName: warehouseName,
                        coordinate: `${address}, ${result.type} ${result.city_name}, ${result.province}, Indonesia`,
                        address: address,
                        city_id: result.city_id,
                        province_id: result.province_id,
                        province: result.province,
                        type: result.type,
                        city_name: result.city_name,
                        postal_code: result.postal_code,
                        adminID: assignedAdmin ? assignedAdmin : null,
                    }
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${warehouse.warehouseName} warehouse is successfully updated!`);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getWarehouseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warehouse = yield prisma_1.default.warehouse.findFirst({ where: { id: req.params.id } });
                if (!warehouse)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Warehouse not found');
                if (!warehouse.isActive)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', `${warehouse.warehouseName}Warehouse is not active`);
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${warehouse.warehouseName} warehouse found`, warehouse);
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.WarehouseController = WarehouseController;
