import { Request, Response } from 'express';

export class TestController {
    async Test(req: Request, res: Response) {
        try {
            res.send('ok')
        } catch (error: any) {
            res.send('error')
        }
    }
}
