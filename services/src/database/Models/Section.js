const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      required: true,
      type: String
    },
    source_type: {
      type: String,
      default: 'Course'
    },
    published_date: {
      type: Date
    },
    tags: [
      {
        type: String
      }
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    status: {
      type: String,
      default: 'Active',
      required: true
    },
    description: {
      type: String
    },
    sort_order: {
      type: Number
    },
    instructor_notes: {
      type: String
    },
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

sectionSchema.plugin(mongoosePaginate)

const Section = mongoose.model('Section', sectionSchema)

module.exports = Section
