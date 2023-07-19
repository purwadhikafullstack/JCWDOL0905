const { join } = require("path");
require("dotenv").config({ path: join(__dirname, "../.env") });
const key = "apahayo"

module.exports = (req, res, next) => {
    console.log('Headers Secret Key')
    console.log(req.headers.secret_key)
    console.log(key)
    if (req.headers.secret_key == key) {
        return next()
    }

    res.status(500).send("auth fail")
}
