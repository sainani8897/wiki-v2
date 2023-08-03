const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AddressSchema = new mongoose.Schema({
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  pincode: String,
  latitude: String,
  longitude: String,
});


const SocialSchema = new mongoose.Schema({
  whatsapp: String,
  instagram: String,
  twitter: String,
  facebook: String,
  website_url: String,
});

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    customer_type: {
      type: String
    },
    saluation: {
      type: String
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
      unique: true,
    },
    company_name: {
      type: String,
    },
    company_email: {
      type: String,
    },
    company_phone: {
      type: String,
    },
    alt_phone: {
      type: String
    },
    alt_email: {
      type: String
    },
    display_name: {
      type: String,
    },
    address: {
      type: AddressSchema,
    },
    billing_address: {
      type: AddressSchema,
    },
    shiping_address: {
      type: AddressSchema,
    },
    status: {
      type: String,
    },
    pan: {
      type: String
    },
    gst: {
      type: String
    },
    profile: {
      type: String
    },
    social_info: {
      type: SocialSchema,
    },
    notes: String,
    contacts: [mongoose.Schema.Types.Mixed],
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
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

/**
 * Pagination
 */

customerSchema.plugin(mongoosePaginate);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
