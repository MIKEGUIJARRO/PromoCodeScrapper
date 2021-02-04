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
    let steps = 0;
    let productCounter = 0;
    while (steps != 1) {
        steps++;
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        const response = await page.waitForResponse(response => {
            return response.status() === 200;
        });
        if (response.request().url().includes("https://affiliate-program.amazon.com/home/promohub/promocodes/")) {
            const LOAD_BATCH = 10;
            console.log(steps);
            for (let i = 0; i < LOAD_BATCH; i++) {
                productCounter++;
                //We ensure the visibility of the element
                const itemElement = await page.waitForSelector(`.promo-item-display:nth-child(${productCounter})`);
                //Accesing and manipulating the DOM element
                                
                const linkElement = await itemElement.$("input.a-button-input");
                const promoElement = await itemElement.$("div.promo-category");
                const linkPromoElement = await itemElement.$("a.a-link-normal");
                const dateElement = await itemElement.$("span.a-size-small");

                const promoText = await page.evaluate(el => el.textContent, promoElement);
                const linkText = await page.evaluate(el => el.textContent, linkPromoElement);
                const dateText = await page.evaluate(el => el.textContent, dateElement);

                const item = {
                    promoText,
                    linkText,
                    dateText,
                }
                console.log(productCounter, item);
            }

        }
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
        await page.waitForNavigation({ waitUntil: "networkidle2" });
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
        await page.waitForNavigation({ waitUntil: "networkidle2" });
    } catch (e) {
        console.log(e);
    }
};