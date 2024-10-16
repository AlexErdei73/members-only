var createError = require("http-errors");
var express = require("express");
var path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const MongoStore = require("connect-mongo"); //We need it to create the store for express session
//var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const flash = require("connect-flash"); //We need it to flash error messages at login
const helmet = require("helmet");
const compression = require("compression");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var aboutRouter = require("./routes/about");

var app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "frame-ancestors": ["'self'", "https://www.youtube-nocookie.com/"],
        frameSrc: ["'self'", "https://www.youtube-nocookie.com/"],
        childSrc: ["'self'", "https://www.youtube-nocookie.com/"],
        "img-src": ["'self'", "https://i.ytimg.com/"],
        "script-src": [
          "'self'",
          "https://www.youtube.com/",
          "'sha256-pLrwPAx6VnbIKVIjRVyGAqfm1Xhf37GDZKZjsubPP98='",
        ],
      },
      //reportOnly: true,
    },
    referrerPolicy: false,
    originAgentCluster: false,
  })
);

//Without this middleware embedded youtube video is not working with helmet
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "cross-origin");
  next();
});

// Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// user authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ user_name: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.hash, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongoDB,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  const errorMessages = req.flash().error;
  res.locals.errors = errorMessages
    ? errorMessages.map((error) => {
        return { msg: error };
      })
    : [];
  next();
});

app.use("/", indexRouter);
app.use("/about", aboutRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
