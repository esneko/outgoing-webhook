require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/api/messages", async (req, res) => {
  const message = req.body;

  if (message.type === "message") {
    try {
      const match = message.text.match(/[\s\u00A0].*/);
      const question = match ? match[0] : "";
      console.log("Question: ", question);
      const response = await callApi(question);
      if (response?.data?.answer) {
        console.log("Answer: ", response?.data?.answer);
        res.json({
          type: "message",
          text: response?.data?.answer,
        });
      } else {
        res.json({
          type: "message",
          text: `Error: no response`,
        });
      }
    } catch (error) {
      res.json({
        type: "message",
        text: `Error: API offline`,
      });
    }
  } else {
    res.json({
      type: "message",
      text: `**Echo**: ${message.text}`,
    });
  }

  res.send();
});

async function callApi(prompt) {
  const endpoint = "prompt";
  const response = await fetch(
    `${process.env.BACKEND_URL}/${endpoint}=${JSON.stringify(prompt)}`
  );

  const data = await response.json();
  return data;
}

app.listen(8080, () => {
  console.log("Webhook started on port 8080");
});
