const { Router } = require("express");
const router = Router();
// const Notebook = require("../modules/notebook");
router.get("/", (req, res) => {
  // res.render("index", { isHome: true, title: "Home" });
  res.send("Hello world");
});

module.exports = router;
