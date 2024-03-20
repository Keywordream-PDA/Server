var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors"); // CORS 미들웨어 추가

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const searchRouter = require("./routes/search");
const stockRouter = require("./routes/stock");
const mainRouter = require("./routes/main");
const finstatRouter = require("./routes/finstat");
const keywordRouter = require("./routes/keyword");

var app = express();

// mariaDB connect
const maria = require("./database/connect/mariadb");

maria.GetDataList().then(() => {
    console.log("DB Connected Successful!");
}).catch((err) => {
    console.log("DB Connection Failed:", err);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/search", searchRouter);
app.use("/api/stock", stockRouter);
app.use("/api/main", mainRouter);
app.use("/api/finstat", finstatRouter);
app.use("/api/keyword", keywordRouter);

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
