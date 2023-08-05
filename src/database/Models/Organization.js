const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AddressSchema = new mongoose.Schema({
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  pin: String,
  country: String,
  country_code: String,
});

const orgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    website: {
      type: String,
    },
    org_email: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: AddressSchema,
    },
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

orgSchema.statics.findByLogin = async function ({ email, password }) {
  let user = await this.findOne({
    email,
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

orgSchema.statics.register = async function (register) {
  return await this.create(register, function (err, userInstance) {
    if (err) throw new Error("BROKEN");
    return userInstance;
  });
};

/**
 * Pagination
 */
orgSchema.plugin(mongoosePaginate);
const Organization = mongoose.model("Organization", orgSchema);
module.exports = Organization;
