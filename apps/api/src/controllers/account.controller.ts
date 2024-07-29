import { NextFunction, Request, Response } from "express";
import { serverResponse } from "../helpers/apiResponse";
import { compare, genSalt, hash } from "bcrypt";
import { decode, sign } from "jsonwebtoken";
import { v4 as uuid } from 'uuid'
import { transporter } from "../helpers/nodemailer";
import path from 'path'
import fs from 'fs'
import handlebars from "handlebars";
import prisma from "../prisma";

export class AccountController {
    async loginAccount(req: Request, res: Response) {
        try {
        const { email, password } = req.body

        const admin = await prisma.admin.findUnique({ where: { email } })
        const user = await prisma.user.findUnique({ where: { email } })
        
        if (user && user.password) {
            const passwordValid = await compare(password, user.password);
            if (passwordValid == false) return serverResponse(res, 401, 'ok', 'password incorrect!')
            const payload = { id: user.id, role: 'user' }
            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '30m'});
            return serverResponse(res, 200, 'ok', 'login success', { user, token, role: 'user' })
        } else if (admin && admin.password) {
            const passwordValid = await compare(password, admin.password);
            if (passwordValid == false) return serverResponse(res, 401, 'ok', 'password incorrect!')
            const payload = { id: admin.id, role: admin.role }
            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '30m'});
            return serverResponse(res, 200, 'ok', 'login success', { admin, token, role: admin.role })
        } else {
            return serverResponse(res, 404, 'error', 'account not found')
        }

    } catch (error: any) {
        serverResponse(res, 400, 'error', error)
    }
    }

    async verifyUser(req: Request, res: Response) {
        try {
            const { password } = req.body;
            
            const accountID = req.body.account.id
            const user = await prisma.user.findFirst({ where: { id: accountID } })
            if (user) {
                if (user && user.password) {
                    const isMatched = await compare(password, user?.password)
                    if (isMatched) {
                        await prisma.user.update({ where: { id: accountID }, data: { accountActive: true, email: req.body.account.newEmail } })
                    } else {
                        return serverResponse(res, 400, 'error', 'Password incorrect!')
                    }
                }
            }
    
            if (!user) return serverResponse(res, 404, 'error', 'user not found') 

            serverResponse(res, 200, 'ok', 'Account has been verified!')
    
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async verifyAdmin(req: Request, res: Response) {
        try {

            const { password } = req.body;
            
            const accountID = req.body.account.id
            const admin = await prisma.admin.findFirst({ where: { id: accountID } })
            if (admin) {
                if (admin && admin.password) {
                    const isMatched = await compare(password, admin?.password)
                    if (isMatched) {
                        await prisma.admin.update({ where: { id: accountID }, data: { accountActive: true, email: req.body.account.newEmail } })
                    } else {
                        return serverResponse(res, 400, 'error', 'Password incorrect!')
                    }
                }
            }
    
            if (!admin) return serverResponse(res, 404, 'error', 'admin not found') 
            
            serverResponse(res, 200, 'ok', 'Account has been verified!')
    
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { id } = req.body;

            const user = await prisma.user.findFirst({ where: { id: id } })
            const admin = await prisma.admin.findFirst({ where: { id: id } })
            
            if (user) {
                const payload = { id: user.id, role: 'user' }
                const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
                return serverResponse(res, 200, 'ok', 'Token refreshed!', token)
            } 

            if (admin) {
                const payload = { id: admin.id, role: admin.role }
                const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
                return serverResponse(res, 200, 'ok', 'Token refreshed!', token)
            }

            serverResponse(res, 400, 'error', 'Account not found.')
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async checkEmail(req:Request, res: Response, next: NextFunction) {
        try {
            const account = await prisma.user.findFirst({ where: { OR: [ { email: req.body.email }, { id: req.body.id } ] } }) || await prisma.admin.findFirst({ where: { OR: [ { email: req.body.email }, { id: req.body.id } ] } })

            if (account) {
                if (!account?.password) {
                    if (account?.accountActive) {
                        return serverResponse(res, 401, 'error', 'Password reset is unavailable')
                    } else {
                        return serverResponse(res, 404, 'error', 'Password has not been setup, yet. Please verify your account.')
                    }
                }
                req.body.account = account;
                next();
            } else {
                return serverResponse(res, 400, 'error', 'Account not found!')
            }
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async checkTokenExp(req: Request, res: Response, next: NextFunction) {
        try {
            const prevRequest = await prisma.passwordRequest.findUnique({ where: { accountId: req.body.account.id }}) || await prisma.passwordRequest.findUnique({ where: { accountId: req.body.account.id }})
            if (prevRequest) {
                if (prevRequest.currentToken) {
                    let decodedToken = decode(prevRequest.currentToken)
                    
                    const { exp } :any = decodedToken
                    let isExp: boolean = false;
                    if (Date.now() <= exp * 1000) {
                        isExp = false
                    } else isExp = true
                    
                    if (!isExp) {
                        return serverResponse(res, 202, 'ok', 'Token has not been expired yet. Check your email')
                    } else {
                        next()
                    }
                } else next()
            } else {
                next()
            }
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async reRequestToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findFirst({ where: { email: req.body.account.email } })
            const admin = await prisma.admin.findFirst({ where: { email: req.body.account.email } })
            const prevRequest = await prisma.passwordRequest.findUnique({ where: { accountId: req.body.account.id }})

            if (prevRequest) {
                let payload : { id: string, role: string } = { id: '', role: '' }
                if (user) payload = { id: user?.id, role: 'user' } 
                else if (admin) payload = { id: admin?.id, role: admin.role }

                const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
                let link: string = ''
                if (user) link = `${process.env.PUBLIC_URL}forgot-password/user/${token}`;
                if (admin) link = `${process.env.PUBLIC_URL}forgot-password/admin/${token}`;

                const templatePath = path.join(__dirname, "../templates", "reRequestResetPassword.html")
                const templateSource = fs.readFileSync(templatePath, 'utf-8')
                const compiledTemplate = handlebars.compile(templateSource)
                const html = compiledTemplate({ link, name: user?.username || admin?.fullName })
        
                await transporter.sendMail({
                    from: "weardrobe2000@gmail.com",
                    to: user?.email || admin?.email,
                    subject: "New Password Reset Link for Your WearDrobe Account",
                    html
                })

                await prisma.passwordRequest.update({ 
                    where: { id: prevRequest.id }, 
                    data: { requestCount: prevRequest.requestCount + 1, currentToken: token } 
                })

                return serverResponse(res, 200, 'ok', 'Email has been sent!')
            } else {
                next()
            }

        } catch (error: any) {
            return serverResponse(res, 400, 'error', error)
        }
    }

    async requestForgotPassword(req: Request, res: Response) {
        try {
            const user = await prisma.user.findFirst({ where: { email: req.body.account.email } })
            const admin = await prisma.admin.findFirst({ where: { email: req.body.account.email } })

            let payload : { id: string, role: string } = { id: '', role: '' }
            if (user) payload = { id: user?.id, role: 'user' }
            else if (admin) payload = { id: admin?.id, role: admin.role }

            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
            let link: string = ''
            if (user) link = `${process.env.PUBLIC_URL}forgot-password/user/${token}`;
            if (admin) link = `${process.env.PUBLIC_URL}forgot-password/admin/${token}`;

            let newRequest;
            let newRequestData = { id: uuid(), currentToken: token }
            if (user?.id) {
                newRequest = await prisma.passwordRequest.create({
                    data: { ...newRequestData, accountId: user.id }
                })
            } else if (admin?.id) {
                newRequest = await prisma.passwordRequest.create({
                    data: { ...newRequestData, accountId: admin.id }
                })
            }
            if (newRequest) {
                await prisma.passwordRequest.update({ 
                    where: { id: newRequest.id }, 
                    data: { requestCount: newRequest.requestCount + 1 } 
                })
            }
            
            const templatePath = path.join(__dirname, "../templates", "resetPassword.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({ link, name: user?.username || admin?.fullName })
    
            await transporter.sendMail({
                from: "weardrobe2000@gmail.com",
                to: user?.email || admin?.email,
                subject: "Password Reset Request for Your WearDrobe Account",
                html
            })

            serverResponse(res, 200, 'ok', 'Email has been sent!')
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async checkCurrentPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const account = await prisma.user.findFirst({ where: { id: req.body.id } }) || await prisma.admin.findFirst({ where: { id: req.body.id } })
            if (account && account.password) {
                const passwordValid = await compare(req.body.password, account.password);
                if (passwordValid == false) return serverResponse(res, 401, 'error', 'password incorrect!')
                return serverResponse(res, 200, 'ok', 'passwords match')
            }
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findFirst({ where: { id: req.body.id } })
            const admin = await prisma.admin.findFirst({ where: { id: req.body.id } })
            const prevRequest = await prisma.passwordRequest.findFirst({ where: { currentToken: req.body.token } })
            const salt = await genSalt(10);
            const hashedPassword = await hash(req.body.password, salt);
            if (prevRequest) {
                if (user) {
                    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } })
                    await prisma.passwordRequest.update({ where: { accountId: user.id }, data: { currentToken: null } })
                } else if (admin)  {
                    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashedPassword } })
                    await prisma.passwordRequest.update({ where: { accountId: admin.id }, data: { currentToken: null } })
                } else return serverResponse(res, 404, 'error', 'Account not found')
                serverResponse(res, 200, 'ok', 'Password has been updated!')
            } else return serverResponse(res, 404, 'error', 'Token not found or invalid!')
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async requestResetPassword(req: Request, res: Response) {
        try {
            const user = await prisma.user.findFirst({ where: { email: req.body.account.email } })
            const admin = await prisma.admin.findFirst({ where: { email: req.body.account.email } })

            let payload : { id: string, role: string } = { id: '', role: '' }
            if (user) payload = { id: user?.id, role: 'user' }
            else if (admin) payload = { id: admin?.id, role: admin.role }

            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
            let link: string = ''
            if (user) link = `${process.env.PUBLIC_URL}reset-password/user/${token}`;
            if (admin) link = `${process.env.PUBLIC_URL}reset-password/admin/${token}`;

            let newRequest;
            let newRequestData = { id: uuid(), currentToken: token }
            if (user?.id) {
                newRequest = await prisma.passwordRequest.create({
                    data: { ...newRequestData, accountId: user.id }
                })
            } else if (admin?.id) {
                newRequest = await prisma.passwordRequest.create({
                    data: { ...newRequestData, accountId: admin.id }
                })
            }
            if (newRequest) {
                await prisma.passwordRequest.update({ 
                    where: { id: newRequest.id }, 
                    data: { requestCount: newRequest.requestCount + 1 } 
                })
            }
            
            const templatePath = path.join(__dirname, "../templates", "resetPassword.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({ link, name: user?.username || admin?.fullName })
    
            await transporter.sendMail({
                from: "weardrobe2000@gmail.com",
                to: user?.email || admin?.email,
                subject: "Password Reset Request for Your WearDrobe Account",
                html
            })
            serverResponse(res, 200, 'ok', 'Email has been sent!')
            
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

}