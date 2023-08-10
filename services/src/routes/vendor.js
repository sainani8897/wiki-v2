const express = require("express");
const VendorController = require("../controllers/vendor.controller");
const { vendorRules } = require("../middleware/validation-middleware");
const { upload } = require("../middleware/multer-middleware");

/**
 * Router
 */
let router = express.Router();

router.get("/", VendorController.index);

router.post("/", vendorRules, VendorController.create);

router.get("/:id", VendorController.show);

router.delete("/", VendorController.delete);

router.patch("/",vendorRules, VendorController.update);

module.exports = router;
