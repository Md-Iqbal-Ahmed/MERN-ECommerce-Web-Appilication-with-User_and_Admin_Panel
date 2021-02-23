const User = require("../models/Users");
const Payment = require("../models/PaymentModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists.." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must contain atleat 6 characters" });

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });

      await newUser.save();

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token)
      return res.status(400).json({ msg: "Please Login or Register" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Please Login or Register" });
      const accessToken = createAccessToken({ id: user.id });
      res.json({ accessToken });
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(400).json({ msg: "User doesn't exists.." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refresh_token" });

      return res.json({ msg: "Logged out" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User doesn't exists.." });
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const newUser = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart", newUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getHistory: async (req, res) => {
    try {
      const history = await Payment.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (userId) => {
  return jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "11m",
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = userController;
