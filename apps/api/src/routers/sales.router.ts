import { SalesController } from '../controllers/sales.controller';
import {Router} from 'express'

export class SalesRouter {
    private router: Router
    private salesController: SalesController

    constructor() {
        this.salesController = new SalesController()
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', this.salesController.getAllSales)
        this.router.post('/:slug', this.salesController.getSalesSlug)
    }

    getRouter() : Router{
        return this.router
    }
}