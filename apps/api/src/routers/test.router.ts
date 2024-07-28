import { Router } from 'express'
import { TestController } from '../controllers/test.controller';

export class TestRouter {
    private router: Router
    private TestController: TestController

    constructor() {
        this.TestController = new TestController()
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.TestController.Test)
    }

    getRouter(): Router {
        return this.router
    }
}