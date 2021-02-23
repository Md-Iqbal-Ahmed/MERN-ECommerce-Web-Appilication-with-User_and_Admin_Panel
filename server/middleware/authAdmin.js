const User = require("../models/Users");

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
    });
    if (user.role === 0) {
      return res.status(400).json({ msg: "Admin resource access denied" });
    }
    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
module.exports = authAdmin;
