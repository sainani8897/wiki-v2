const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
 
const taxSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    status: {
     type: String,
    },
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

taxSchema.plugin(mongoosePaginate);

const Tax = mongoose.model("Tax", taxSchema);

module.exports = Tax;
