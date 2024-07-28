import { Router } from 'express'
import { TestRouter } from './test.router';


export class ApiRouter {
    private router: Router
    private testRouter: TestRouter

    constructor() {
        this.router = Router()
        this.testRouter = new TestRouter()
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use('/test', this.testRouter.getRouter())
    }

    getRouter(): Router {
        return this.router
    }
}

