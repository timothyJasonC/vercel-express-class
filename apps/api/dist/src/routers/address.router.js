"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRouter = void 0;
const address_controller_1 = require("@/controllers/address.controller");
const express_1 = require("express");
class AddressRouter {
    constructor() {
        this.addressController = new address_controller_1.AddressController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.addressController.addAddress);
        this.router.post('/addressList', this.addressController.getAddressList);
        this.router.get('/getProvinces', this.addressController.getProvinces);
        this.router.get('/:id', this.addressController.getAddressById);
        this.router.post('/getCities', this.addressController.getCitites);
        this.router.post('/getClossestWarehouse', this.addressController.getClossestWarehouse);
        this.router.post('/getShippingCost', this.addressController.getShippingCost);
        this.router.patch('/setMainAddress', this.addressController.updateMainAddress);
        this.router.patch('/editAddress', this.addressController.editAddress);
        this.router.delete('/delete/:id', this.addressController.deleteAddress);
    }
    getRouter() {
        return this.router;
    }
}
exports.AddressRouter = AddressRouter;
