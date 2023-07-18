const { join } = require("path");
require('dotenv').config({ path: join(__dirname, '../.env') });

module.exports = {
  development: {
    username: "jcwdol0905",
    password: "groupol0905",
    database: "jcwdol0905",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "jcwdol0905",
    password: "groupol0905",
    database: "jcwdol0905",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "jcwdol0905",
    password: "groupol0905",
    database: "jcwdol0905",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
