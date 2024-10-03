import express from "express";
// import fetch from "node-fetch";
import cors from "cors";
import gplay from "google-play-scraper";
import { generateEmailHTML, getAppDetailsViaCheerio } from "./helper.js";

const app = express();
const PORT = process.env.PORT || 3001;
const appId = "com.ewb.contactless";

app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("view engine", "ejs");

// Define a route to render a simple EJS template
app.get("/", (req, res) => {
  let items = req.query.items;

  try {
    gplay
      .reviews({
        appId: "com.ewb.contactless",
        sort: gplay.sort.NEWEST,
        num: 100,
      })
      .then(async (data) => {
        let arr = [];
        arr = data.data.filter((item) => item.score === 5 || item.score === 4);
        arr = arr.slice(0, items);

        const app = await gplay.app({ appId: appId });
        let appScore = "";
        const appVersion = app.version;

        const result = await getAppDetailsViaCheerio(appId);
        if (result) {
          appScore = result.rating;
        }

        const htmlEmailStr = generateEmailHTML(arr, appScore, appVersion);

        res.status(200).json({ htmlEmailStr: htmlEmailStr });
      });
  } catch (e) {
    res.status(500).json({ Exception: e });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
