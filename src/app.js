const puppeteer = require('puppeteer');

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.on('console', async msg => {
        const args = msg.args();
        const vals = [];
        for (let i = 0; i < args.length; i++) {
            vals.push(await args[i].jsonValue());
        }
        console.log(vals.join('\t'));
    });


    page.setViewport({ width: 1280, height: 926 });

    //Navigate to LoginPage
    await loginInfo(page);
    //Click into the promoCode Navbar
    await clickPromoCodeNav(page);
    //Scrap the items and promocodes
    let i = 0;
    while (i != 1000) {
        i++;
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        console.log(i);
        await page.waitForTimeout(3000);
    }
    await page.waitForTimeout(6000);

    // Scroll one viewport at a time, pausing to let content load

    await page.waitForTimeout(5000);
    await browser.close();
})();





const loginInfo = async (page) => {
    try {
        await page.goto('https://affiliate-program.amazon.com/home');
        const emailInput = await page.$("#ap_email");
        const passwordInput = await page.$("#ap_password");
        const signInBtn = await page.$("#signInSubmit");
        await emailInput.type(EMAIL);
        await passwordInput.type(PASSWORD);
        await signInBtn.click();
        await page.waitForNavigation();
    } catch (e) {
        console.log(e);
    }
};

const clickPromoCodeNav = async (page) => {
    try {
        const promotionsNavLi = await page.$('li[data-menu-title="Promotions"]');
        await promotionsNavLi.click();
        const amazonPromoCodes = await page.$('a[title="Amazon Promo Codes"]');
        await amazonPromoCodes.click();
        await page.waitForNavigation();
    } catch (e) {
        console.log(e);
    }
};