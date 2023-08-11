const { User } = require("../database/Models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
      populate: ['roles']
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
      query.status = { $in: req.query?.status}
    }
    
    const users = await User.paginate(query, options);
    if (users.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: users });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: users,
      });
  }
  catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const slug = req.params.slug;
  try {
    var user = await User.findOne({ name: slug }).select("-password").exec();
    if (user) return res.send(user);
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    const userInstance = await User.create(
      {
        email: req.body.email,
        name: req.body.first_name + " " + req.body.last_name,
        password: bcrypt.hashSync(req.body.password, saltRounds),
        roles: req.body.roles,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        status: req.body.status,
        phone_number:req.body.phone,
        // created_by: req.user._id,
        org_id: req.user.org_id
      }
    )
    return res.send({
      status: 200,
      message: "Created Successfully",
    });
  }
  catch (error) {
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
    
    var user = await User.findById({ _id });
    if (!user)
      return res.send({ status: 404, message: "No data found", data: {} });

    const userInstance = await user.update(
      {
        email: req.body.email,
        name: req.body.first_name + " " + req.body.last_name,
        roles: req.body.roles ?? user.roles,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        start_date: req.body.start_date ?? user.start_date,
        end_date: req.body.end_date ?? user.end_date,
        phone_number:req.body.phone_number ?? user.phone_number,
        status: req.body.status ?? user.status,
      }
    )    
    return res.send({
      status: 200,
      message: "Updated Successfully",
    });
  }
  catch (error) {
    next(error);
  }

};

exports.profile = async function (req, res, next) {
  return res.send({
    status: 200,
    message: "My Profile",
    data: req.user,
  });
};

exports.changePassword = async function (req, res, next) {
  try {
    const current_password = req.body.current_password;
    const new_password = await bcrypt.hashSync(req.body.new_password, 10);
    const user = req.user;
    const match = await bcrypt.compare(current_password, user.password);

    if (match) {
      user.password = new_password;
      const res = await user.save();
    }

    return res.send({
      status: 200,
      message: "My Profile",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
