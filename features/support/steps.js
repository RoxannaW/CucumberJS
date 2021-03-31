const {
  Given,
  When,
  Then,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} = require("cucumber");
const { chromium } = require("playwright");
//const { expect } = require("expect-playwright");
// eslint-disable-next-line no-unused-vars
const should = require("chai").should();

const { assert } = require("console");
const Assert = require("assert");
const { expect } = require("chai");

let page;
let browser;

setDefaultTimeout(50 * 1000);

BeforeAll(async () => {
  browser = process.env.GITHUB_ACTIONS
    ? await chromium.launch({ headless: true })
    : await chromium.launch({ headless: false });
  page = await browser.newPage();
});

AfterAll(() => {
  if (!page.isClosed()) {
    browser.close();
  }
});

Given("Navigate to the webpage", async () => {
  await page
    .goto(
      "https://www.belastingdienst.nl/wps/wcm/connect/nl/auto-en-vervoer/content/hulpmiddel-motorrijtuigenbelasting-berekenen",
      {
        waitUntil: "networkidle0",
      }
    )
    .catch(() => {});
});

When("I am on the page", async () => {
  await page.waitForSelector("h1");
  const title = await page.title();

  title.should.eql("Hoeveel motorrijtuigenbelasting moet ik betalen?");
});

When("I provide the data for motor", async () => {
  await page.click("//input[@id='V1-1_True']");
  await page.selectOption("select#V1-2", "7");
  await page.click("//input[@id='V1-16_False']");
  await page.selectOption("select#V1-5", "FL");
  await page.click("//button[@id='butResults']");
});

Then(
  "I should see the result of the amount of vehicle tax I should pay",
  async function () {
    const textContent = await page.$eval(
      "#divE1-2 > p:nth-child(1)",
      (el) => el.textContent
    );
    expect(textContent).to.equal(
      "Motorrijtuigenbelasting per tijdvak van 3 maanden: € 31."
    );
  }
);
