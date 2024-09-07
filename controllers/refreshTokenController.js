const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Token is required" });
  const refreshToken = token.split(" ")[1];

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.status(403).json({ message: "Token expired" }); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" }
    );
    res.json({ accessToken, email: foundUser.email });
  });
};

module.exports = { handleRefreshToken };
