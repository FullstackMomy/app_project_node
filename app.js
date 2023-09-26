require("dotenv/config");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const chalk = require("chalk");
const cors = require("cors");

const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

mongoose
  .connect(config.get("mongoDB.MONGO_URI"))
  .then(() => console.log(chalk.green.bold("connected to db successfully")))
  .catch((err) => console.log(chalk.red.bold("could not connect to db", err)));

const app = express();

app.use(cors());
app.use(
  morgan(
    chalk.yellow(
      `DATE: :date[web] ; METHOD: :method ; URL: :url ; STATUS: :status ; RESPONSE TIME: :response-time ms`
    )
  )
);

app.use(express.json());

app.use("/users", userRouter);
app.use("/cards", cardsRouter);

app.use(express.static("public"));

app.use("*", (req, res) => {
  res.status(404).send("404 page not found");
});

const PORT = config.get("server.PORT");
app.listen(PORT, () =>
  console.log(chalk.white.bgGreen(`listen on port ${PORT}`))
);
// console.log(config.MONGO_URL);
