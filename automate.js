const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
const url = "https://python.org";

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        slowMo: 120,
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

    console.log("Number of Chapters: " + URLsOfLessons.length);

    const pdfFiles = [];
    pdfFiles.push('Table of content.pdf');

    for (let  i = 0; i < URLsOfLessons.length; i++) {                  
        const elem = URLsOfLessons[i];
        const href = await page.evaluate(e => e.href, elem); 
        const newPage = await browser.newPage();
        await newPage.goto(href);
        const pdfFileNameCurrent = 'Chapter' + (i + 1) + '.pdf'; 
        await newPage.pdf({ path: pdfFileNameCurrent, format: "A4" });
        pdfFiles.push(pdfFileNameCurrent);
        await newPage.close();
        console.log(`Chapter ${i+1} downloaded and saved as PDF file...  `);
      }
      console.log("Download complete.");

    browser.close();

    await mergeMultiplePDF(pdfFiles);
}
run();

const mergeMultiplePDF = (pdfFiles) => {
    return new Promise((resolve, reject) => {
        merge(pdfFiles,'FinalBook.pdf',function(err){

            if(err){
                console.log(err);
                reject(err)
            }

            console.log('Merging all Chapters into a single combined file successful. Go and check the FinalBook.pdf ');
            resolve()
        });
    });
};