import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";
import gplay from "google-play-scraper";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3001;

// app.use(cors());

app.get("/", async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "caleadrian.lacson@gmail.com", // Your email address
    pass: "tdil xwvm mite nood", // Your email password or application-specific password if using Gmail
  },
});

// Setup email data with unicode symbols
let mailOptions = {
  from: '"EWB - Web App" <sender_email@gmail.com>', // Sender name and address
  to: "keyladrian7@gmail.com", // List of recipients
  subject: "Hello ✔", // Subject line
  text: "Hello world?", // Plain text body
  html: "<b>Hello world?</b>", // HTML body
};

// app.listen(PORT, () => {
//   console.log(`Proxy server is running on port ${PORT}`);
// });

app.listen(8080, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:8080/');
});


//   gplay
//     .reviews({
//       appId: "com.ewb.contactless",
//       sort: gplay.sort.NEWEST,
//       num: 2,
//     })
//     .then((data) => {
//       console.log(data);
//     });

//   // Send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log("Message sent: %s", info.messageId);
//   });
