//test_serversup.js
//Developed by Excelon Development for WonderProxy, 2021
//By Matt Heusser (Matt@xndev.com) and David Hoppe 
//Please feel free to use, or re-use/re-mix/publish with attribution
const should = require('chai').should();

const {Builder, By, until} = require('selenium-webdriver');
const {NoSuchElementError} = require('selenium-webdriver/lib/error');

describe('WonderProxy website', function () {
  // Browser based tests tend to exceed the default timeout
  // Set a longer timeout here which will be applied to all the tests:
  this.timeout(10000);

   describe('Server status is up ', function () {
      const serverNames = ['lansing', 'orlando','perth','knoxville'];
      serverNames.forEach(serverName => {
        it(`should show "up" status for ${serverName}`, async function () {
          await runWithDriver(async function (driver) {
            await driver.get('https://wonderproxy.com/servers/status');
            const statusText = await getServerStatus(driver, serverName);
            statusText.should.include('up');
          });
        });
      });
    });
});

async function runWithDriver(test) {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await test(driver);
  } finally {
    await driver.quit();
  }
}

async function getServerStatus(driver, serverName) {
  try {
    await scrollServerIntoView(driver, serverName);
    const serverStatusElement = await driver.findElement(By.xpath(`//a[@href='/servers/${serverName}']/ancestor::li/span[5]`));
    return await serverStatusElement.getText();
  } catch (error) {
    if (error instanceof NoSuchElementError) {
      return `Unable to locate server: '${serverName}' on page`;
    }
    throw error;
  }
}

async function scrollServerIntoView(driver, serverName) {
  const serverStatusLink = await driver.findElement(By.xpath(`//a[@href='/servers/${serverName}']`));
  await driver.executeScript("arguments[0].scrollIntoView(true);", serverStatusLink);
}



