const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/", categoryController.getCategories);
router.post("/", auth, authAdmin, categoryController.createCategories);

router.delete("/:id", auth, authAdmin, categoryController.deleteCategories);
router.put("/:id", auth, authAdmin, categoryController.editCategories);

module.exports = router;
