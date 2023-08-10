const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    property_name: {
      type: String,
    },
    sponsor_name: {
      type: String,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaManager",
      },
    ],
    added_at: {
      type: Date,
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

documentSchema.plugin(mongoosePaginate);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
