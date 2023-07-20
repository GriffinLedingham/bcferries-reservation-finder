import { HTTPRequest } from "puppeteer";
import { scrapeReservations } from "./flow/checkReservation";
import { formatTerminalNames, getPuppeteerPage } from "./utils";

const departureTerminal = formatTerminalNames(process.env.DEPARTURE);
const arrivalTerminal = formatTerminalNames(process.env.ARRIVAL);
const departureDate = process.env.DATE;
if (!departureDate) throw new Error("Departure date not provided");

console.log("\nDeparture Terminal:   " + departureTerminal);
console.log("Arrival Terminal:     " + arrivalTerminal);
console.log("Departure Date:       " + departureDate + "\n");

// Ignores a bad long-polling request that is made by the website
const allowedRequest = (req: HTTPRequest) =>
  req.url().indexOf("container_") === -1;

(async () => {
  const { page, browser } = await getPuppeteerPage(allowedRequest);
  scrapeReservations({
    departureTerminal,
    arrivalTerminal,
    departureDate,
    page,
    browser,
    timeout: 30000,
  });

  setInterval(async () => {
    const { page, browser } = await getPuppeteerPage(allowedRequest);
    scrapeReservations({
      departureTerminal,
      arrivalTerminal,
      departureDate,
      page,
      browser,
      timeout: 30000,
    });
    // set timeout using random number between 1 and 5 minutes calling doScrape each time
  }, Math.floor(Math.random() * 300000) + 60000);
})();
