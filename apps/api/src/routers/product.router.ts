import { ProductController } from '../controllers/product.controller';
import {Router} from 'express'

export class ProductRouter {
    private router: Router
    private productController: ProductController

    constructor() {
        this.productController = new ProductController()
        this.router = Router();
        this.initializeRoutes();
    } 

    private initializeRoutes(): void {
        this.router.post('/lists', this.productController.getProduct)
        this.router.post('/', this.productController.createProduct)
        this.router.get('/names', this.productController.getProductName)
        this.router.get('/catalogs', this.productController.getCatalogs)
        this.router.get('/:slug', this.productController.getProductBySlug)
        this.router.patch('/:slug', this.productController.editProduct)
        this.router.delete('/:slug', this.productController.deleteProduct)
    }

    getRouter() : Router{
        return this.router
    }
}