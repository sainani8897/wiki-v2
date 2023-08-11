const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

/* Questions Object */
const QuestionSchema = new mongoose.Schema({
  question: String,
  question_type: String,
  points: {
    type: Number,
    default: 1
  },
  answers: [
    {
      ans: String,
      mark_as_correct: Boolean
    }
  ],
  settings: {
    full_points: Number,
    pass_points: Number,
    duration: Number,
    attempts_allowed: String,
    time_limit: Boolean,
    time_limit_per_question: Number, // Give in seconds
    no_of_attempts: Number
  }
})

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
    type: {
      type: String,
      required: true,
      default: 'lesson'
    },
    content_type: {
      type: String,
      required: true,
      default: 'text'
    },
    content: {
      type: String
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true
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
    quiz_content: [
      {
        type: QuestionSchema
      }
    ],
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

const Lecture = mongoose.model('Lecture', sectionSchema)

module.exports = Lecture
