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
exports.UserController = void 0;
const apiResponse_1 = require("@/helpers/apiResponse");
const prisma_1 = __importDefault(require("@/prisma"));
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = require("@/helpers/nodemailer");
const handlebars_1 = __importDefault(require("handlebars"));
const bcrypt_1 = require("bcrypt");
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const existingUserEmail = yield prisma_1.default.user.findUnique({ where: { email: email } });
                const existingAdminEmail = yield prisma_1.default.admin.findUnique({ where: { email: email } });
                if (existingUserEmail || existingAdminEmail) {
                    return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'email has been taken', existingUserEmail || existingAdminEmail);
                }
                const user = yield prisma_1.default.user.create({
                    data: Object.assign({ id: (0, uuid_1.v4)() }, req.body)
                });
                const payload = { id: user.id, role: 'user' };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                const link = `${process.env.PUBLIC_URL}verify/user/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "register.html");
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ link });
                yield nodemailer_1.transporter.sendMail({
                    from: "weardrobe2000@gmail.com",
                    to: user.email,
                    subject: "Welcome to WearDrobe! Verify Your Email to Get Started",
                    html
                });
                (0, apiResponse_1.serverResponse)(res, 201, 'ok', 'user has been registered!', user);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    setupUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, dob, gender, account } = req.body;
                const existingUsername = yield prisma_1.default.user.findUnique({ where: { username: username } });
                if (existingUsername) {
                    return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'username has been taken');
                }
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
                const user = yield prisma_1.default.user.update({
                    where: { id: account.id },
                    data: {
                        username,
                        password: hashedPassword,
                        dob: new Date(dob),
                        gender
                    }
                });
                next();
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    createSSOUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email } = req.body;
                const existingUsername = yield prisma_1.default.user.findUnique({ where: { username: username } });
                const existingEmail = yield prisma_1.default.user.findUnique({ where: { email: email } });
                if (existingEmail) {
                    const token = (0, jsonwebtoken_1.sign)({ id: existingEmail.id, role: 'user' }, process.env.KEY_JWT, { expiresIn: '1h' });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'email has been registered before. Proceed to login', { existingEmail, token });
                }
                if (existingUsername)
                    return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'username has been taken');
                const user = yield prisma_1.default.user.create({
                    data: Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, req.body), { createdAt: new Date() })
                });
                const payload = { id: user.id, role: 'user' };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                (0, apiResponse_1.serverResponse)(res, 201, 'ok', 'user has been created!', { user, token, role: 'user' });
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany({
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        accountActive: true,
                        gender: true,
                        dob: true
                    }
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'user found!', users);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { id: req.params.id } });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'user found!', user);
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    updatePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { id: req.params.id } });
                if (user) {
                    yield prisma_1.default.user.update({ where: { id: user.id }, data: { imgUrl: req.body.imgUrl } });
                }
                else
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'user not found!');
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
                const user = yield prisma_1.default.user.findFirst({ where: { id: req.params.id } });
                if (user) {
                    if (user.imgUrl == null)
                        return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'You have no photo profile');
                    yield prisma_1.default.user.update({ where: { id: user.id }, data: { imgUrl: null } });
                }
                else
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'user not found!');
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
                const user = yield prisma_1.default.user.findFirst({ where: { id: req.params.id } });
                if (email) {
                    const existingUserEmail = yield prisma_1.default.user.findUnique({ where: { email: email } });
                    const existingAdminEmail = yield prisma_1.default.admin.findUnique({ where: { email: email } });
                    if (existingAdminEmail || existingUserEmail)
                        return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'Email has been taken!');
                }
                if (user) {
                    for (const [key, value] of Object.entries(req.body)) {
                        if (key == 'username' && value) {
                            const existingUsername = yield prisma_1.default.user.findFirst({ where: { username: value } });
                            if (existingUsername)
                                return (0, apiResponse_1.serverResponse)(res, 409, 'error', 'Username has been taken!');
                        }
                        if (key != 'email' && key != 'prevEmail') {
                            yield prisma_1.default.user.update({
                                where: { id: user.id },
                                data: { [key]: value }
                            });
                        }
                    }
                    if (email) {
                        yield prisma_1.default.user.update({ where: { id: user.id }, data: { accountActive: false, } });
                        const payload = { id: user.id, role: 'user', prevEmail: prevEmail, newEmail: email };
                        const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                        const link = `${process.env.PUBLIC_URL}verify/user/${token}`;
                        const templatePath = path_1.default.join(__dirname, "../templates", "reVerifyAccount.html");
                        const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                        const compiledTemplate = handlebars_1.default.compile(templateSource);
                        const html = compiledTemplate({ link, name: user === null || user === void 0 ? void 0 : user.username });
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
exports.UserController = UserController;
