import puppeteer from 'puppeteer';
import settings from '../settings.json';

// TODO fix double quotes

main()
async function main() {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await login(page, browser);

    await page.goto(`${settings.url}/html/content/internet/portforwarding.html`, { waitUntil: "networkidle0" });
    console.log("Portforwarding settings page loaded.");

    // Unfold port forwardings
    await page.evaluate(() => {
        // @ts-ignore
        $('#containercontent > div > h2').eq(0).click();
    });

    // Unfold rule
    await page.click('#portuw_forwarding_' + settings.fw_id);

    // Resave port forwarding rule
    await page.click('#btn_save_portuw_' + settings.fw_id);
    console.log("Saved port forward rule. Waiting 10 seconds for storing!")
    await page.waitFor(10000);


    await page.screenshot({ path: 'example.png' });
    await browser.close();
}

async function login(page: puppeteer.Page, browser: puppeteer.Browser) {
    await page.goto(settings.url, { waitUntil: 'networkidle0' });
    const loginUrl = page.url();
    console.log('Login page successfully loaded.');

    const skipButtonHidden = await page.evaluate(() => {
        // @ts-ignore
        return $('#skipbutton').css('display') === 'none'
    });

    if (!skipButtonHidden) {
        await page.click('#skipbutton');
        console.log("Clicked skip button.")
    }

    await page.type('#router_password', settings.password);
    console.log("Typed password.");

    await page.evaluate(() => { // make shitty working login button visible and working
        // @ts-ignore
        $('#loginbutton').show();
    });

    await page.click('#loginbutton');
    console.log("Clicked login button.");
    try {
        await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 });
    } catch (error) {
        if (!error.toString().includes("Timeout")) {
            console.log(error);
        }
    }

    if (page.url() == loginUrl) { // Have we been moved to the main page?
        console.log("Couldn't login! Is the password correct? See error.png for more info!");
        await page.screenshot({ path: 'error.png' });
        browser.close();
        process.exit(1);
    }
    console.log("Successfully logged in.");
}