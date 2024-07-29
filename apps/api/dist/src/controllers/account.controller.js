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
exports.AccountController = void 0;
const apiResponse_1 = require("@/helpers/apiResponse");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const nodemailer_1 = require("@/helpers/nodemailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const prisma_1 = __importDefault(require("@/prisma"));
class AccountController {
    loginAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield prisma_1.default.admin.findUnique({ where: { email } });
                const user = yield prisma_1.default.user.findUnique({ where: { email } });
                if (user && user.password) {
                    const passwordValid = yield (0, bcrypt_1.compare)(password, user.password);
                    if (passwordValid == false)
                        return (0, apiResponse_1.serverResponse)(res, 401, 'ok', 'password incorrect!');
                    const payload = { id: user.id, role: 'user' };
                    const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '30m' });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'login success', { user, token, role: 'user' });
                }
                else if (admin && admin.password) {
                    const passwordValid = yield (0, bcrypt_1.compare)(password, admin.password);
                    if (passwordValid == false)
                        return (0, apiResponse_1.serverResponse)(res, 401, 'ok', 'password incorrect!');
                    const payload = { id: admin.id, role: admin.role };
                    const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '30m' });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'login success', { admin, token, role: admin.role });
                }
                else {
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'account not found');
                }
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const accountID = req.body.account.id;
                const user = yield prisma_1.default.user.findFirst({ where: { id: accountID } });
                if (user) {
                    if (user && user.password) {
                        const isMatched = yield (0, bcrypt_1.compare)(password, user === null || user === void 0 ? void 0 : user.password);
                        if (isMatched) {
                            yield prisma_1.default.user.update({ where: { id: accountID }, data: { accountActive: true, email: req.body.account.newEmail } });
                        }
                        else {
                            return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'Password incorrect!');
                        }
                    }
                }
                if (!user)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'user not found');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Account has been verified!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    verifyAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const accountID = req.body.account.id;
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: accountID } });
                if (admin) {
                    if (admin && admin.password) {
                        const isMatched = yield (0, bcrypt_1.compare)(password, admin === null || admin === void 0 ? void 0 : admin.password);
                        if (isMatched) {
                            yield prisma_1.default.admin.update({ where: { id: accountID }, data: { accountActive: true, email: req.body.account.newEmail } });
                        }
                        else {
                            return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'Password incorrect!');
                        }
                    }
                }
                if (!admin)
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'admin not found');
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Account has been verified!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const user = yield prisma_1.default.user.findFirst({ where: { id: id } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: id } });
                if (user) {
                    const payload = { id: user.id, role: 'user' };
                    const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Token refreshed!', token);
                }
                if (admin) {
                    const payload = { id: admin.id, role: admin.role };
                    const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Token refreshed!', token);
                }
                (0, apiResponse_1.serverResponse)(res, 400, 'error', 'Account not found.');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    checkEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = (yield prisma_1.default.user.findFirst({ where: { OR: [{ email: req.body.email }, { id: req.body.id }] } })) || (yield prisma_1.default.admin.findFirst({ where: { OR: [{ email: req.body.email }, { id: req.body.id }] } }));
                if (account) {
                    if (!(account === null || account === void 0 ? void 0 : account.password)) {
                        if (account === null || account === void 0 ? void 0 : account.accountActive) {
                            return (0, apiResponse_1.serverResponse)(res, 401, 'error', 'Password reset is unavailable');
                        }
                        else {
                            return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Password has not been setup, yet. Please verify your account.');
                        }
                    }
                    req.body.account = account;
                    next();
                }
                else {
                    return (0, apiResponse_1.serverResponse)(res, 400, 'error', 'Account not found!');
                }
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    checkTokenExp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prevRequest = (yield prisma_1.default.passwordRequest.findUnique({ where: { accountId: req.body.account.id } })) || (yield prisma_1.default.passwordRequest.findUnique({ where: { accountId: req.body.account.id } }));
                if (prevRequest) {
                    if (prevRequest.currentToken) {
                        let decodedToken = (0, jsonwebtoken_1.decode)(prevRequest.currentToken);
                        const { exp } = decodedToken;
                        let isExp = false;
                        if (Date.now() <= exp * 1000) {
                            isExp = false;
                        }
                        else
                            isExp = true;
                        if (!isExp) {
                            return (0, apiResponse_1.serverResponse)(res, 202, 'ok', 'Token has not been expired yet. Check your email');
                        }
                        else {
                            next();
                        }
                    }
                    else
                        next();
                }
                else {
                    next();
                }
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    reRequestToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { email: req.body.account.email } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { email: req.body.account.email } });
                const prevRequest = yield prisma_1.default.passwordRequest.findUnique({ where: { accountId: req.body.account.id } });
                if (prevRequest) {
                    let payload = { id: '', role: '' };
                    if (user)
                        payload = { id: user === null || user === void 0 ? void 0 : user.id, role: 'user' };
                    else if (admin)
                        payload = { id: admin === null || admin === void 0 ? void 0 : admin.id, role: admin.role };
                    const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                    let link = '';
                    if (user)
                        link = `${process.env.PUBLIC_URL}forgot-password/user/${token}`;
                    if (admin)
                        link = `${process.env.PUBLIC_URL}forgot-password/admin/${token}`;
                    const templatePath = path_1.default.join(__dirname, "../templates", "reRequestResetPassword.html");
                    const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                    const compiledTemplate = handlebars_1.default.compile(templateSource);
                    const html = compiledTemplate({ link, name: (user === null || user === void 0 ? void 0 : user.username) || (admin === null || admin === void 0 ? void 0 : admin.fullName) });
                    yield nodemailer_1.transporter.sendMail({
                        from: "weardrobe2000@gmail.com",
                        to: (user === null || user === void 0 ? void 0 : user.email) || (admin === null || admin === void 0 ? void 0 : admin.email),
                        subject: "New Password Reset Link for Your WearDrobe Account",
                        html
                    });
                    yield prisma_1.default.passwordRequest.update({
                        where: { id: prevRequest.id },
                        data: { requestCount: prevRequest.requestCount + 1, currentToken: token }
                    });
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Email has been sent!');
                }
                else {
                    next();
                }
            }
            catch (error) {
                return (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    requestForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { email: req.body.account.email } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { email: req.body.account.email } });
                let payload = { id: '', role: '' };
                if (user)
                    payload = { id: user === null || user === void 0 ? void 0 : user.id, role: 'user' };
                else if (admin)
                    payload = { id: admin === null || admin === void 0 ? void 0 : admin.id, role: admin.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                let link = '';
                if (user)
                    link = `${process.env.PUBLIC_URL}forgot-password/user/${token}`;
                if (admin)
                    link = `${process.env.PUBLIC_URL}forgot-password/admin/${token}`;
                let newRequest;
                let newRequestData = { id: (0, uuid_1.v4)(), currentToken: token };
                if (user === null || user === void 0 ? void 0 : user.id) {
                    newRequest = yield prisma_1.default.passwordRequest.create({
                        data: Object.assign(Object.assign({}, newRequestData), { accountId: user.id })
                    });
                }
                else if (admin === null || admin === void 0 ? void 0 : admin.id) {
                    newRequest = yield prisma_1.default.passwordRequest.create({
                        data: Object.assign(Object.assign({}, newRequestData), { accountId: admin.id })
                    });
                }
                if (newRequest) {
                    yield prisma_1.default.passwordRequest.update({
                        where: { id: newRequest.id },
                        data: { requestCount: newRequest.requestCount + 1 }
                    });
                }
                const templatePath = path_1.default.join(__dirname, "../templates", "resetPassword.html");
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ link, name: (user === null || user === void 0 ? void 0 : user.username) || (admin === null || admin === void 0 ? void 0 : admin.fullName) });
                yield nodemailer_1.transporter.sendMail({
                    from: "weardrobe2000@gmail.com",
                    to: (user === null || user === void 0 ? void 0 : user.email) || (admin === null || admin === void 0 ? void 0 : admin.email),
                    subject: "Password Reset Request for Your WearDrobe Account",
                    html
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Email has been sent!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    checkCurrentPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = (yield prisma_1.default.user.findFirst({ where: { id: req.body.id } })) || (yield prisma_1.default.admin.findFirst({ where: { id: req.body.id } }));
                if (account && account.password) {
                    const passwordValid = yield (0, bcrypt_1.compare)(req.body.password, account.password);
                    if (passwordValid == false)
                        return (0, apiResponse_1.serverResponse)(res, 401, 'error', 'password incorrect!');
                    return (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'passwords match');
                }
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { id: req.body.id } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { id: req.body.id } });
                const prevRequest = yield prisma_1.default.passwordRequest.findFirst({ where: { currentToken: req.body.token } });
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashedPassword = yield (0, bcrypt_1.hash)(req.body.password, salt);
                if (prevRequest) {
                    if (user) {
                        yield prisma_1.default.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
                        yield prisma_1.default.passwordRequest.update({ where: { accountId: user.id }, data: { currentToken: null } });
                    }
                    else if (admin) {
                        yield prisma_1.default.admin.update({ where: { id: admin.id }, data: { password: hashedPassword } });
                        yield prisma_1.default.passwordRequest.update({ where: { accountId: admin.id }, data: { currentToken: null } });
                    }
                    else
                        return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Account not found');
                    (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Password has been updated!');
                }
                else
                    return (0, apiResponse_1.serverResponse)(res, 404, 'error', 'Token not found or invalid!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
    requestResetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { email: req.body.account.email } });
                const admin = yield prisma_1.default.admin.findFirst({ where: { email: req.body.account.email } });
                let payload = { id: '', role: '' };
                if (user)
                    payload = { id: user === null || user === void 0 ? void 0 : user.id, role: 'user' };
                else if (admin)
                    payload = { id: admin === null || admin === void 0 ? void 0 : admin.id, role: admin.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: '1h' });
                let link = '';
                if (user)
                    link = `${process.env.PUBLIC_URL}reset-password/user/${token}`;
                if (admin)
                    link = `${process.env.PUBLIC_URL}reset-password/admin/${token}`;
                let newRequest;
                let newRequestData = { id: (0, uuid_1.v4)(), currentToken: token };
                if (user === null || user === void 0 ? void 0 : user.id) {
                    newRequest = yield prisma_1.default.passwordRequest.create({
                        data: Object.assign(Object.assign({}, newRequestData), { accountId: user.id })
                    });
                }
                else if (admin === null || admin === void 0 ? void 0 : admin.id) {
                    newRequest = yield prisma_1.default.passwordRequest.create({
                        data: Object.assign(Object.assign({}, newRequestData), { accountId: admin.id })
                    });
                }
                if (newRequest) {
                    yield prisma_1.default.passwordRequest.update({
                        where: { id: newRequest.id },
                        data: { requestCount: newRequest.requestCount + 1 }
                    });
                }
                const templatePath = path_1.default.join(__dirname, "../templates", "resetPassword.html");
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ link, name: (user === null || user === void 0 ? void 0 : user.username) || (admin === null || admin === void 0 ? void 0 : admin.fullName) });
                yield nodemailer_1.transporter.sendMail({
                    from: "weardrobe2000@gmail.com",
                    to: (user === null || user === void 0 ? void 0 : user.email) || (admin === null || admin === void 0 ? void 0 : admin.email),
                    subject: "Password Reset Request for Your WearDrobe Account",
                    html
                });
                (0, apiResponse_1.serverResponse)(res, 200, 'ok', 'Email has been sent!');
            }
            catch (error) {
                (0, apiResponse_1.serverResponse)(res, 400, 'error', error);
            }
        });
    }
}
exports.AccountController = AccountController;
