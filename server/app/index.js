const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Activate the middleware to parse the JSON payload
app.use(express.json());
// Activate the middleware to parse the urlencoded payload
app.use(express.urlencoded({ extended: true }));

// Lift the CORS restriction
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Activate the middleware to parse the cookie and populate req.cookies
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // The secret property of express-session is used to define a secret key that is used to sign session cookies, thus ensuring data integrity and preventing cookie tampering.
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // impossible to send the cookie back to the server in the future if the browser does not have an HTTPS connection.
      httpOnly: true, // when setting this to true, the clients are not allowed to see the cookie in document.cookie.
    },
  })
);

app.use("/auth", require("./routers"));

module.exports = app;
