"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_router_1 = require("./routers/api.router");
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PORT = '8000';
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.handleError();
        this.setupScheduler();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, express_1.json)());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
    }
    handleError() {
        // not found
        this.app.use((req, res, next) => {
            if (req.path.includes('/api/')) {
                res.status(404).send('Not found !');
            }
            else {
                next();
            }
        });
        // error
        this.app.use((err, req, res, next) => {
            if (req.path.includes('/api/')) {
                console.error('Error : ', err.stack);
                res.status(500).send('Error !');
            }
            else {
                next();
            }
        });
    }
    routes() {
        const apiRouter = new api_router_1.ApiRouter();
        this.app.get('/api', (req, res) => {
            res.send(`Hello, Purwadhika Student !`);
        });
        this.app.use('/api', apiRouter.getRouter());
    }
    setupScheduler() {
        node_cron_1.default.schedule('0 */1 * * *', () => __awaiter(this, void 0, void 0, function* () {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const oneHoursAgo = new Date();
            oneHoursAgo.setDate(oneHoursAgo.getHours() - 1);
            try {
                const ordersToUpdate = yield prisma.order.findMany({
                    where: {
                        status: 'SHIPPED',
                        shippedAt: {
                            lt: sevenDaysAgo,
                        },
                    },
                });
                for (const order of ordersToUpdate) {
                    yield prisma.order.update({
                        where: { id: order.id },
                        data: { status: 'COMPLETED' },
                    });
                }
                const failedOrder = yield prisma.order.findMany({
                    where: { status: 'PENDING_PAYMENT', paymentStatus: 'PENDING', createdAt: { lt: oneHoursAgo } }
                });
                for (const order of failedOrder) {
                    yield prisma.order.update({
                        where: { id: order.id },
                        data: { status: 'CANCELLED', paymentStatus: 'FAILED' },
                    });
                }
            }
            catch (error) {
                console.error('Error running daily scheduler job:', error);
            }
        }));
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
        });
    }
}
exports.default = App;
