const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");

dontenv.config({ path: ".env" });
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
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
