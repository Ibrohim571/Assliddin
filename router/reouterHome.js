const { Router } = require("express");
const router = Router();
const Notebook = require("../modules/notebook");
router.get("/", async (req, res) => {
  // res.render("index", { isHome: true, title: "Home" });
  const js = await Notebook.find();
  res.send(js);
});

module.exports = router;
