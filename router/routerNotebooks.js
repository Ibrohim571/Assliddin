const { Router } = require("express");
const router = Router();
const Notebook = require("../modules/notebook");

router.get("/", async (req, res) => {
  const notebooks = await Notebook.find()
    .populate("userId", "name email")
    .select("title img price descr");
  res.render("notebooks", {
    isNotebooks: true,
    title: "Notebooks",
    notebooks,
    reqId: req.user ? req.user._id.toString() : null,
  });
});

router.get("/:id", async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);
  res.render("notebook", { notebook });
});

router.get("/:id/edit", async (req, res) => {
  try {
    if (!req.query.allow) {
      res.redirect("/");
    } else {
      const notebook = await Notebook.findById(req.params.id);
      if (req.user.id.toString() === notebook.userId._id.toString()) {
        res.render("notebookEdit", { notebook });
      } else {
        res.send("/");
      }
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", async (req, res) => {
  await Notebook.findByIdAndUpdate(req.body.id, req.body);
  res.redirect("/");
});

router.post("/remove", async (req, res) => {
  try {
    await Notebook.findByIdAndDelete(req.body.id);
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
