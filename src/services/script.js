const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeData() {
    try {
        const browser = await puppeteer.launch({ headless: true }); 
        const page = await browser.newPage();
        await page.goto('https://techicons.dev/', { waitUntil: 'networkidle2' });

        const scrollPage = async () => {
            await page.evaluate(async () => {
                const distance = 100; 
                const delay = 300;

                let totalHeight = 0;
                let scrollHeight = document.body.scrollHeight;
                while (totalHeight < scrollHeight) {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    scrollHeight = document.body.scrollHeight; 
                }
            });
        };

        await scrollPage();

        await page.waitForSelector('a');

        const items = await page.evaluate(() => {
            const icons = [];
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                const imgSrc = link.querySelector('img') ? link.querySelector('img').src : null;
                const text = link.querySelector('p') ? link.querySelector('p').innerText.trim() : null;
                
                if (imgSrc && text) {
                    icons.push({ imgSrc, text });
                }
            });
            return icons;
        });

        items.sort((a, b) => a.text.localeCompare(b.text));

        fs.writeFileSync('scrapedIcons.json', JSON.stringify(items, null, 2), 'utf-8');
        
        console.log('Data berhasil disimpan dalam scrapedIcons.json');

        await browser.close();
    } catch (error) {
        console.error('Terjadi kesalahan saat scraping:', error);
    }
}

scrapeData();
