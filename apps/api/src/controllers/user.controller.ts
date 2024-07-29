import { NextFunction, Request, Response } from "express";
import { serverResponse } from "../helpers/apiResponse";
import prisma from "../prisma";
import { sign } from "jsonwebtoken";
import { v4 as uuid } from 'uuid'
import path from 'path'
import fs from 'fs'
import { transporter } from "../helpers/nodemailer";
import handlebars from "handlebars";
import { genSalt, hash } from "bcrypt";

export class UserController {
    async createUser(req: Request, res: Response) {
        try {

            const { email } = req.body;
            const existingUserEmail = await prisma.user.findUnique({ where: { email: email } })
            const existingAdminEmail = await prisma.admin.findUnique({ where: { email: email } })

            if (existingUserEmail || existingAdminEmail) {
                return serverResponse(res, 409, 'error', 'email has been taken', existingUserEmail || existingAdminEmail)
            }

            const user = await prisma.user.create({
                data: { id: uuid(), ...req.body }
            })

            const payload = { id: user.id, role: 'user' }
            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
            const link = `${process.env.PUBLIC_URL}verify/user/${token}`;

            const templatePath = path.join(__dirname, "../templates", "register.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({ link })

            await transporter.sendMail({
                from: "weardrobe2000@gmail.com",
                to: user.email,
                subject: "Welcome to WearDrobe! Verify Your Email to Get Started",
                html
            })

            serverResponse(res, 201, 'ok', 'user has been registered!', user)

        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async setupUser(req: Request, res: Response, next: NextFunction) {
        try {

            const { username, password, dob, gender, account } = req.body;
            const existingUsername = await prisma.user.findUnique({ where: { username: username } })

            if (existingUsername) {
                return serverResponse(res, 409, 'error', 'username has been taken')
            }
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);

            const user = await prisma.user.update({
                where: { id: account.id },
                data: {
                    username,
                    password: hashedPassword,
                    dob: new Date(dob),
                    gender
                }
            })
            next()

        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async createSSOUser(req: Request, res: Response) {
        try {
            const { username, email } = req.body;
            const existingUsername = await prisma.user.findUnique({ where: { username: username } })
            const existingEmail = await prisma.user.findUnique({ where: { email: email } })
            if (existingEmail) {
                const token = sign({ id: existingEmail.id, role: 'user' }, process.env.KEY_JWT!, { expiresIn: '1h' })
                return serverResponse(res, 200, 'ok', 'email has been registered before. Proceed to login', { existingEmail, token } )
            }
            if (existingUsername) return serverResponse(res, 409, 'error', 'username has been taken')

            const user = await prisma.user.create({
                data: { id: uuid(), ...req.body, createdAt: new Date() }
            })

            const payload = { id: user.id, role: 'user' }
            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })

            serverResponse(res, 201, 'ok', 'user has been created!', { user, token, role: 'user' })
    
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    accountActive: true,
                    gender: true,
                    dob: true
                }
            })
            serverResponse(res, 200, 'ok', 'user found!', users)
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await prisma.user.findFirst({ where: { id: req.params.id } })
            serverResponse(res, 200, 'ok', 'user found!', user)
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async updatePhoto(req: Request, res: Response) {
        try { 
            const user = await prisma.user.findFirst({ where : { id: req.params.id }})
            if (user) {
                await prisma.user.update({ where: { id: user.id }, data: { imgUrl: req.body.imgUrl  } })
            } else return serverResponse(res, 404, 'error', 'user not found!')
            serverResponse(res, 200, 'ok', 'photo profile has been updated')
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async removePhoto(req: Request, res: Response) {
        try { 
            const user = await prisma.user.findFirst({ where : { id: req.params.id }})
            if (user) {
                if (user.imgUrl == null) return serverResponse(res, 400, 'error', 'You have no photo profile')
                await prisma.user.update({ where: { id: user.id }, data: { imgUrl: null  } })
            } else return serverResponse(res, 404, 'error', 'user not found!')
            serverResponse(res, 200, 'ok', 'Photo profile has deleted!')
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async updatePersonalInfo(req: Request, res: Response) {
        try { 
            const { email, prevEmail } = req.body

            const user = await prisma.user.findFirst({ where : { id: req.params.id }})
            if (email) {
                const existingUserEmail = await prisma.user.findUnique({ where : { email: email }})
                const existingAdminEmail = await prisma.admin.findUnique({ where : { email: email }})
                if (existingAdminEmail || existingUserEmail) return serverResponse(res, 409, 'error', 'Email has been taken!')
            }

            if (user) {
                for (const [key, value] of Object.entries(req.body)) {
                    if (key == 'username' && value) {
                        const existingUsername = await prisma.user.findFirst({ where : { username: value }})
                        if (existingUsername) return serverResponse(res, 409, 'error', 'Username has been taken!')
                    }
                    if (key != 'email' && key != 'prevEmail') {
                        await prisma.user.update({ 
                            where: { id: user.id }, 
                            data: { [key]: value }
                        });
                    }
                    
                }
                if (email) {
                    await prisma.user.update({ where: { id: user.id }, data: { accountActive: false, } })
                    
                    const payload = { id: user.id, role: 'user', prevEmail: prevEmail, newEmail: email }
                    const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
                    const link = `${process.env.PUBLIC_URL}verify/user/${token}`;
            
                    const templatePath = path.join(__dirname, "../templates", "reVerifyAccount.html")
                    const templateSource = fs.readFileSync(templatePath, 'utf-8')
                    const compiledTemplate = handlebars.compile(templateSource)
                    const html = compiledTemplate({ link, name: user?.username })
            
                    await transporter.sendMail({
                        from: "weardrobe2000@gmail.com",
                        to: email,
                        subject: "Action Required: Re-Verify Your WearDrobe Account Email",
                        html
                    })
                } 
                
            } else return serverResponse(res, 404, 'error', 'Account not found!')

            serverResponse(res, 200, 'ok', 'Your personal info has been successfully updated!')
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

}