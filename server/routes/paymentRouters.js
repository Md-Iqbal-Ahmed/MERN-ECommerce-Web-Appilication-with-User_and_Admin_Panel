const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/", auth, authAdmin, paymentController.getPayments);
router.post("/", auth, paymentController.createPayments);

module.exports = router;
