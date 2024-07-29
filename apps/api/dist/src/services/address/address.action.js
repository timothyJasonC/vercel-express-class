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
exports.createAddress = createAddress;
exports.editAddress = editAddress;
exports.getAddressById = getAddressById;
exports.getUserAddressList = getUserAddressList;
exports.getAddressUserById = getAddressUserById;
exports.getAddressCoordinates = getAddressCoordinates;
exports.getAllWarehouseAddress = getAllWarehouseAddress;
exports.getWarehouseById = getWarehouseById;
exports.findClosestWarehouse = findClosestWarehouse;
exports.getWarehouseByName = getWarehouseByName;
exports.getShippingCost = getShippingCost;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
function createAddress(city, address, userId, labelAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const newAddress = yield prisma.addressList.create({
            data: {
                id: (0, uuid_1.v4)(),
                address: address,
                labelAddress: labelAddress,
                city_id: city.city_id,
                province_id: city.province_id,
                province: city.province,
                type: city.type,
                city_name: city.city_name,
                postal_code: city.postal_code,
                coordinate: `${address}, ${city.type} ${city.city_name}, ${city.province}, Indonesia`,
                mainAddress: false,
                userID: userId
            }
        });
        return newAddress;
    });
}
function editAddress(id, city, address, labelAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedAddress = yield prisma.addressList.update({
            where: { id: id },
            data: {
                address: address,
                labelAddress: labelAddress,
                city_id: city.city_id,
                province_id: city.province_id,
                province: city.province,
                type: city.type,
                city_name: city.city_name,
                postal_code: city.postal_code,
                coordinate: `${address}, ${city.city_name}, ${city.province}, Indonesia`,
            }
        });
        return updatedAddress;
    });
}
function getAddressById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield prisma.addressList.findUnique({
            where: { id },
            select: { coordinate: true }
        });
        return address;
    });
}
function getUserAddressList(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const addressList = yield prisma.addressList.findMany({
            where: {
                userID: userId
            },
            select: {
                id: true,
                coordinate: true,
                mainAddress: true,
                labelAddress: true,
                province: true,
                type: true,
                city_name: true,
                postal_code: true,
            }
        });
        return addressList;
    });
}
function getAddressUserById(addressId) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield prisma.addressList.findUnique({
            where: { id: addressId }
        });
        return address;
    });
}
function getAddressCoordinates(addresLoc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const encodedAddress = encodeURIComponent(addresLoc).replace(/%20/g, '+');
            const apiKey = 'PsYxZBSXcseSSIr6soAI';
            const response = yield fetch(`https://api.maptiler.com/geocoding/${encodedAddress}.json?key=${apiKey}`);
            const data = yield response.json();
            if (data.features.length > 0) {
                const location = data.features[0].geometry.coordinates;
                return {
                    lat: location[1],
                    lon: location[0],
                    display_name: data.features[0].place_name
                };
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching address coordinates:', error);
            throw new Error('Error fetching address coordinates');
        }
    });
}
function getAllWarehouseAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        const warehouseAddress = {};
        try {
            const warehouses = yield prisma.warehouse.findMany({
                where: {
                    isActive: true
                }
            });
            for (const warehouse of warehouses) {
                const coordinates = yield getAddressCoordinates(`${warehouse.address}, ${warehouse.city_name}, ${warehouse.province}`);
                warehouseAddress[warehouse.warehouseName] = coordinates;
            }
            return warehouseAddress;
        }
        catch (error) {
            throw new Error('Error fetching address coordinates');
        }
    });
}
function getWarehouseById(warehouseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const warehouse = yield prisma.warehouse.findUnique({
            where: { id: warehouseId }
        });
        return warehouse;
    });
}
function haversineDistance(lat1, lon1, lat2, lon2) {
    return __awaiter(this, void 0, void 0, function* () {
        const R = 6371;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.pow(Math.sin(dLon / 2), 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    });
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function findClosestWarehouse(userLocation, warehouses) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userLocation || !warehouses)
            return null;
        const { lat: userLat, lon: userLon } = userLocation;
        const distances = [];
        for (const warehouseKey in warehouses) {
            const warehouse = warehouses[warehouseKey];
            if (!warehouse)
                continue;
            const { lat, lon } = warehouse;
            const distance = yield haversineDistance(Number(userLat), Number(userLon), Number(lat), Number(lon));
            distances.push({ warehouseKey, warehouse, distance });
        }
        distances.sort((a, b) => a.distance - b.distance);
        return distances.map(item => ({
            warehouseKey: item.warehouseKey,
            warehouse: item.warehouse,
            distance: item.distance
        }));
    });
}
function getWarehouseByName(warehouseName) {
    return __awaiter(this, void 0, void 0, function* () {
        const warehouse = yield prisma.warehouse.findFirst({
            where: { warehouseName: warehouseName }
        });
        return warehouse;
    });
}
function getShippingCost(warehouseId, userAddress, shipping) {
    return __awaiter(this, void 0, void 0, function* () {
        const warehouse = yield prisma.warehouse.findUnique({
            where: { id: warehouseId }
        });
        const address = yield prisma.addressList.findFirst({
            where: { id: userAddress }
        });
        const formBody = new URLSearchParams();
        formBody.append('origin', `${warehouse === null || warehouse === void 0 ? void 0 : warehouse.city_id}`);
        formBody.append('destination', `${address === null || address === void 0 ? void 0 : address.city_id}`);
        formBody.append('weight', '1700');
        formBody.append('courier', `${shipping}`);
        const cost = yield fetch('https://api.rajaongkir.com/starter/cost', {
            method: 'POST',
            headers: {
                'key': `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.toString()
        });
        return cost.json();
    });
}
