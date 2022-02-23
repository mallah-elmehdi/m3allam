// ===== SET UP

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const favicon = require('serve-favicon')
const app = express();

const indexRouter = require("./routes/indexRouter");
const inscrireRouter = require("./routes/inscrireRouter");
const seConnecterRouter = require("./routes/seConnecterRouter");
const monCompteRouter = require("./routes/monCompteRouter");
const errRouter = require("./routes/errRouter");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')))

dotenv.config({
  path: "./config.env",
});

app.use(express.static(path.join(__dirname)));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(methodOverride("_method"));

// ===== SECURITY

const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000,
  message: "الكثير من الطلبات من هذا الجهاز ، يرجى المحاولة مرة أخرى في غضون ساعة!"
});

app.use(limiter);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// ===== ROUTER

app.use("/", indexRouter);
app.use("/inscrire", inscrireRouter);
app.use("/se-connecter", seConnecterRouter);
app.use("/mon-compte", monCompteRouter);
app.use("*", errRouter);

// ===== DATABASE

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅  MongoDb connected successfully")).catch((err) => {
	  console.log(err);
  });

// ===== SERVER

const port = process.env.PORT;
app.listen(port, function () {
  console.log(`✅  Server started on port ${port}...`);
});
