"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationRouter = void 0;
const mutation_controller_1 = require("@/controllers/mutation.controller");
const express_1 = require("express");
class MutationRouter {
    constructor() {
        this.mutationController = new mutation_controller_1.MutationController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.mutationController.createMutationRequest);
        this.router.get('/:wh', this.mutationController.getMutation);
        this.router.get('/requests/:wh', this.mutationController.getMutationRequest);
        this.router.patch('/accept-requests/:id', this.mutationController.acceptMutation);
        this.router.patch('/reject-requests/:id', this.mutationController.rejectMutation);
        this.router.delete('/cancel-requests/:id', this.mutationController.cancelMutation);
    }
    getRouter() {
        return this.router;
    }
}
exports.MutationRouter = MutationRouter;
