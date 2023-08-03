
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express();
const port = 3000;

// Serve static files from the "Public" directory
app.use(express.static("Public"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// Your Mailchimp API key and list ID
const mailchimpApiKey = process.env.API_KEY;
const audienceId = process.env.ID;

// Route to handle form submission
app.post("/", async (req, res) => {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  // Your Mailchimp API endpoint
  const mailchimpEndpoint = `https://us21.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  try {
    const response = await axios.post(
      mailchimpEndpoint,
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
      {
        auth: {
          username: "anystring",
          password: mailchimpApiKey,
        },
      }
    );

    console.log("Successfully added contact to Mailchimp:", response.data);
    res.sendFile(__dirname + "/success.html");
  } catch (error) {
    console.error("Error adding contact to Mailchimp:", error.response.data);
    res.sendFile(__dirname + "/failure.html");
  }
});

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
