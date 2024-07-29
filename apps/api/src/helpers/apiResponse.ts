import { Response } from "express"

export function serverResponse(
    res: Response, statusCode: number, 
    status: string, msg?: string, data?: any
    ) {
    res.status(statusCode).send({
        status: status,
        message: msg,
        data
    })
}