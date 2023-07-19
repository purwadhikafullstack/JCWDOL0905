require("dotenv/config");

module.exports = (req, res, next) => {
    const key = "apahayo"
    console.log('Headers Secret Key')
    console.log(req.headers.secret_key)
    console.log(key)
    if (req.headers.secret_key == key) {
        return next()
    }

    res.status(500).send("auth fail")
}
