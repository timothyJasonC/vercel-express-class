import { CategoryController } from '../controllers/category.controller';
import {Router} from 'express'

export class CategoryRouter {
    private router: Router
    private categoryController: CategoryController

    constructor() {
        this.categoryController = new CategoryController()
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.categoryController.getCategory)
        this.router.get('/men-cat', this.categoryController.getMenCategory)
        this.router.get('/women-cat', this.categoryController.getWomenCategory)
        this.router.get('/:slug', this.categoryController.getCategorySlug)
        this.router.post('/', this.categoryController.createCategory)
        this.router.patch('/', this.categoryController.editCategory)
        this.router.delete('/:id', this.categoryController.deleteCategory)
    }

    getRouter() : Router{
        return this.router
    }
}