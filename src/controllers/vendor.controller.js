const { Vendor } = require("../database/Models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ["created_by"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    query.org_id = req.user.org_id;

    /** Filters added */
    if (req.query?.search && req.query?.search != "") {
      query.$or = [
        { first_name: { $regex: req.query.search } },
        { last_name: { $regex: req.query.search } },
        { email: { $regex: req.query.search } },
        { phone_number: { $regex: req.query.search } },
        { company_name: { $regex: req.query.search } },
        { company_phone: { $regex: req.query.search } },
        { alt_email: { $regex: req.query.search } },
        { alt_phone: { $regex: req.query.search } },
        { gst: { $regex: req.query.search } },
      ];
    }
    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status };
    }
    
    const vendors = await Vendor.paginate(query, options);
    if (vendors.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: vendors });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: vendors,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var vendor = await Vendor.findById({ _id });
    if (vendor)
      return res.send({ status: 200, message: "Data found", data: vendor });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;

    const vendor = await Vendor.create({
      display_name: payload.display_name,
      first_name: payload.first_name,
      last_name: payload.last_name,
      saluation: payload.saluation,
      email: payload.email,
      phone_number: payload.phone_number,
      company_name: payload.company_name,
      display_name: payload.display_name,
      status: payload.status,
      org_id: req.user.org_id,
      created_by: req.user._id,
      saluation: payload.saluation,
      company_email: payload.company_email,
      company_phone: payload.company_phone,
      alt_phone: payload.alt_phone,
      alt_email: payload.alt_email,
      pan: payload.pan,
      gst: payload.gst,
      contacts: payload.contacts,
      notes: payload.notes,
      // profile: payload.profile,
      social_info: {
        whatsapp: payload.whatsapp,
        instagram: payload.instagram,
        twitter: payload.twitter,
        facebook: payload.facebook,
        website_url: payload.website_url,
      },
      address: payload.address,
      shiping_address: payload.shiping_address,
    });

    return res.send({
      status: 200,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    const _id = payload._id;
    console.log(_id);
    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    var vendor = await Vendor.findById({ _id });
    if (!vendor)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await vendor.update({
      display_name: payload.display_name,
      first_name: payload.first_name,
      last_name: payload.last_name,
      saluation: payload.saluation,
      email: payload.email,
      phone_number: payload.phone_number,
      company_name: payload.company_name,
      display_name: payload.display_name,
      status: payload.status,
      org_id: req.user.org_id,
      created_by: req.user._id,
      saluation: payload.saluation,
      company_email: payload.company_email,
      company_phone: payload.company_phone,
      alt_phone: payload.alt_phone,
      alt_email: payload.alt_email,
      pan: payload.pan,
      gst: payload.gst,
      contacts: payload.contacts,
      notes: payload.notes,
      // profile: payload.profile,
      social_info: {
        whatsapp: payload.whatsapp,
        instagram: payload.instagram,
        twitter: payload.twitter,
        facebook: payload.facebook,
        website_url: payload.website_url,
      },
      address: payload.address,
      shiping_address: payload.shiping_address,
    });

    return res.send({
      status: 200,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const ids = req.body._id;

    ids.forEach((id) => {
      if (typeof id !== "undefined" && !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.send({ status: 404, message: "Not found!" });
      }
    });

    /** Delete */
    const vendor = await Vendor.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (vendor.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    vendor.forEach((doc) => {
      /** Delete File */
      doc.delete();
    });

    return res.send({
      status: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
