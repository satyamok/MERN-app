const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello World from server");
});

app.use("/medixify", (req, res) => {
  res.send("medixify helth application reversed age");
});

app.listen(3000, () => {
  console.log(`Server is running on port`);
});
