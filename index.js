require("./models");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const req = require("express/lib/request");

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "heyyy buddddy" });
});

// controllers
app.use("/users", require("./controllers/users"));

app.listen(PORT, () =>
  console.log(`listening to the smooth sounds of port ${PORT} in the morning`)
);
