import { AccountController } from '../controllers/account.controller';
import { Router } from 'express'

export class AccountRouter {
    private router: Router
    private accountController: AccountController

    constructor() {
        this.accountController = new AccountController()
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/login', this.accountController.loginAccount)
        this.router.post('/refresh-token', this.accountController.refreshToken)
        this.router.post('/request-forgot-pass', this.accountController.checkEmail, this.accountController.checkTokenExp, this.accountController.reRequestToken, this.accountController.requestForgotPassword)
        this.router.post('/request-reset-pass', this.accountController.checkEmail, this.accountController.checkTokenExp, this.accountController.reRequestToken, this.accountController.requestResetPassword)
        this.router.post('/check-password', this.accountController.checkCurrentPassword)
        this.router.patch('/update-pass', this.accountController.resetPassword)
    }

    getRouter() : Router{
        return this.router
    }
}