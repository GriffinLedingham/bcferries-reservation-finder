import { HTTPRequest } from "puppeteer";
import { scrapeReservations } from "./flows/checkReservation";
import { formatTerminalNames, getPuppeteerPage } from "./utils";
import { PuppeteerLaunchOptions } from "puppeteer";
import puppeteerOptions from "../puppeteer.config.json";

const departureTerminal = formatTerminalNames(process.env.DEPARTURE);
const arrivalTerminal = formatTerminalNames(process.env.ARRIVAL);
const numberAdults = process.env.ADULTS;
if (!numberAdults) throw new Error("Number of adults not provided");
const numberChildren = process.env.CHILDREN || "0";
const numberInfants = process.env.INFANTS || "0";
const departureDate = process.env.DATE;
if (!departureDate) throw new Error("Departure date not provided");

// validate that date is mm/dd/yyyy
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
if (!dateRegex.test(departureDate) || new Date(departureDate) == null) {
  throw new Error("Invalid date format. Use mm/dd/yyyy");
}

console.log("\nDeparture Terminal:   " + departureTerminal);
console.log("Arrival Terminal:     " + arrivalTerminal);
console.log("Number of Adults:     " + numberAdults);
console.log("Number of Children:   " + numberChildren);
console.log("Number of Infants:    " + numberInfants);
console.log("Departure Date:       " + departureDate + "\n");

// Ignores a bad long-polling request that is made by the website
const allowedRequest = (req: HTTPRequest) =>
  req.url().indexOf("container_") === -1;

(async () => {
  const { page, browser } = await getPuppeteerPage(
    puppeteerOptions as PuppeteerLaunchOptions,
    allowedRequest
  );
  scrapeReservations(
    {
      departureTerminal,
      arrivalTerminal,
      departureDate,
      page,
      browser,
      timeout: 30000,
      numberAdults: parseInt(numberAdults),
      ...(numberChildren && { numberChildren: parseInt(numberChildren) }),
      ...(numberInfants && { numberInfants: parseInt(numberInfants) }),
    },
    () => {
      console.log("Queueing up next scrape in 1-5 minutes...");
    }
  );

  setInterval(async () => {
    const { page, browser } = await getPuppeteerPage(
      puppeteerOptions as PuppeteerLaunchOptions,
      allowedRequest
    );
    scrapeReservations(
      {
        departureTerminal,
        arrivalTerminal,
        departureDate,
        page,
        browser,
        timeout: 30000,
        numberAdults: parseInt(numberAdults),
        ...(numberChildren && { numberChildren: parseInt(numberChildren) }),
        ...(numberInfants && { numberInfants: parseInt(numberInfants) }),
      },
      () => {
        console.log("Queueing up next scrape in 1-5 minutes...\n");
      }
    );
    console.log("Queueing up next scrape in 1-5 minutes...\n");
    // set timeout using random number between 1 and 5 minutes calling scrapeReservations each time
  }, Math.floor(Math.random() * 300000) + 60000);
})();
