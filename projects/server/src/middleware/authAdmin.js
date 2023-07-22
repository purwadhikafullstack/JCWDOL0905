const jwt = require("jsonwebtoken");
const { join } = require("path");
require('dotenv').config({ path: join(__dirname, '../.env') });

module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) return res.status(401).send("Access Denied / Unauthorized Request");

    try {
      token = token.split(" ")[1];

      if (token == "null" || !token) {
        return res.status(401).send("Access Denied");
      }

      let verifiedAdmin = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!verifiedAdmin) {
        return res.status(401).send("Access Denied");
      }

      req.admin = verifiedAdmin;
      next();
    } catch (err) {
      console.log(err);
      res.status(400).send("Invalid Token");
    }
  },
};
