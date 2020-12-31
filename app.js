var createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  dotenv = require("dotenv"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  session = require("express-session"),
  methodOverride = require("method-override"),
  compression = require("compression"),
  passport = require("passport"),
  // seed = require("./seeds"),
  Student = require("./models/studentModel"),
  Admin = require("./models/adminModel"),
  indexRouter = require("./routes/index"),
  studentRouter = require("./routes/studentRoutes"),
  postRouter = require("./routes/postRoutes"),
  adminRouter = require("./routes/adminRoutes"),
  app = express();

// for .env variables
dotenv.config();

app.use(methodOverride("_method"));

app.use(compression()); //Compress all routes

// seed();


//Import the mongoose module
var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = process.env.DB_CONNECT;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", function () {
  console.log("Database connected!");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());


// app.use(function(req, res, next) {
//   res.setHeader("content-security-policy-report-only", "default-src 'self'; script-src 'self' 'report-sample' 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js'; style-src 'self' 'report-sample' 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css' ; base-uri 'none'; object-src 'none'; report-uri https://5e52f4c893efcda6a7d40460.endpoint.csper.io")
//   next();
// });

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use("student-local", Student.createStrategy());
passport.use("admin-local", Admin.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRouter);
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/post", postRouter);

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
