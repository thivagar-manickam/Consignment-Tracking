/**
 * This is the starting point
 * for the api server. All
 * the initialization for the
 * server takes place here
 *
 * @author M. Thivagar
 * Last Modified - 27/04/2020
 */

let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  logger = require("./logger"),
  indexRoute = require("./routes/index"),
  consignmentRoute = require("./routes/consignmentRoute"),
  { INFO } = require("./utils/constants").LOGGER_LEVEL,
  MONGO_URL = require("./utils/constants").MONGO_URL;

logger.log({ level: INFO, message: `Connecting to the MongoDB...` });
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * This is to prevent the CORS issue
 * Only the request from localhost:4200
 * will be served
 */
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Accept-Language, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

app.use("/api/", indexRoute);
app.use("/api/consignment/", consignmentRoute);

app.listen("3100", process.env.IP, () => {
  logger.log({ level: INFO, message: "API Server has started..." });
});
