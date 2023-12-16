const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Set a larger viewport size
  await page.setViewport({ width: 1366, height: 18000 }); // Change width and height as needed

  const AJAX_LINKS_SELECTOR = "#ajaxTable0 > tbody > tr:nth-child(2) > td > a";
  const TABLE_BODY =
    "#ajaxTable0 > tbody > tr:nth-child(2) > td > div > table > tbody";

  try {
    await page.goto("https://terraria.fandom.com/wiki/Recipes", {
      waitUntil: "domcontentloaded",
    });

    console.log("Step 1: Waiting for the element to be present in the DOM...");
    await page.waitForSelector(AJAX_LINKS_SELECTOR);
    console.log("Step 2: Element is present.");

    // Get the element handle
    const element = await page.$(AJAX_LINKS_SELECTOR);
    console.log("Step 3: Got the element handle.");

    // Scroll the element into view
    await element.scrollIntoViewIfNeeded({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    console.log("Step 4: Scrolled the element into view.");

    // Click the element
    await element.click();
    await page.waitForTimeout(3000);
    const tableBody = await page.$(TABLE_BODY);

    if (tableBody) {
      // Get all <tr> elements inside the table body
      const trElements = await tableBody.$$("tr");

      for (const trElement of trElements) {
        // Get all <td> elements inside each <tr>
        const tdElements = await trElement.$$("td");
        const recipeItems = [];

        const el1 = await tdElements[0].$(
          "span > span > span:nth-child(1) > a"
        );
        const el2 = await tdElements[1].$$("ul > li");
        // console.log(el2);
        // #ajaxTable0 > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(1) > td.result > span > span > span:nth-child(1) > a
        if (el1) {
          const el1Text = await page.evaluate((el) => el.textContent, el1);

          console.log("Text content:", el1Text);
        }

        if (el2) {
          for (const listItem of el2) {
            const li = await listItem.$(
              "span.i > span:nth-child(2) > span:nth-child(1) > a"
            );
            const amount = await listItem.$("span.am");

            let recipeItem = await page.evaluate((el) => el.textContent, li);

            if (amount) {
              const amountItem = await page.evaluate(
                (el) => el.textContent,
                amount
              );
              recipeItem += ` (${amountItem})`;
            } else {
              recipeItem += ` (1)`;
            }

            recipeItems.push(recipeItem);
          }
        }
        console.log(recipeItems);
      }
    } else {
      console.log("Table body element not found.");
    }

    console.log("Step 5: Clicked the element.");

    // Wait for a certain duration to inspect the result visually
    console.log("Inspecting the result for 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000)); // 5 seconds (adjust as needed)

    console.log("Script completed successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
    console.log("Step 6: Browser closed.");
  }
}

run();
