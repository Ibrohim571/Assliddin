const { Router } = require("express");
const router = Router();
const Notebook = require("../modules/notebook");
// middleware
const authMiddleware = require("../middleware/auth");

function myCart(cart) {
  return cart.items.map((s) => ({
    ...s.notebookId._doc,
    count: s.count,
  }));
}

function mapPrice(notebooks) {
  let price = 0;
  notebooks.forEach((element) => {
    price += element.price * element.count;
  });
  return price;
}

router.post("/add", authMiddleware, async (req, res) => {
  const notebook = await Notebook.findById(req.body.id);
  await req.user.addToCard(notebook);
  res.redirect("/notebooks");
});
router.get("/", authMiddleware, async (req, res) => {
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = myCart(user.cart);
  res.render("card", {
    title: "Backet",
    price: mapPrice(notebooks),
    notebook: notebooks,
    isCard: true,
  });
});

router.delete("/remove/:id", authMiddleware, async (req, res) => {
  await req.user.removeCard(req.params.id);
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = myCart(user.cart);
  const cart = {
    notebooks,
    price: mapPrice(notebooks),
  };
  res.status(200).send(cart);
});

module.exports = router;
