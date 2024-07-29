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
exports.AddressController = void 0;
const apiResponse_1 = require("@/helpers/apiResponse");
const prisma_1 = __importDefault(require("@/prisma"));
const address_action_1 = require("@/services/address/address.action");
class AddressController {
    getProvinces(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield fetch('https://api.rajaongkir.com/starter/province', {
                    method: 'GET',
                    headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
                });
                const data = yield result.json();
                res.json(data);
            }
            catch (error) {
                res.json(error);
            }
        });
    }
    getCitites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { provinceId } = req.body;
                const result = yield fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, {
                    method: 'GET',
                    headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
                });
                const data = yield result.json();
                res.json(data);
            }
            catch (error) {
                res.json(error);
            }
        });
    }
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { selectedCity, address, userId, labelAddress } = req.body;
                const city = yield fetch(`https://api.rajaongkir.com/starter/city?id=${selectedCity}`, {
                    method: 'GET',
                    headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
                });
                const data = yield city.json();
                const result = data.rajaongkir.results;
                const addressUser = yield (0, address_action_1.createAddress)(result, address, userId, labelAddress);
                res.json({ message: 'add address successfull', addressUser });
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    getAddressList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const addressList = yield (0, address_action_1.getUserAddressList)(userId);
                const sortedAddressList = addressList.sort((a, b) => {
                    if (a.mainAddress && !b.mainAddress) {
                        return -1;
                    }
                    if (!a.mainAddress && b.mainAddress) {
                        return 1;
                    }
                    return 0;
                });
                res.json(sortedAddressList);
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    getClossestWarehouse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address } = req.body;
                const addressUser = yield (0, address_action_1.getAddressUserById)(address);
                const addressCoordinates = yield (0, address_action_1.getAddressCoordinates)(`${addressUser === null || addressUser === void 0 ? void 0 : addressUser.address}, ${addressUser === null || addressUser === void 0 ? void 0 : addressUser.city_name}, ${addressUser === null || addressUser === void 0 ? void 0 : addressUser.province} `);
                const allWarehouseAddress = yield (0, address_action_1.getAllWarehouseAddress)();
                const closestWarehouse = yield (0, address_action_1.findClosestWarehouse)(addressCoordinates, allWarehouseAddress);
                if (closestWarehouse) {
                    const warehouse = yield (0, address_action_1.getWarehouseByName)(closestWarehouse[0].warehouseKey);
                    res.json(warehouse);
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    getShippingCost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { warehouseId, userAddress, shipping } = req.body;
                const data = yield (0, address_action_1.getShippingCost)(warehouseId, userAddress, shipping);
                res.json(data.rajaongkir.results);
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    updateMainAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield prisma_1.default.addressList.findFirst({ where: { id: req.body.id } });
                if (!address)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'address not found!');
                yield prisma_1.default.addressList.updateMany({ where: { userID: req.body.userId }, data: { mainAddress: false } });
                yield prisma_1.default.addressList.update({ where: { id: address.id }, data: { mainAddress: true } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${address.labelAddress} has been set to main!`);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    deleteAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield prisma_1.default.addressList.findFirst({ where: { id: req.params.id } });
                if (!address)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'address not found!');
                yield prisma_1.default.addressList.delete({ where: { id: req.params.id } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `${address.labelAddress} has been deleted!`);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getAddressById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield prisma_1.default.addressList.findFirst({ where: { id: req.params.id } });
                if (!address)
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'Address not found!');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `Address found!`, address);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    editAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, selectedCity, address, labelAddress } = req.body;
                const city = yield fetch(`https://api.rajaongkir.com/starter/city?id=${selectedCity}`, {
                    method: 'GET',
                    headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
                });
                const data = yield city.json();
                const result = data.rajaongkir.results;
                const addressUser = yield (0, address_action_1.editAddress)(id, result, address, labelAddress);
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', `Address has been updated!`, addressUser);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.AddressController = AddressController;
