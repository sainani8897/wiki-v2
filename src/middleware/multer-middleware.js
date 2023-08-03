const multer = require("multer");
const {disks} = require("../config/filesystem")

const destination = `${disks.local.root}/files`;
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

exports.upload = multer({ storage: fileStorageEngine });