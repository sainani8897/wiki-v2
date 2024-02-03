const { Section } = require('../database/Models')
const { NotFoundException } = require('../exceptions')
const { convertToSlug } = require('../helpers/helperFunctions')

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { sort_order: 1 },
      populate: ['instructor', 'course']
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

    const invoices = await Section.paginate(query, options)
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
    const section = await Section.findById({ _id })
    if (section) {
      return res.send({ status: 200, message: 'Data found', data: section })
    } else throw new NotFoundException('No Data Found!')
  } catch (error) {
    next(error)
  }
}

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload

    const section = await Section.create({
      status: payload.status,
      title: payload.title,
      instructor: payload.instructor,
      course: payload.course,
      description: payload.description,
      sort_order: payload.sort_order,
      published_date: payload.published_date,
      slug: convertToSlug(payload.title),
      instructor_notes: payload.instructor_notes,
      created_by: req.user._id,
      org_id: req.user.org_id
    })

    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        section.files.push(file)
      });

      (await section).save()
    }

    return res.send({
      status: 200,
      message: 'Created Successfully',
      data: section
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

    const section = await Section.findById({ _id })
    if (!section) {
      return res.send({ status: 404, message: 'No data found', data: {} })
    }

    await section.update({
      status: payload.status,
      title: payload.title,
      instructor: payload.instructor,
      course: payload.course,
      description: payload.description,
      sort_order: payload.sort_order,
      published_date: payload.published_date,
      slug: convertToSlug(payload.title),
      instructor_notes: payload.instructor_notes,
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
      section
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
    const section = await Section.find(
      {
        _id: ids
      },
      null
    )
    if (section.length <= 0) {
      return res.send({
        status: 204,
        message: 'No Data found!'
      })
    }

    section.forEach((doc) => {
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
