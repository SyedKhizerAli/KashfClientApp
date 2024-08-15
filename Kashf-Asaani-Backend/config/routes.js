const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = function (app) {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
};

const userRouter = require("../routes/User");

module.exports = function (app) {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/api/user", userRouter);
};