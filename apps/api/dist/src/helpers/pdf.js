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
exports.generateInvoicePdf = generateInvoicePdf;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const handlebars_1 = __importDefault(require("handlebars"));
function generateInvoicePdf(inputData) {
    return __awaiter(this, void 0, void 0, function* () {
        let templatePath = path_1.default.join(__dirname, "../templates", "invoice.html");
        let templateHtml = fs_1.default.readFileSync(templatePath, 'utf-8');
        let template = handlebars_1.default.compile(templateHtml);
        let html = template(inputData);
        let now = new Date();
        let milis = now.getTime();
        let pdfPath = path_1.default.join(`./public/pdf`, `${'Invoice'}-${inputData.name}-${milis}.pdf`);
        let options = {
            format: 'A4',
            margin: {
                top: '30px',
                bottom: '30px',
                right: '30px',
                left: '30px',
            },
            printBackground: true,
            path: pdfPath,
        };
        try {
            const browser = yield puppeteer_1.default.launch({
                args: ['--no-sandbox'],
                headless: true,
            });
            const page = yield browser.newPage();
            yield page.setContent(html, { waitUntil: 'networkidle0' });
            yield page.addStyleTag({ path: path_1.default.join(__dirname, "../templates", "invoice.css") });
            yield page.pdf(options);
            yield browser.close();
        }
        catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
        return pdfPath;
    });
}
