const key = process.env.SECRET_KEY

module.exports = (req, res, next) => {
    if (req.headers.secretKey == key) {
        return next()
    }

    res.status(500).send("auth fail")
}