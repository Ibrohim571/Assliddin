const { Router } = require("express");
const router = Router();
const Notebook = require("../modules/notebook");
router.get("/", (req, res) => {
  const notebooks = await Notebook.find()
  res.send(notebooks)
  // res.render("index", { isHome: true, title: "Home" });
});

module.exports = router;
