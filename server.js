const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

dontenv.config({ path: ".env" });
const app = express();

const PORT = process.env.PORT || 3000;

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

// Middleware
app.use(allowCrossDomain);
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "IKnowTheSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
      secure: false,
    },
  })
);

const router = require("./routers/routes");
app.use("/", router);

// Start listening
app.listen(PORT, function () {
  console.log("listening on port " + PORT);
});
