import fs from 'fs'
import path from 'path';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars'

export async function generateInvoicePdf(inputData: any) {
    let templatePath = path.join(__dirname, "../templates", "invoice.html")
    let templateHtml = fs.readFileSync(templatePath, 'utf-8')

    let template = handlebars.compile(templateHtml);
    
    let html = template(inputData);

    let now = new Date();
    let milis = now.getTime();

    let pdfPath = path.join(
        `./public/pdf`,
        `${'Invoice'}-${inputData.name}-${milis}.pdf`
    );

    let options: any = {
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
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        await page.addStyleTag({ path: path.join(__dirname, "../templates", "invoice.css") });

        await page.pdf(options);
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }

    return pdfPath
}