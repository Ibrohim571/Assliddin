const express = require("express");
const path = require("path");
const app = express();
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const expressHbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectFalsh = require("connect-flash");

// router
const routHome = require("./router/reouterHome");
const routNotebook = require("./router/routerNotebooks");
const routerAdd = require("./router/routerAdd");
const cardRouter = require("./router/card");
const User = require("./modules/user");
const orderRouter = require("./router/order");
const login = require("./router/login");
// middleware
const varMiddleware = require("./middleware/var");
const userMiddleware = require("./middleware/userMiddleware");
const profileRout = require("./router/profile");
const multerFile = require("./middleware/multer");
const errorMiddleware = require("./middleware/errorPage");

const mongoUrl =
  "mongodb+srv://idasturjs:WJlkFeACzKTDk6ls@cluster0.u2txy.mongodb.net/idasturShop";

const hbs = expressHbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./middleware/editHbs"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(multerFile.single("avatar"));
app.use(connectFalsh());

app.use(
  session({
    secret: "Ibrohim",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUrl }),
  })
);

app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", routHome);
app.use("/notebooks", routNotebook);
app.use("/add", routerAdd);
app.use("/card", cardRouter);
app.use("/orders", orderRouter);
app.use("/auth", login);
app.use("/profile", profileRout);

app.use(errorMiddleware);

// const password = WJlkFeACzKTDk6ls;

async function start() {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started on ${port}`));
  } catch (e) {
    console.log(e);
  }
}

start();
