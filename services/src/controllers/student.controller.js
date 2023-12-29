const { User, Student } = require('../database/Models')
const { NotFoundException } = require('../exceptions')

// Student List
exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 }
      // populate: ["files", "created_by"],
    }

    const query = req.query
    if (
      typeof req.query._id !== 'undefined' &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: 'Not found!' })
    }

    /** Filters added */
    if (req.query?.search && req.query?.search !== '') {
      query.$or = [
        { name: { $regex: req.query.search } },
        { display_name: { $regex: req.query.search } },
        { email: { $regex: req.query.search } },
        { mobile: { $regex: req.query.search } },
        { company_name: { $regex: req.query.search } },
        { company_email: { $regex: req.query.search } },
        { company_phone: { $regex: req.query.search } },
        { alt_email: { $regex: req.query.search } },
        { alt_phone: { $regex: req.query.search } },
        { type: { $regex: req.query.search } }
      ]
    }

    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status }
    }
    // Check softdeleted elements
    query.isDeleted = false

    const students = await Student.paginate(query, options)
    if (students.totalDocs > 0) { return res.send({ status: 200, message: 'Data found', data: students }) } else {
      return res.send({
        status: 204,
        message: 'No Content found',
        data: students
      })
    }
  } catch (error) {
    next(error)
  }
}

exports.show = async function (req, res, next) {
  const _id = req.params.id
  try {
    const customer = await Student.findById({ _id })
    if (customer) { return res.send({ status: 200, message: 'Data found', data: customer }) } else throw new NotFoundException('No Data Found!')
  } catch (error) {
    next(error)
  }
}

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload
    // console.log(req.body.payload);

    const user = await User.create({
      first_name: payload.first_name,
      last_name: payload.last_name,
      saluation: payload.saluation,
      user_type: payload.type,
      name: payload.first_name + ' ' + payload.last_name,
      display_name: payload.display_name,
      email: payload.email,
      phone_number: payload.mobile,
      address: payload.address,
      org_id: req.user.org_id
    })

    const student = await Student.create({
      first_name: payload.first_name,
      last_name: payload.last_name,
      saluation: payload.saluation,
      type: payload.type,
      name: payload.first_name + ' ' + payload.last_name,
      display_name: payload.display_name,
      email: payload.email,
      mobile: payload.mobile,
      company_name: payload.company_name,
      company_email: payload.company_email,
      company_phone: payload.company_phone,
      alt_phone: payload.alt_phone,
      alt_email: payload.alt_email,
      contacts: payload.contacts,
      profile: payload.profile,
      social_info: {
        whatsapp: payload.whatsapp,
        instagram: payload.instagram,
        twitter: payload.twitter,
        facebook: payload.facebook,
        website_url: payload.website_url
      },
      address: payload.address,
      status: payload.status,
      org_id: req.user.org_id,
      user_id: user._id
    })

    return res.send({
      status: 200,
      message: 'Created Successfully',
      data: student
    })
  } catch (error) {
    next(error)
  }
}

// Update Customer

exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload
    const _id = payload._id
    console.log(_id)
    if (typeof _id !== 'undefined' && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: 'Not found!' })
    }

    const student = await Student.findById({ _id })
    if (!student) { return res.send({ status: 404, message: 'No data found', data: {} }) }
    await student.update({
      first_name: payload.first_name,
      last_name: payload.last_name,
      saluation: payload.saluation,
      type: payload.type,
      name: payload.first_name + ' ' + payload.last_name,
      display_name: payload.display_name,
      email: payload.email,
      mobile: payload.mobile,
      company_name: payload.company_name,
      company_email: payload.company_email,
      company_phone: payload.company_phone,
      alt_phone: payload.alt_phone,
      alt_email: payload.alt_email,
      contacts: payload.contacts,
      profile: payload.profile,
      social_info: {
        whatsapp: payload.whatsapp,
        instagram: payload.instagram,
        twitter: payload.twitter,
        facebook: payload.facebook,
        website_url: payload.website_url
      },
      address: payload.address,
      status: payload.status,
      org_id: req.user.org_id
    })
    return res.send({
      status: 200,
      message: 'Updated Successfully',
      data: student
    })
  } catch (error) {
    next(error)
  }
}

// Delete Customer

exports.delete = async function (req, res, next) {
  try {
    const ids = req.body._id

    ids.forEach((id) => {
      if (typeof id !== 'undefined' && !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.send({ status: 404, message: 'Not found!' })
      }
    })

    /** Delete */
    const customer = await Student.find(
      {
        _id: ids
      },
      null
    )
    // console.log(vendor);
    if (customer.length <= 0) {
      return res.send({
        status: 204,
        message: 'No Data found!'
      })
    }

    customer.forEach((doc) => {
      /** Delete File */
      doc.isDeleted = true
      doc.deletedAt = new Date()
      doc.save()
    })

    return res.send({
      status: 200,
      message: 'Deleted Successfully'
    })
  } catch (error) {
    next(error)
  }
}
