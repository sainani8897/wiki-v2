const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require("bcrypt");
const { UnauthorizedException } = require("../../exceptions");

const AddressSchema = new mongoose.Schema({
  address_line1: String,
  address_line1: String,
  city: String,
  state:String,
  pin:String,
  country:String,
  country_code:String
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tokens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonalAccessTokens",
      },
    ],
    refresh_token: {
      type: String,
    },
    phone_number: {
      type: String,
      unique: true,
    },
    email_verfied:{
      type:Date
    },
    phone_no_verfied:{
      type:Date
    },
    address:{
      type: AddressSchema,
    },
    timezone:{
      type:String
    },
    org_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    status  :{
      type: String,
      default:"Active"
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.refresh_token;
      },
    },
  }
);

userSchema.statics.findByLogin = async function ({ email, password }) {
  let user = await this.findOne({
    email,
  }).populate({
    path: 'roles',
    // Get friends of friends - populate the 'friends' array for every friend
   // populate: { path: 'premissions' }
  });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
  }
  throw new UnauthorizedException(
    "Invalid Login Email & Password do not match!"
  );
};

userSchema.statics.register = async function (register) {
  return await this.create(register, function (err, userInstance) {
    if (err) throw new Error("BROKEN");
    return userInstance;
  });
};

/**
 * Pagination
 */

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
