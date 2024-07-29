"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRouter = void 0;
const warehouse_controller_1 = require("@/controllers/warehouse.controller");
const express_1 = require("express");
class WarehouseRouter {
    constructor() {
        this.warehouseController = new warehouse_controller_1.WarehouseController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/available-warehouses', this.warehouseController.getAvailableWarehouse);
        this.router.get('/get-warehouse-by-id/:id', this.warehouseController.getWarehouseById);
        this.router.get('/assigned-warehouse/:id', this.warehouseController.getWarehouseByAdminId);
        this.router.get('/all', this.warehouseController.getWarehouses);
        this.router.get('/filter/:filter', this.warehouseController.getWarehouseFiltered);
        this.router.get('/', this.warehouseController.getWarehouseList);
        this.router.get('/:id', this.warehouseController.getWarehouseList);
        this.router.post('/', this.warehouseController.createWarehouse);
        this.router.post('/', this.warehouseController.createWarehouse);
        this.router.patch('/assign-admin-to-warehouse', this.warehouseController.assignAdminToWarehouse);
        this.router.patch('/dismiss-admin-from-warehouse', this.warehouseController.dissmissAdminFromWarehouse);
        this.router.patch('/reactivate-warehouse/:id', this.warehouseController.reactivateWarehouse);
        this.router.patch('/:id', this.warehouseController.editWarehouse);
        this.router.delete('/deactivate-warehouse/:id', this.warehouseController.deactivateWarehouse);
    }
    getRouter() {
        return this.router;
    }
}
exports.WarehouseRouter = WarehouseRouter;
