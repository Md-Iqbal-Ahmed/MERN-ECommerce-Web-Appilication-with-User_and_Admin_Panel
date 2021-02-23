const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/refresh_token", userController.refreshToken);

router.get("/info", auth, userController.getUser);

router.patch("/addcart", auth, userController.addCart);

router.get("/history", auth, userController.getHistory);

module.exports = router;
