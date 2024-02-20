import express from "express";
// import fetch from "node-fetch";
import cors from "cors";
import gplay from "google-play-scraper";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;

app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define a route to render a simple EJS template
app.get("/", (req, res) => {
  res.render("index", { title: "Express App with EJS", message: "" });
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
        from: '"EWB - Web App" <sender_email@gmail.com>', // Sender name and address
        to: "keyladrian7@gmail.com", // List of recipients
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

function myFunction() {
  console.log("Function triggered from EJS");
  // Perform actions you want to do when the function is triggered
}

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "caleadrian.lacson@gmail.com", // Your email address
    pass: "tdil xwvm mite nood", // Your email password or application-specific password if using Gmail
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

// Setup email data with unicode symbols
function generateEmailHTML(reviews) {
  let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
              /* Minimalist review design */
              .review {
                  border: 1px solid #ccc;
                  padding: 10px;
                  margin-bottom: 15px;
                  border-radius: 5px;
              }
              .review p {
                  font-size: 12px;
                  margin: 2px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Hello!</h1>
              <p>This is a sample email template.</p>
              <div id="reviews-container">
  `;

  if (reviews && Array.isArray(reviews)) {
    reviews.forEach((review) => {
      htmlContent += `
              <div class="review">
                  <p><strong>Name:</strong> ${review.userName}</p>
                  <p><strong>Date Posted:</strong> ${new Date(
                    review.date
                  ).toLocaleDateString()}</p>
                  <p><strong>Score:</strong> ${review.score}</p>
                  <p><strong>Message:</strong> ${review.text}</p>
              </div>
          `;
    });
  } else {
    htmlContent += `<p>No reviews available.</p>`;
  }

  htmlContent += `
              </div>
          </div>
      </body>
      </html>
  `;

  return htmlContent;
}

// app.listen(PORT, () => {
//   console.log(`Proxy server is running on port ${PORT}`);
// });

app.listen(8080, "0.0.0.0", () => {
  console.log("Server running at http://0.0.0.0:8080/");
});

// app.listen(PORT, () => {
//   console.log(`Proxy server is running on port ${PORT}`);
// });

async function getReviews() {
  gplay
    .reviews({
      appId: "com.ewb.contactless",
      sort: gplay.sort.NEWEST,
      num: 1,
    })
    .then((data) => {
      const arr = [];
      arr = data;
      arr.map((item) => {
        if (item.score == 4 || item.score == 5) {
          return item;
        }
      });
    });
}
