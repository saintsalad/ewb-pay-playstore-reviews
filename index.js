import express from "express";
// import fetch from "node-fetch";
import cors from "cors";
import gplay from "google-play-scraper";
import nodemailer from "nodemailer";
import { generateEmailHTML } from "./helper.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define a route to render a simple EJS template
app.get("/", (req, res) => {
  res.render("index", { title: "Express App with EJS", message: "" });

  gplay
    .reviews({
      appId: "com.mobile.legends",
      sort: gplay.sort.NEWEST,
      num: 100,
    })
    .then((data) => {
      let arr = [];
      arr = data.data.filter((item) => item.score === 5 || item.score === 4);
      arr = arr.slice(0, 10);

      if (arr && Array.isArray(arr)) {
        arr.forEach((arr) => {
          const reviewDate = new Date(arr.date);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          if (
            reviewDate.getFullYear() === yesterday.getFullYear() &&
            reviewDate.getMonth() === yesterday.getMonth() &&
            reviewDate.getDate() === yesterday.getDate()
          ) {
            console.log("New");
            return;
          } else {
            console.log("No New");
            return;
          }
        });
      }
    });
});

// Route to handle the AJAX request
app.post("/trigger-function", (req, res) => {
  gplay
    .reviews({
      appId: "com.ewb.contactless",
      sort: gplay.sort.NEWEST,
      num: 100,
    })
    .then((data) => {
      let arr = [];
      arr = data.data.filter((item) => item.score === 5 || item.score === 4);
      arr = arr.slice(0, 10);
      console.log(arr.length);
      res.json(arr);

      let mailOptions = {
        from: '"EASTWEST - WEB APP" <sender_email@gmail.com>', // Sender name and address
        to: "cslacson@eastwestbanker.com", // List of recipients
        subject: "Playstore Reviews", // Subject line
        html: generateEmailHTML(arr),
      };

      // Send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      });
    });
});

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "caleadrian.lacson@gmail.com",
    pass: "tdil xwvm mite nood",
  },
});

const reviews = [
  {
    id: "5de5f115-d337-4a36-bf2b-16761ffac594",
    userName: "James Philip Paliza",
    userImage:
      "https://play-lh.googleusercontent.com/a-/ALV-UjW7iL7sQ2sJ_NYv210lFIxQ3Mt0EOdYh4MtAt99XDgbOXC4",
    date: "2023-12-21T08:41:04.272Z",
    score: 5,
    scoreText: "5",
    url: "https://play.google.com/store/apps/details?id=com.ewb.contactless&reviewId=5de5f115-d337-4a36-bf2b-16761ffac594",
    title: null,
    text: "I've been using this app since November 2023 and so far I have a good experienc using this. Hopefully they also allow to add using of JCB and Mastercard to this mobile application.",
    replyDate: null,
    replyText: null,
    version: "1.0.0-RC4-1-12",
    thumbsUp: 2,
    criterias: [],
  },
  {
    id: "956f9331-1637-48ed-a9c7-1d966d81e391",
    userName: "Alvin Ryan Lopez",
    userImage:
      "https://play-lh.googleusercontent.com/a-/ALV-UjVMA3Aia9xzDqs608sSrpcgxnWCDfbNZ44AagW-SauCXQ",
    date: "2023-11-30T04:50:21.714Z",
    score: 5,
    scoreText: "5",
    url: "https://play.google.com/store/apps/details?id=com.ewb.contactless&reviewId=956f9331-1637-48ed-a9c7-1d966d81e391",
    title: null,
    text: "very convenient",
    replyDate: null,
    replyText: null,
    version: "1.0.0-RC4-1-12",
    thumbsUp: 0,
    criterias: [],
  },
];

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
