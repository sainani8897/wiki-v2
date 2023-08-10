const jwt = require("jsonwebtoken");
const PersonalAccessTokens = require("../database/Models/PersonalAccessToken");
const { UnauthorizedException } = require("../exceptions");
const { roleRules } = require("./validation-middleware");

/**
 * get the authorization token from  request and verify
 */
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (token == null) throw new UnauthorizedException("Unauthoirzed");
    const data = await PersonalAccessTokens.findByToken({ token });
    const user_data = await data.populate({
      path: "user",
      populate: [{
        path: "roles",
      },{
        path:'org_id'
      }],
    });
    if (!user_data) throw new UnauthorizedException("Unauthoirzed");
    req.user = user_data.user;
    req.token = user_data.token;
    req.query.org_id = user_data.user.org_id._id
    next();
  } catch (error) {
    next(error);
  }
};
