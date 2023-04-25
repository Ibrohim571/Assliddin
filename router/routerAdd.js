const { Router } = require("express");
const router = Router();
const Notebook = require("../modules/notebook");
const { validationResult } = require("express-validator/check");
// middleware
const authMiddleware = require("../middleware/auth");
const { addNotebookValidator } = require("../middleware/validator");

router.get("/", authMiddleware, (req, res) => {
  res.render("add", { isAdd: true, title: "Add" });
});

router.post("/", authMiddleware, addNotebookValidator, async (req, res) => {
  try {
    const addError = validationResult(req);
    if (!addError.isEmpty()) {
      return res.status(422).render("add", {
        isAdd: true,
        title: "Add",
        addError: addError.array()[0].msg,
        titles: req.body.title,
        price: req.body.price,
        img: req.body.img,
        descr: req.body.descr,
      });
    }

    const notebook = new Notebook({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      descr: req.body.descr,
      userId: req.user,
    });
    await notebook.save();
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
