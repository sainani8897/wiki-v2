const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const billSchema = new mongoose.Schema(
  {
    bill_no: {
      type: String,
      required: true
    },
    reference: {
      type: String
    },
    bill_date: {
      type: Date
    },
    due_date: {
      type: Date
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    purchase_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      required: true
    },
    sale_details: {
      sub_total: Number,
      discount_amount: Number,
      tax: Number,
      total: Number
    },
    items: [mongoose.Schema.Types.Mixed],
    status: {
      type: String,
      default: 'Bill Created',
      required: true
    },
    payment: {
      type: String,
      default: 'Un-paid'
    },
    description: {
      type: String
    },
    customer_notes: {
      type: String
    },
    shipping_notes: {
      type: String
    },
    send_mailto: String,
    docs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MediaManager'
      }
    ],
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true },
  {
    toJSON: {
      transform (doc, ret) {
        delete ret.__v
      }
    }
  }
)

/**
 * Pagination
 */

billSchema.plugin(mongoosePaginate)

const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill
