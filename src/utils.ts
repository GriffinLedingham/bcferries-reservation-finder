import puppeteer, { PuppeteerLaunchOptions } from "puppeteer";

export function formatTerminalNames(terminalName: string | undefined) {
  if (!terminalName) {
    throw new Error("Terminal name not provided");
  }
  switch (terminalName) {
    case "tsawassen":
      return "Vancouver (Tsawwassen)";
    case "swartzbay":
      return "Victoria (Swartz Bay)";
    case "horseshoebay":
      return "Vancouver (Horseshoe Bay)";
    case "departurebay":
      return "Nanaimo (Departure Bay)";
    case "dukepoint":
      return "Nanaimo (Duke Point)";
    default:
      throw new Error("Invalid terminal name");
  }
}

export async function getPuppeteerPage(
  puppeteerConfig: PuppeteerLaunchOptions = {
    headless: "new",
  },
  allowedRequest: Function
) {
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    try {
      if (allowedRequest(req)) {
        req.continue();
      } else {
        req.abort();
      }
    } catch (e) {
      console.log(e);
    }
  });

  const timeout = 30000;
  page.setDefaultTimeout(timeout);

  {
    const targetPage = page;
    await targetPage.setViewport({
      width: 1235,
      height: 1186,
    });
  }

  return { browser, page };
}

export async function waitForSelectors(
  selectors: any,
  frame: any,
  options: any
) {
  for (const selector of selectors) {
    try {
      return await waitForSelector(selector, frame, options);
    } catch (err) {
      console.error(err);
    }
  }
  throw new Error(
    "Could not find element for selectors: " + JSON.stringify(selectors)
  );
}

export async function scrollIntoViewIfNeeded(
  selectors: any,
  frame: any,
  timeout: any
) {
  const element = await waitForSelectors(selectors, frame, {
    visible: false,
    timeout,
  });
  if (!element) {
    throw new Error("The element could not be found.");
  }
  await waitForConnected(element, timeout);
  const isInViewport = await element.isIntersectingViewport({
    threshold: 0,
  });
  if (isInViewport) {
    return;
  }
  await element.evaluate((element: any) => {
    element.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "auto",
    });
  });
  await waitForInViewport(element, timeout);
}

export async function waitForConnected(element: any, timeout: any) {
  await waitForFunction(async () => {
    return await element.getProperty("isConnected");
  }, timeout);
}

export async function waitForInViewport(element: any, timeout: any) {
  await waitForFunction(async () => {
    return await element.isIntersectingViewport({ threshold: 0 });
  }, timeout);
}

export async function waitForSelector(selector: any, frame: any, options: any) {
  if (!Array.isArray(selector)) {
    selector = [selector];
  }
  if (!selector.length) {
    throw new Error("Empty selector provided to waitForSelector");
  }
  let element = null;
  for (let i = 0; i < selector.length; i++) {
    const part = selector[i];
    if (element) {
      element = await element.waitForSelector(part, options);
    } else {
      element = await frame.waitForSelector(part, options);
    }
    if (!element) {
      throw new Error("Could not find element: " + selector.join(">>"));
    }
    if (i < selector.length - 1) {
      element = (
        await element.evaluateHandle((el: any) =>
          el.shadowRoot ? el.shadowRoot : el
        )
      ).asElement();
    }
  }
  if (!element) {
    throw new Error("Could not find element: " + selector.join("|"));
  }
  return element;
}

export async function waitForElement(step: any, frame: any, timeout: any) {
  const {
    count = 1,
    operator = ">=",
    visible = true,
    properties,
    attributes,
  } = step;
  const compFn = {
    "==": (a: any, b: any) => a === b,
    ">=": (a: any, b: any) => a >= b,
    "<=": (a: any, b: any) => a <= b,
  }[operator as unknown as string] as Function;
  await waitForFunction(async () => {
    const elements = await querySelectorsAll(step.selectors, frame);
    let result = compFn(elements.length, count);
    const elementsHandle = await frame.evaluateHandle((...elements: any[]) => {
      return elements;
    }, ...elements);
    await Promise.all(elements.map((element: any) => element.dispose()));
    if (result && (properties || attributes)) {
      result = await elementsHandle.evaluate(
        (
          elements: any,
          properties: any,
          attributes: { [s: string]: unknown } | ArrayLike<unknown>
        ) => {
          for (const element of elements) {
            if (attributes) {
              for (const [name, value] of Object.entries(attributes)) {
                if (element.getAttribute(name) !== value) {
                  return false;
                }
              }
            }
            if (properties) {
              if (!isDeepMatch(properties, element)) {
                return false;
              }
            }
          }
          return true;

          function isDeepMatch(a: unknown, b: { [x: string]: any }) {
            if (a === b) {
              return true;
            }
            if ((a && !b) || (!a && b)) {
              return false;
            }
            if (!(a instanceof Object) || !(b instanceof Object)) {
              return false;
            }
            for (const [key, value] of Object.entries(a)) {
              if (!isDeepMatch(value, b[key])) {
                return false;
              }
            }
            return true;
          }
        },
        properties,
        attributes
      );
    }
    await elementsHandle.dispose();
    return result === visible;
  }, timeout);
}

export async function querySelectorsAll(selectors: any, frame: any) {
  for (const selector of selectors) {
    const result = await querySelectorAll(selector, frame);
    if (result.length) {
      return result;
    }
  }
  return [];
}

export async function querySelectorAll(
  selector: string | any[],
  frame: { $$: (arg0: any) => any[] | PromiseLike<any[]> }
) {
  if (!Array.isArray(selector)) {
    selector = [selector];
  }
  if (!selector.length) {
    throw new Error("Empty selector provided to querySelectorAll");
  }
  let elements = [];
  for (let i = 0; i < selector.length; i++) {
    const part = selector[i];
    if (i === 0) {
      elements = await frame.$$(part);
    } else {
      const tmpElements: any[] = elements;
      elements = [];
      for (const el of tmpElements) {
        elements.push(...(await el.$$(part)));
      }
    }
    if (elements.length === 0) {
      return [];
    }
    if (i < selector.length - 1) {
      const tmpElements = [];
      for (const el of elements) {
        const newEl = (
          await el.evaluateHandle((el: any) =>
            el.shadowRoot ? el.shadowRoot : el
          )
        ).asElement();
        if (newEl) {
          tmpElements.push(newEl);
        }
      }
      elements = tmpElements;
    }
  }
  return elements;
}

export async function waitForFunction(
  fn: { (): Promise<any>; (): Promise<any>; (): Promise<boolean>; (): any },
  timeout: number | undefined
) {
  let isActive = true;
  const timeoutId = setTimeout(() => {
    isActive = false;
  }, timeout);
  while (isActive) {
    const result = await fn();
    if (result) {
      clearTimeout(timeoutId);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out");
}

export async function changeSelectElement(
  element: {
    select: (arg0: any) => any;
    evaluateHandle: (arg0: (e: any) => void) => any;
  },
  value: any
) {
  await element.select(value);
  await element.evaluateHandle((e) => {
    e.blur();
    e.focus();
  });
}

export async function changeElementValue(
  element: {
    focus: () => any;
    evaluate: (arg0: (input: any, value: any) => void, arg1: any) => any;
  },
  value: any
) {
  await element.focus();
  await element.evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

export async function typeIntoElement(
  element: {
    evaluate: (arg0: (input: any, newValue: any) => any, arg1: any) => any;
    type: (arg0: any) => any;
  },
  value: any
) {
  const textToType = await element.evaluate((input, newValue) => {
    if (
      newValue.length <= input.value.length ||
      !newValue.startsWith(input.value)
    ) {
      input.value = "";
      return newValue;
    }
    const originalValue = input.value;
    input.value = "";
    input.value = originalValue;
    return newValue.substring(originalValue.length);
  }, value);
  await element.type(textToType);
}
