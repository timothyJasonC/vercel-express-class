import { MutationController } from '../controllers/mutation.controller'
import { Router } from 'express'

export class MutationRouter {
    private router: Router
    private mutationController: MutationController

    constructor() {
        this.mutationController = new MutationController()
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', this.mutationController.createMutationRequest);
        this.router.get('/:wh', this.mutationController.getMutation);
        this.router.get('/requests/:wh', this.mutationController.getMutationRequest);
        this.router.patch('/accept-requests/:id', this.mutationController.acceptMutation);
        this.router.patch('/reject-requests/:id', this.mutationController.rejectMutation);
        this.router.delete('/cancel-requests/:id', this.mutationController.cancelMutation);
    }

    getRouter() : Router{
        return this.router
    }
}