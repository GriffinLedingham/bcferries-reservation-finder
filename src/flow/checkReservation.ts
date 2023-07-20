import { Browser, Page } from "puppeteer";
import cheerio from "cheerio";
import notifier from "node-notifier";
import { scrollIntoViewIfNeeded, waitForSelectors } from "../utils";

function findReservation(html: string) {
  const $ = cheerio.load(html);

  const availableSailingsText: string[] = [];
  $(".view-fare-btn").each((i, el) => {
    availableSailingsText.push(
      $(el)
        .closest(".p-card")
        .text()
        .split("View fares")[0]
        .replace(/\n/g, "")
        .replace(/\s\s+/g, " ")
    );
  });

  const date = $(".selacted-date-text")
    .text()
    .replace(/\n/g, "")
    .replace(/\s\s+/g, " ")
    .replace(" Departure date:", "");
  const availableSailings = availableSailingsText.map((sailing) => {
    return {
      date: date.trim(),
      time: sailing.split(" DEPART ")[1].split(" 1h")[0],
      cost: sailing.split("Total From ")[1],
    };
  });

  console.log(date.trim());
  console.log(availableSailings);
  console.log("");
  if (availableSailings.length) {
    notifier.notify(
      {
        title: `Found ${availableSailings.length} sailings on ${date.trim()}`,
        message: availableSailings.map((sailing) => sailing.time).join(", "),
        wait: true,
      },
      (err, response) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } else {
    notifier.notify(
      {
        title: `No sailings found on ${date.trim()}`,
        message: "No sailings found",
      },
      (err, response) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
}

export function scrapeReservations(input: {
  departureTerminal: String;
  arrivalTerminal: String;
  departureDate: String;
  browser: Browser;
  page: Page;
  timeout: number;
}) {
  const {
    departureTerminal,
    arrivalTerminal,
    departureDate,
    browser,
    page,
    timeout,
  } = input;

  console.log(
    `Checking reservations for ${departureTerminal} to ${arrivalTerminal} on ${departureDate}...`
  );
  (async () => {
    {
      const targetPage = page;
      const promises = [];
      promises.push(targetPage.waitForNavigation());
      await targetPage.goto("https://www.bcferries.com/");
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          ["div.row-fluid > div:nth-of-type(1) span.dropdown-text > span"],
          ['xpath///*[@id="ui-id-5"]/span[2]/span'],
          [
            "pierce/div.row-fluid > div:nth-of-type(1) span.dropdown-text > span",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["div.row-fluid > div:nth-of-type(1) span.dropdown-text > span"],
          ['xpath///*[@id="ui-id-5"]/span[2]/span'],
          [
            "pierce/div.row-fluid > div:nth-of-type(1) span.dropdown-text > span",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 124.1015625,
          y: 9.640625,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [`aria/${departureTerminal}`],
          [
            "div.row-fluid > div:nth-of-type(1) ul:nth-of-type(2) > li:nth-of-type(1) > a",
          ],
          ['xpath///*[@id="ui-id-6"]/div/ul[2]/li[1]/a'],
          [
            "pierce/div.row-fluid > div:nth-of-type(1) ul:nth-of-type(2) > li:nth-of-type(1) > a",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [`aria/${departureTerminal}`],
          [
            "div.row-fluid > div:nth-of-type(1) ul:nth-of-type(2) > li:nth-of-type(1) > a",
          ],
          ['xpath///*[@id="ui-id-6"]/div/ul[2]/li[1]/a'],
          [
            "pierce/div.row-fluid > div:nth-of-type(1) ul:nth-of-type(2) > li:nth-of-type(1) > a",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 76.1015625,
          y: 24.0625,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          ["div.row-fluid > div:nth-of-type(2) span.dropdown-text > span"],
          ['xpath///*[@id="ui-id-19"]/span[2]/span'],
          [
            "pierce/div.row-fluid > div:nth-of-type(2) span.dropdown-text > span",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["div.row-fluid > div:nth-of-type(2) span.dropdown-text > span"],
          ['xpath///*[@id="ui-id-19"]/span[2]/span'],
          [
            "pierce/div.row-fluid > div:nth-of-type(2) span.dropdown-text > span",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 47.65625,
          y: 8.640625,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [`aria/${arrivalTerminal}`],
          ["div.row-fluid > div:nth-of-type(2) ul:nth-of-type(1) a"],
          ['xpath///*[@id="ui-id-20"]/div/ul[1]/li/a'],
          ["pierce/div.row-fluid > div:nth-of-type(2) ul:nth-of-type(1) a"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [`aria/${arrivalTerminal}`],
          ["div.row-fluid > div:nth-of-type(2) ul:nth-of-type(1) a"],
          ['xpath///*[@id="ui-id-20"]/div/ul[1]/li/a'],
          ["pierce/div.row-fluid > div:nth-of-type(2) ul:nth-of-type(1) a"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 69.65625,
          y: 29.6484375,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          ["li.ui-depart i"],
          ['xpath///*[@id="js-roundtrip"]/ul/li[1]/a/div/i'],
          ["pierce/li.ui-depart i"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["li.ui-depart i"],
          ['xpath///*[@id="js-roundtrip"]/ul/li[1]/a/div/i'],
          ["pierce/li.ui-depart i"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 19.390625,
          y: 10.1640625,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [`aria/${departureDate}[role="link"]`],
          ["#home tr:nth-of-type(4) > td:nth-of-type(7) > a"],
          [
            'xpath///*[@id="check-in-datepicker"]/div/table/tbody/tr[4]/td[7]/a',
          ],
          ["pierce/#home tr:nth-of-type(4) > td:nth-of-type(7) > a"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [`aria/${departureDate}[role="link"]`],
          ["#home tr:nth-of-type(4) > td:nth-of-type(7) > a"],
          [
            'xpath///*[@id="check-in-datepicker"]/div/table/tbody/tr[4]/td[7]/a',
          ],
          ["pierce/#home tr:nth-of-type(4) > td:nth-of-type(7) > a"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 18.5,
          y: 17.265625,
        },
      });
    }
    {
      const targetPage = page;
      const promises = [];
      promises.push(targetPage.waitForNavigation());
      await scrollIntoViewIfNeeded(
        [
          ["aria/Continue"],
          ["#y_confirmaddpassenger"],
          ['xpath///*[@id="y_confirmaddpassenger"]'],
          ["pierce/#y_confirmaddpassenger"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["aria/Continue"],
          ["#y_confirmaddpassenger"],
          ['xpath///*[@id="y_confirmaddpassenger"]'],
          ["pierce/#y_confirmaddpassenger"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 60.1875,
          y: 24.0390625,
        },
      });
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[1]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[1]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 10.5,
          y: 17.96875,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[1]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[1]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(1) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 10.5,
          y: 17.96875,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[3]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[3]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 13.84375,
          y: 9.96875,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[3]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          [
            "div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
          ['xpath///*[@id="ui-id-2"]/div[2]/div[3]/div/span[2]/button'],
          [
            "pierce/div:nth-of-type(3) div.mb-3 > div:nth-of-type(3) span:nth-of-type(2) > button",
          ],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 13.84375,
          y: 9.96875,
        },
      });
    }
    {
      const targetPage = page;
      const promises = [];
      promises.push(targetPage.waitForNavigation());
      await scrollIntoViewIfNeeded(
        [
          ["aria/Continue"],
          ["#proceed_to_vehicle_selection_btn_div > button"],
          ['xpath///*[@id="proceed_to_vehicle_selection_btn_div"]/button'],
          ["pierce/#proceed_to_vehicle_selection_btn_div > button"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["aria/Continue"],
          ["#proceed_to_vehicle_selection_btn_div > button"],
          ['xpath///*[@id="proceed_to_vehicle_selection_btn_div"]/button'],
          ["pierce/#proceed_to_vehicle_selection_btn_div > button"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 80.171875,
          y: 15.984375,
        },
      });
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          ["aria/7 ft. (2.13 m) and under"],
          ["#under7Height_0"],
          ['xpath///*[@id="under7Height_0"]'],
          ["pierce/#under7Height_0"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["aria/7 ft. (2.13 m) and under"],
          ["#under7Height_0"],
          ['xpath///*[@id="under7Height_0"]'],
          ["pierce/#under7Height_0"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 9.5,
          y: 8.3125,
        },
      });
    }
    {
      const targetPage = page;
      await scrollIntoViewIfNeeded(
        [
          ["aria/Under 20 ft. (6.10 m)"],
          ["#under20Length_0"],
          ['xpath///*[@id="under20Length_0"]'],
          ["pierce/#under20Length_0"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["aria/Under 20 ft. (6.10 m)"],
          ["#under20Length_0"],
          ['xpath///*[@id="under20Length_0"]'],
          ["pierce/#under20Length_0"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 5.5,
          y: 12.3125,
        },
      });
    }
    {
      const targetPage = page;
      const promises = [];
      promises.push(targetPage.waitForNavigation());
      await scrollIntoViewIfNeeded(
        [
          ["aria/Continue"],
          ["div:nth-of-type(4) div.container button"],
          ['xpath///*[@id="y_fareFinderForm"]/div[3]/div/div/button'],
          ["pierce/div:nth-of-type(4) div.container button"],
        ],
        targetPage,
        timeout
      );
      const element = await waitForSelectors(
        [
          ["aria/Continue"],
          ["div:nth-of-type(4) div.container button"],
          ['xpath///*[@id="y_fareFinderForm"]/div[3]/div/div/button'],
          ["pierce/div:nth-of-type(4) div.container button"],
        ],
        targetPage,
        { timeout, visible: true }
      );
      await element.click({
        offset: {
          x: 176.171875,
          y: 21.6171875,
        },
      });
      await Promise.all(promises);
    }

    const pageHtml = await page.content();

    findReservation(pageHtml);

    await browser.close();
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
