const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const serverless = require("serverless-http")

dontenv.config({ path: ".env" });
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
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

module.exports.ReconTrails = new serverless(app)