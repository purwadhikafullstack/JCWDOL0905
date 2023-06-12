// multerMiddleware.js

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (req.body.category_name) {
      folder = "categories";
    } else if (req.body.product_name) {
      folder = "products";
    }
    // cb(null, `public/${folder}`);
    if (folder) {
      cb(null, `${__dirname}/../public/${folder}`);
    } else {
      cb(new Error("Invalid request. Please provide data."));
    }
  },
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file && (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and JPEG allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single("image");

module.exports = upload;
