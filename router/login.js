const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const User = require("../modules/user");
const { validationResult } = require("express-validator/check");
const { registerValidator } = require("../middleware/validator");

router.get("/", (req, res) => {
  res.render("auth/Login", {
    title: "SignIn",
    isLogin: true,
    registerError: req.flash("registerError"),
    logError: req.flash("logError"),
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candinate = await User.findOne({ email });
    if (candinate) {
      if (await bcrypt.compare(password, candinate.password)) {
        req.session.user = candinate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw err;
          res.redirect("/");
        });
      } else {
        req.flash("logError", "password wrong");
        res.redirect("/auth#login");
      }
    } else {
      req.flash("logError", "Somsing went wrong");
      res.redirect("/auth#login");
    }
  } catch (e) {
    req.flash("logError", "Somsing went wrong");
    res.redirect("/auth#login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth#login");
  });
});

router.post("/register", registerValidator, async (req, res) => {
  try {
    const { email, name, password, tpassword } = req.body;
    const registerError = validationResult(req);
    if (!registerError.isEmpty()) {
      req.flash("registerError", registerError.array()[0].msg);
      return res.status(422).redirect("/auth#register");
    }

    const hashPass = await bcrypt.hash(password, 10);
    const cart = { items: [] };

    const user = new User({
      email,
      name,
      password: hashPass,
      cart: cart,
    });
    await user.save();
    res.redirect("/auth#login");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
