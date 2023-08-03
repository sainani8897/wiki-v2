const express = require("express");
const RoleController = require("../controllers/role.controller");
const { roleRules } = require("../middleware/validation-middleware");
const { upload } = require("../middleware/multer-middleware");

/**
 * Router
 */
let router = express.Router();

router.get("/", RoleController.index);

router.post("/", roleRules, RoleController.create);

router.get("/:id", RoleController.show);

router.delete("/", RoleController.delete);

router.patch("/",roleRules, RoleController.update);

module.exports = router;
