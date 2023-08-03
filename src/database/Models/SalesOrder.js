const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const salesOrderSchema = new mongoose.Schema(
  {
    order_no: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    source_type:{
      type: String,
      default:"Sales Order"
    },
    pos:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "PointOfSale",
    },
    sale_date: {
      type: Date,
    },
    shipment_date: {
      type: Date,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    sales_executives: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    sale_details: {
      sub_total: Number,
      discount_amount: Number,
      tax: Number,
      total: Number,
    },
    items: [{
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      rate: String,
      amount: String,
      qty: String
    }],
    status: {
      type: String,
      default: 'Order Created',
      required: true,
    },
    description: {
      type: String,
    },
    customer_notes: {
      type: String
    },
    shipping_notes: {
      type: String
    },
    docs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaManager",
      },
    ],
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

/**
 * Pagination
 */

salesOrderSchema.plugin(mongoosePaginate);

const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);

module.exports = SalesOrder;
