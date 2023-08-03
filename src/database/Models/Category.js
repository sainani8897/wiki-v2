const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
 
const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    sort: {
      type: Number,
      required: true,
    },
    status: {
     type: String,
    },
    icon: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "MediaManager",
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

 categorySchema.plugin(mongoosePaginate);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
