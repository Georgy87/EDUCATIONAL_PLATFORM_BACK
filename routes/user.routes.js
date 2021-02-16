const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const UserController = require("../controller/userController");
// const { check } = require("express-validator");
const loginValodation = require("../utils/validations/validations.middleware");

router.post("/registration", loginValodation, UserController.registration);
router.post("/login", UserController.login);
router.get("/auth", authMiddleWare, UserController.auth);
router.put("/change-info", authMiddleWare, UserController.update);
router.post("/shopping-cart", authMiddleWare, UserController.shoppingCart);
router.post("/purchased-courses", authMiddleWare, UserController.purchasedCourses);

module.exports = router;