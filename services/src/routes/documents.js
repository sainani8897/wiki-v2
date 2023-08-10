const express = require("express");
const documentController = require("../controllers/document.controller");
const { documentRules } = require("../middleware/validation-middleware");
const { upload } = require("../middleware/multer-middleware");

/**
 * Router
 */
let router = express.Router();

router.get("/", documentController.index);

router.post("/", documentRules, documentController.create);

router.get("/:id", documentController.show);

router.delete("/", documentController.delete);

router.patch("/", documentController.update);

module.exports = router;
