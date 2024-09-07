const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser)
      return res.status(401).json({ message: "Email ou senha incorretos" }); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        { email: foundUser.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "900s" }
      );
      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const user = jwt.decode(accessToken);
      // Saving refreshToken with current user
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.json({
        accessToken,
        refreshToken,
        user: { ...foundUser._doc, ...user },
      });
    } else {
      res.status(401).json({ message: "Email ou senha incorretos" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
