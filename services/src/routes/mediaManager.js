const express = require("express");
const mediaController = require("../controllers/media.controller");
const { mediaManager } = require("../middleware/validation-middleware");
const { upload } = require("../middleware/multer-middleware");

/**
 * Router
 */
let router = express.Router();

router.get("/", mediaController.index);

router.post("/", upload.single("file"), mediaController.create);

router.get("/:id", mediaController.show);

router.delete('/',mediaManager, mediaController.delete);

module.exports = router;
