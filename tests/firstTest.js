const { Builder, By, until, Key } = require('selenium-webdriver');

async function clickConnectButtons(driver) {
    await driver.executeScript(`
        document.querySelectorAll('button').forEach(button => {
            if (button.innerText.trim() === 'Connect') {
                button.click();
            }
        });
    `);
}

async function autoConnect() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://www.linkedin.com/login');
        
        let usernameField = await driver.wait(until.elementLocated(By.id('username')), 10000);
        await usernameField.sendKeys('[enter your username]');
        
        let passwordField = await driver.wait(until.elementLocated(By.id('password')), 10000);
        await passwordField.sendKeys('[enter your password].', Key.RETURN);

        await driver.wait(until.elementLocated(By.xpath('//span[text()="My Network"]')), 15000);
        let myNetworkLink = await driver.findElement(By.xpath('//span[text()="My Network"]/parent::a'));
        await myNetworkLink.click();

        async function refreshAndClick() {
            try {
                await driver.navigate().refresh();
                await driver.sleep(5000);
                await clickConnectButtons(driver);
            } catch (error) {
                console.log('Error during refresh or clicking:', error);
            }
        }

        setInterval(refreshAndClick, 60000);

    } catch (error) {
        console.log('Error:', error);
    }
}

autoConnect();
