const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const salesItemsHistorySchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    sales_order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SalesOrder",
    },
    rate: Number,
    amount: Number,
    qty: Number,
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
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

salesItemsHistorySchema.plugin(mongoosePaginate);

const SalesItemsHistory = mongoose.model(
  "SalesItemsHistory",
  salesItemsHistorySchema
);

module.exports = SalesItemsHistory;
