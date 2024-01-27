const { Course } = require('../database/Models')
const { NotFoundException } = require('../exceptions')
const { convertToSlug } = require('../helpers/helperFunctions')

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ['instructor']
    }

    const query = req.query
    if (
      typeof req.query._id !== 'undefined' &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: 'Not found!' })
    }
    if (req.query?.search && req.query?.search !== '') {
      query.$or = [
        { title: { $regex: new RegExp(req.query.search, 'i') } },
        { slug: { $regex: new RegExp(req.query.search, 'i') } },
        { status: { $regex: new RegExp(req.query.search, 'i') } }
      ]
    }

    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status }
    }

    const invoices = await Course.paginate(query, options)
    if (invoices.totalDocs > 0) {
      return res.send({ status: 200, message: 'Data found', data: invoices })
    } else {
      return res.send({
        status: 204,
        message: 'No Content found',
        data: invoices
      })
    }
  } catch (error) {
    next(error)
  }
}

exports.show = async function (req, res, next) {
  const _id = req.params.id
  try {
    const course = await Course.findById({ _id })
    if (course) {
      return res.send({ status: 200, message: 'Data found', data: course })
    } else throw new NotFoundException('No Data Found!')
  } catch (error) {
    next(error)
  }
}

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload

    const course = await Course.create({
      status: payload.status,
      title: payload.title,
      instructor: payload.instructor,
      categories: payload.categories,
      course_price: payload.course_price,
      cut_off_price: payload.cut_off_price,
      instructor_notes: payload.instructor_notes,
      course_duration: payload.course_duration,
      course_image: payload.course_image,
      course_promo_video_url: payload.course_promo_video_url,
      instruction_level: payload.instruction_level,
      description: payload.description,
      tags: payload.tags,
      published_date: payload.published_date,
      slug: convertToSlug(payload.title),
      created_by: req.user._id,
      org_id: req.user.org_id
    })

    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        course.files.push(file)
      });

      (await course).save()
    }

    return res.send({
      status: 200,
      message: 'Created Successfully',
      data: course
    })
  } catch (error) {
    next(error)
  }
}

exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload
    const _id = payload._id
    console.log(_id)
    if (typeof _id !== 'undefined' && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: 'Not found!' })
    }

    const course = await Course.findById({ _id })
    if (!course) {
      return res.send({ status: 404, message: 'No data found', data: {} })
    }

    await course.update({
      status: payload.status,
      title: payload.title,
      instructor: payload.instructor,
      categories: payload.categories,
      course_price: payload.course_price,
      cut_off_price: payload.cut_off_price,
      instructor_notes: payload.instructor_notes,
      course_duration: payload.course_duration,
      course_image: payload.course_image,
      course_promo_video_url: payload.course_promo_video_url,
      instruction_level: payload.instruction_level,
      description: payload.description,
      tags: payload.tags,
      published_date: payload.published_date,
      slug: convertToSlug(payload.title),
      created_by: req.user._id,
      org_id: req.user.org_id
    })

    /** Delete  */
    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        document.files.push(file)
      });

      (await document).save()
    }

    return res.send({
      status: 200,
      message: 'Updated Successfully',
      course
    })
  } catch (error) {
    next(error)
  }
}

exports.delete = async function (req, res, next) {
  try {
    const ids = req.body._id

    ids.forEach((id) => {
      if (typeof id !== 'undefined' && !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.send({ status: 404, message: 'Not found!' })
      }
    })

    /** Delete */
    const course = await Course.find(
      {
        _id: ids
      },
      null
    )
    // console.log(vendor);
    if (course.length <= 0) {
      return res.send({
        status: 204,
        message: 'No Data found!'
      })
    }

    course.forEach((doc) => {
      /** Delete File */
      doc.delete()
    })

    return res.send({
      status: 200,
      message: 'Deleted Successfully'
    })
  } catch (error) {
    next(error)
  }
}
