const puppeteer = require('puppeteer');

(async () =>
{
    try
    {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        // 1920 View
        await page.setViewport({width: 1920, height: 1080});
        await page.goto(`http://localhost:3001/#/AllData/`);
        await page.screenshot({path: './puppeteer_results/AllData1920.png'});

        await page.goto(`http://localhost:3001/#/Login/`);
        await page.screenshot({path: './puppeteer_results/Login1920.png'});

        // 1000 View
        await page.setViewport({width: 1000, height: 700});
        await page.goto(`http://localhost:3001/#/AllData/`);
        await page.screenshot({path: './puppeteer_results/AllData1000.png'});

        // 720 View
        await page.setViewport({width: 720, height: 660});
        await page.goto(`http://localhost:3001/#/AllData/`);
        await page.screenshot({path: './puppeteer_results/AllData0720.png'});

        // 680 View
        await page.setViewport({width: 680, height: 420});
        await page.goto(`http://localhost:3001/#/AllData/`);
        await page.screenshot({path: './puppeteer_results/AllData0680.png'});

        await browser.close();
    }
    catch (e)
    {
        console.log(e);
    }

})();
