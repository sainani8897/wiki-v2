const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UnauthorizedException } = require("../../exceptions");

const userSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresIn: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.statics.findByToken = async function ({ token }) {
  let personal_access_token = await this.findOne({
    token,
  });

  if (personal_access_token) {
    return personal_access_token
  }

  throw new UnauthorizedException(
    "Invalid Token!"
  );
};

const PersonalAccessTokens = mongoose.model(
  "personal_access_tokens",
  userSchema
);

module.exports = PersonalAccessTokens;
