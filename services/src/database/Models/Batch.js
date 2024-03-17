const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const BatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true // Ensures no duplicate batch names
    },
    description: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      default: 'Active',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Reference the Course model
      required: true
    },
    students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User' // Reference the User model (assuming users represent students)
    },
    instructors: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User' // Reference the User model (assuming users represent instructors)
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference the User model (assuming users represent students)
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: {
      type: Date
    },
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    }
    // Additional fields as needed (e.g., status, capacity, materials)
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

BatchSchema.plugin(mongoosePaginate)

const Batch = mongoose.model('Batch', BatchSchema)

module.exports = Batch
