const puppeteer = require("puppeteer");
const imageDownloader = require("node-image-downloader");

const fs = require("fs");

let args = {
  thread: process.argv[2],
  page: !process.argv[3] ? "" : process.argv[3],
};

if (!args.thread) {
  console.log("node sanic.js [thread] [page]");
  process.exit(1);
}

const scraper = (t, p) => {
  const thread = t;
  const numPage = p;

  const url = `https://www.kindpng.com/free/${thread}/${
    numPage == 1 ? "" : numPage + "/"
  }`;
  console.log({ url });
  let srcs;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await autoScroll(page);

    srcs = await page.evaluate(() => {
      data = Array.from(document.querySelectorAll("img.lazy")).map((a) => {
        const regex1 = /[/]p./i;
        const regex2 = /[/]s[/]/i;
        let r = a.dataset.original.replace(regex1, "/www.");
        r = r.replace(regex2, "/b/");
        return r;
      });

      return data;
    });
    console.log(srcs);

    await browser.close();

    if (!fs.existsSync(`./images/threads/${thread}`)) {
      fs.mkdirSync(`./images/threads/${thread}`);
    }
    if (
      !fs.existsSync(
        `./images/threads/${thread}/${numPage === "" ? 1 : numPage}`
      )
    )
      fs.mkdirSync(
        `./images/threads/${thread}/${numPage === "" ? 1 : numPage}`
      );

    let options = {
      imgs: srcs.map((src) => {
        return { uri: src };
      }),
      dest: `./images/threads/${thread}/${numPage === "" ? 1 : numPage}`,
    };

    console.log("Images count : " + options.imgs.length);
    console.log(options);

    imageDownloader(options)
      .then((info) => {
        console.log("all done", info);
      })
      .catch((error, response, body) => {
        console.log("something goes bad!");
        console.log(error);
      });
  })();
  async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
};

const createDir = () => {
  if (!fs.existsSync(`./images`)) {
    fs.mkdirSync(`./images/`);
  }

  if (!fs.existsSync("./images/threads")) {
    fs.mkdirSync("./images/threads");
  }
};

createDir();
scraper(args.thread, args.page);
