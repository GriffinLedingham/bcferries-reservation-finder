# bc-ferries-booking

A puppeteer script for checking available reservation times on BC Ferries sailing for a given date, departure terminal and arrival terminal.

## Setup

- `yarn`

## Usage

Format:

- `DEPARTURE=<tsawassen|swartzbay|dukepoint|departurebay> ARRIVAL=<tsawassen|swartzbay|dukepoint|departurebay> DATE=<mm/dd/yyyy> ADULTS=<number> [CHILDREN=<number>] [INFANTS=<number>] yarn ts-node src/index.ts`

Example:

- `DEPARTURE=tsawassen ARRIVAL=swartzbay DATE=07/20/2023 ADULTS=2 yarn ts-node src/index.ts`
