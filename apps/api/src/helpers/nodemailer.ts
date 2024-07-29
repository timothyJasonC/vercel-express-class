import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "weardrobe2000@gmail.com",
        pass: "hjds zqye zbij ocet"
    }
})