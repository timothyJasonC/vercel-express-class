"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const apiResponse_1 = require("@/helpers/apiResponse");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = require("@/helpers/nodemailer");
const handlebars_1 = __importDefault(require("handlebars"));
const bcrypt_1 = require("bcrypt");
const prisma_1 = __importDefault(require("@/prisma"));
class AdminController {
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const existingUserEmail = yield prisma_1.default.user.findUnique({ where: { email: email } });
                const existingAdminEmail = yield prisma_1.default.admin.findUnique({ where: { email: email } });
                if (existingUserEmail || existingAdminEmail) {
                    return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'email has been taken', existingUserEmail || existingAdminEmail);
                }
                const admin = yield prisma_1.default.admin.create({
                    data: Object.assign({ id: (0, uuid_1.v4)() }, req.body)
                });
                const payload = { id: admin.id, role: admin.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                const link = `${process.env.PUBLIC_URL}verify/admin/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "registerAdmin.html");
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ link });
                yield nodemailer_1.transporter.sendMail({
                    from: "weardrobe2000@gmail.com",
                    to: admin.email,
                    subject: "Welcome to WearDrobe! Verify Your Email to Get Started",
                    html
                });
                (0, apiResponse_1.serverResponse)(res, 201, 'ok', 'user has been registered!', admin);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    setupAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, password, dob, gender, account } = req.body;
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
                const admin = yield prisma_1.default.admin.update({
                    where: { id: account.id },
                    data: {
                        fullName, gender,
                        password: hashedPassword,
                        dob: new Date(dob),
                    }
                });
                next();
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getAdminById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'admin found!', admin);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admins = yield prisma_1.default.admin.findMany({
                    where: { role: 'warAdm' },
                    select: {
                        id: true,
                        accountActive: true,
                        fullName: true,
                        email: true,
                        gender: true,
                        dob: true,
                        createdAt: true
                    }
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'admin found!', admins);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getAvaliableAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const availableAdmins = yield prisma_1.default.admin.findMany({
                    where: {
                        role: 'warAdm',
                        accountActive: true,
                        Warehouse: null
                    }
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'admins found!', availableAdmins);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    editEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                if (!admin)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'account not found');
                const existingUserEmail = yield prisma_1.default.user.findUnique({ where: { email: req.body.email } });
                const existingAdminEmail = yield prisma_1.default.admin.findUnique({ where: { email: req.body.email } });
                if (existingAdminEmail || existingUserEmail)
                    return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'Email has been taken!');
                yield prisma_1.default.admin.update({ where: { id: admin.id }, data: { accountActive: false } });
                const payload = { id: admin.id, role: admin.role, newEmail: email, };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                const link = `${process.env.PUBLIC_URL}verify/admin/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "reVerifyAccount.html");
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ link, name: admin === null || admin === void 0 ? void 0 : admin.fullName });
                yield nodemailer_1.transporter.sendMail({
                    from: "weardrobe2000@gmail.com",
                    to: req.body.email,
                    subject: "Action Required: Re-Verify Your WearDrobe Account Email",
                    html
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Verification email has been sent!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    editFullName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                if (!admin)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'account not found');
                yield prisma_1.default.admin.update({ where: { id: admin.id }, data: { fullName: req.body.fullName } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Full name has been updated!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    dischargeAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                if (!admin)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'account not found');
                yield prisma_1.default.admin.delete({ where: { id: admin.id } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Admin has been discharged!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    updatePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                if (admin) {
                    yield prisma_1.default.admin.update({ where: { id: admin.id }, data: { imgUrl: req.body.imgUrl } });
                }
                else
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'admin not found!');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'photo profile has been updated');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    removePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                if (admin) {
                    if (admin.imgUrl == null)
                        return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'You have no photo profile');
                    yield prisma_1.default.admin.update({ where: { id: admin.id }, data: { imgUrl: null } });
                }
                else
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'admin not found!');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Photo profile has deleted!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    updatePersonalInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, prevEmail } = req.body;
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.params.id } });
                if (email) {
                    const existingUserEmail = yield prisma_1.default.user.findUnique({ where: { email: email } });
                    const existingAdminEmail = yield prisma_1.default.admin.findUnique({ where: { email: email } });
                    if (existingAdminEmail || existingUserEmail)
                        return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'Email has been taken!');
                }
                if (admin) {
                    for (const [key, value] of Object.entries(req.body)) {
                        if (key != 'email' && key != 'prevEmail') {
                            yield prisma_1.default.admin.update({ where: { id: admin.id }, data: {
                                    [key]: value,
                                } });
                        }
                    }
                    if (email) {
                        yield prisma_1.default.admin.update({ where: { id: admin.id }, data: { accountActive: false, } });
                        const payload = { id: admin.id, role: admin.role, prevEmail: prevEmail, newEmail: email };
                        const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                        const link = `${process.env.PUBLIC_URL}verify/admin/${token}`;
                        const templatePath = path_1.default.join(__dirname, "../templates", "reVerifyAccount.html");
                        const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                        const compiledTemplate = handlebars_1.default.compile(templateSource);
                        const html = compiledTemplate({ link, name: admin === null || admin === void 0 ? void 0 : admin.fullName });
                        yield nodemailer_1.transporter.sendMail({
                            from: "weardrobe2000@gmail.com",
                            to: email,
                            subject: "Action Required: Re-Verify Your WearDrobe Account Email",
                            html
                        });
                    }
                }
                else
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Account not found!');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Your personal info has been successfully updated!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.AdminController = AdminController;
