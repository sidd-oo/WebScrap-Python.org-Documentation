const puppeteer = require('puppeteer');
const url = "https://python.org";

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        slowMo: 10,
        args: ['--start-maximzed', '--disable-notifications']
    });
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(".python-navigation .navigation.menu .tier-1.element-3  a", {
        visible: true
    });
    await page.click(".python-navigation .navigation.menu .tier-1.element-3  a");


    await page.waitForSelector(".documentation-banner .download-buttons ", {
        visible: true
    });
    const elem = await page.$$('.documentation-banner .download-buttons a');
    await elem[0].click();


    await page.waitForSelector(".contentstable tbody tr td p:nth-child(2) a", {
        visible: true
    });
    await page.click(".contentstable tbody tr td p:nth-child(2) a");

    await page.waitForSelector(".toctree-wrapper.compound ", {
        visible: true
    });
    await page.pdf({ path: 'Table of content.pdf', format: "A4" });

     const URLsOfLessons = (await page.$$(".toctree-wrapper.compound ul li.toctree-l1 > a"));

    console.log(URLsOfLessons.length);
    let arraysofLessons = [];


    for (let  i = 1; i <= URLsOfLessons.length; i++) {                  
        const elem = URLsOfLessons[i];
        const href = await page.evaluate(e => e.href, elem); 
        const newPage = await browser.newPage();
        await newPage.goto(href);
        await newPage.pdf({ path: `${i}th.pdf`, format: "A4" });
        await newPage.close();
        console.log(`clicked link = ${i}`);
      }
    browser.close();
}
run();


