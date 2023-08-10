const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const courseSchema = new mongoose.Schema(
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
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    status: {
      type: String,
      default: 'Active',
      required: true
    },
    description: {
      type: String
    },
    instructor_notes: {
      type: String
    },
    course_duration: String,
    instruction_level: String,
    course_image: String,
    course_promo_video_url: String,
    course_price: {
      type: Number,
      required: true
    },
    cut_off_price: {
      type: Number,
      required: true
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

courseSchema.plugin(mongoosePaginate)

const Course = mongoose.model('Course', courseSchema)

module.exports = Course
