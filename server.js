const express = require("express");
const app = express();
const port = 3000;
const path = require('path');

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
