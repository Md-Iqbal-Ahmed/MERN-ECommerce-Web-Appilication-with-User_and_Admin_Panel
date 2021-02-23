const router = require("express").Router();
const productControllers = require("../controllers/productController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/", productControllers.getProducts);
router.post("/", auth, authAdmin, productControllers.createProducts);

router.delete("/:id", auth, authAdmin, productControllers.deleteProducts);
router.put("/:id", auth, authAdmin, productControllers.updateProducts);

module.exports = router;
