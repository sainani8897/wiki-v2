const { Organization } = require("../database/Models");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    /** Filters added */
    if (req.query?.search && req.query?.search != "") {
      query.$or = [
        { name: { $regex: req.query.search } },
        { email: { $regex: req.query.search } },
        { phone_number: { $regex: req.query.search } },
      ];
    }
    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status };
    }

    const orgs = await Organization.paginate(query, options);
    if (orgs.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: orgs });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: orgs,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const slug = req.params.slug;
  try {
    const org = await Organization.findOne({ name: slug })
      .select("-password")
      .exec();
    if (org) return res.send(org);
    throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    const userInstance = await Organization.create({
      email: req.body.email,
      name: req.body.first_name + " " + req.body.last_name,
      password: bcrypt.hashSync(req.body.password, saltRounds),
      roles: req.body.roles,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status,
      phone_number: req.body.phone,
      created_by: req.user._id,
      org_id: req.user.org_id,
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
    const payload = req.body;
    const _id = payload._id;

    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    var user = await Organization.findById({ _id });
    if (!user)
      return res.send({ status: 404, message: "No data found", data: {} });

    const userInstance = await user.update({
      email: req.body.email,
      name: req.body.first_name + " " + req.body.last_name,
      roles: req.body.roles ?? user.roles,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      start_date: req.body.start_date ?? user.start_date,
      end_date: req.body.end_date ?? user.end_date,
      phone_number: req.body.phone_number ?? user.phone_number,
      status: req.body.status ?? user.status,
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
    const org = await Organization.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (org.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    org.forEach((doc) => {
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
