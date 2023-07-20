const { join } = require("path");
require('dotenv').config({ path: join(__dirname, '../.env') });

module.exports = (req, res, next) => {
    console.log('Headers')
    console.log(req.headers)
    console.log('Headers Secret Key')
    console.log(req.headers.secret_key)
    console.log('<<<>>>')
    console.log(process.env.SECRET_KEY)
    // if (req.headers.secret_key == key) {
    //     return next()
    // }

    res.status(500).send("auth fail")
}
