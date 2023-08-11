const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const mediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    full_url: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

mediaSchema.plugin(mongoosePaginate);

const MediaManager = mongoose.model("MediaManager", mediaSchema);

module.exports = MediaManager;
