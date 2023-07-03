const multer = require("multer");
const path = require("path");

function upload(folder="products") {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../public/${folder}`);
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

  return multer({storage, fileFilter}).single("image")
}

module.exports = upload;
