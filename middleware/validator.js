const { body } = require("express-validator/check");
const User = require("../modules/user");

exports.registerValidator = [
  body("name")
    .isLength({ min: 3, max: 10 })
    .withMessage("Name is minimum 3 maxium 10")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Enter your email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email is already exist");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail()
    .trim(),
  body("password", "Password is wrong").isLength({ min: 6, max: 20 }).trim(),
  body("tpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password should be similar");
    }
    return true;
  }),
];

exports.addNotebookValidator = [
  body("title")
    .isLength({ min: 3, max: 10 })
    .withMessage("Title is min 3 max 10")
    .trim(),
  body("price", "Price is wrong").isNumeric().isLength({ min: 1 }),
  body("img", "Url is wrong").isURL().trim(),
  body("descr").isLength({ min: 3 }).trim().withMessage("Description is wrong"),
];
