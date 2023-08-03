const express = require("express");
const Routes = express.Router();
const { authenticateToken } = require("../middleware/jwt-token-verification");

const validationMiddleware = require("../middleware/validation-middleware");

const users = require("./users");
const customer = require("./customer");

const authController = require("../controllers/auth.contoller");
const mediaManager = require("../routes/mediaManager");
const documents = require("./documents");
const roles = require("./roles");
const vendors = require("./vendor");
const { profile, changePassword } = require("../controllers/user.controller");
const permissions = require("../controllers/permissions.controller");
const category = require("./category");
const tax = require("./tax");
const invoice = require("./invoice");
const dashboard = require("./dashboard");


/** Home Route */
Routes.get("/", function (req, res) {
  res.send("Home api page");
});

/**Login Route */
Routes.post("/login", validationMiddleware.login, authController.login);

/**Register Route */
Routes.post("/register", validationMiddleware.signup, authController.register);

/**Logout Route */
Routes.post("/logout", authenticateToken, authController.logout);

/* Refresh token  */
Routes.post("/refresh", authController.refreshToken);

/** Routes Users  */
Routes.use("/users", authenticateToken, users);

Routes.get("/profile", authenticateToken, profile);

/** Change Password */
Routes.patch(
  "/change-password",
  validationMiddleware.changePassword,
  authenticateToken,
  changePassword
);


/** Media Manager */
Routes.use("/media-manager", authenticateToken, mediaManager);

/** Documents */
Routes.use("/documents", authenticateToken, documents);

/** Role Routes */
Routes.use("/roles", authenticateToken, roles);

/**Permissions Routes */
Routes.get("/permissions", authenticateToken, permissions.index);

/** Customers Routes */
Routes.use("/customers", authenticateToken, customer);

Routes.use("/vendors", authenticateToken, vendors);

/** Categories Routes */
Routes.use("/categories", authenticateToken, category);

/** Tax Routes */
Routes.use("/taxes", authenticateToken, tax);

/** Invoice Routes  */
Routes.use("/invoice", authenticateToken, invoice);

/* Receivable Controller */
Routes.use("/dashboard", authenticateToken, dashboard);

/* Point of Sale */


module.exports = Routes;
