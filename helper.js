export const generateEmailHTML = (reviews) => {
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
                    max-width: 400px;
                }
                .review p {
                    font-size: 12px;
                    margin: 2px 0;
                }
                .badge {
                    background-color: yellow;
                    padding: 3px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    margin-left: 5px;
                }
                #reviews-container{
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                  column-gap: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <p>Playstore reviews.</p>
                <div id="reviews-container">
    `;

  if (reviews && Array.isArray(reviews)) {
    reviews.forEach((review) => {
      const reviewDate = new Date(review.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let badgeHTML = "";
      if (
        reviewDate.getFullYear() === yesterday.getFullYear() &&
        reviewDate.getMonth() === yesterday.getMonth() &&
        reviewDate.getDate() === yesterday.getDate()
      ) {
        badgeHTML = '<span class="badge">New</span>';
      }

      htmlContent += `
                <div class="review">
                    <p><strong>Name:</strong> ${review.userName}</p>
                    <p><strong>Date Posted:</strong> ${reviewDate.toLocaleDateString()}${badgeHTML}</p>
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
};
