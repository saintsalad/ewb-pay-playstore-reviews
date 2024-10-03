import axios from "axios";
import * as cheerio from "cheerio";

export function generateEmailHTML(reviews, appScore, appVersion) {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EW Pay - Latest Playstore Reviews</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #B2006F;
                color: white;
                padding: 30px 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
                position: relative;
                overflow: hidden;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                position: relative;
                z-index: 2;
            }
            .header::before, .header::after {
                content: "";
                position: absolute;
                width: 200px;
                height: 200px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }
            .header::before {
                top: -100px;
                left: -100px;
            }
            .header::after {
                bottom: -100px;
                right: -100px;
            }
            .subheader {
                background-color: #8C0058;
                color: white;
                padding: 10px 20px;
                text-align: center;
                font-size: 16px;
            }
            .content {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 0 0 5px 5px;
            }
            .review {
                background-color: white;
                border: 1px solid #ddd;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 5px;
            }
            .review-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .user-name {
                font-weight: bold;
                font-size: 16px;
                margin-right: 10px;
            }
            .review-date {
                color: #666;
                font-size: 14px;
            }
            .review-score {
                font-size: 18px;
                font-weight: bold;
                color: #B2006F;
            }
            .review-text {
                font-size: 14px;
                margin-top: 10px;
            }
            .helpful {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
            }
            .recent-review {
                border-left: 4px solid #B2006F;
            }
            .app-info {
                background-color: #f0f0f0;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .app-info-item {
                text-align: center;
            }
            .app-info-label {
                font-size: 14px;
                color: #666;
            }
            .app-info-value {
                font-size: 18px;
                font-weight: bold;
                color: #B2006F;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>EW Pay</h1>
        </div>
        <div class="subheader">
            Latest Playstore Reviews
        </div>
        <div class="content">
            <div class="app-info">
                <div class="app-info-item">
                    <div class="app-info-label">App Score</div>
                    <div class="app-info-value">${
                      appScore ? appScore.toFixed(1) : "N/A"
                    }</div>
                </div>
                <div class="app-info-item">
                    <div class="app-info-label">App Version</div>
                    <div class="app-info-value">${appVersion}</div>
                </div>
            </div>
            <p>Here are the latest reviews (with scores 4-5) for the EW Pay app from the Google Play Store:</p>
            <div id="reviews-container">
  `;

  if (reviews && Array.isArray(reviews) && reviews.length > 0) {
    reviews.forEach((review) => {
      const reviewDate = new Date(review.date);
      const isRecent = reviewDate >= twoDaysAgo;
      const stars = "★".repeat(review.score) + "☆".repeat(5 - review.score);
      htmlContent += `
        <div class="review ${isRecent ? "recent-review" : ""}">
            <div class="review-header">
                <span class="user-name">${review.userName}</span>
                <span class="review-date">${reviewDate.toLocaleDateString()}</span>
            </div>
            <div class="review-score">${stars} ${review.score}/5</div>
            <div class="review-text">${review.text}</div>
            <div class="helpful">${review.thumbsUp} user${
        review.thumbsUp !== 1 ? "s" : ""
      } found this review helpful</div>
        </div>
      `;
    });
  } else {
    htmlContent += `<p>No new reviews available at this time.</p>`;
  }

  htmlContent += `
            </div>
            <p>Thank you for staying updated with our app's feedback!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </body>
    </html>
  `;

  return htmlContent;
}

export async function getAppDetailsViaCheerio(appId) {
  try {
    const url = `https://play.google.com/store/apps/details?id=${appId}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const selector =
      "c-wiz.SSPGKf.Czez9d > div > div > div:nth-child(1) > div > div:nth-child(1) > div > div > c-wiz > div.hnnXjf > div.JU1wdd > div > div > div:nth-child(1) > div.ClM7O > div > div";
    const ratingElement = $(selector);

    let rating = null;
    if (ratingElement.length > 0) {
      const ratingText = ratingElement.text().trim();
      rating = parseFloat(ratingText);
    }

    return { rating };
  } catch (error) {
    return null;
  }
}
