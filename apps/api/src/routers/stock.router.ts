import { StockController } from '../controllers/stock.controller';
import {Router} from 'express'

export class StockRouter {
    private router: Router
    private stockController: StockController

    constructor() {
        this.stockController = new StockController()
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', this.stockController.createStock)
        this.router.get('/:variant', this.stockController.getStockByVariant)
        this.router.post('/all', this.stockController.getAllStock)
        this.router.post('/:slug', this.stockController.getStockSlug)
    }

    getRouter() : Router{
        return this.router
    }
}