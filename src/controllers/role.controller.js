const { Role, Permission } = require("../database/Models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { NotFoundException,ValidationException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
      populate: ["permissions"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }

    if(query.not_admin && query.not_admin == 'true'){
      query.name = { $ne: 'super_admin' } 
    }

    /** Filters added */
    if (req.query?.search && req.query?.search != "") {
      query.$or = [
        { name: { $regex: req.query.search } },
        { display_text: { $regex: req.query.search } }
      ];
    }

    console.log(query);

    const roles = await Role.paginate(query, options);
    if (roles.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: roles });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: roles,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var roles = await Role.findById({ _id });
    if (roles)
      return res.send({ status: 200, message: "Data found", data: roles });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;

    const role = await Role.create({
      name: payload.name,
      display_text:payload.display_text,
      created_by: req.user._id,
      org_id: req.user.org_id
    });

    if(payload.name === 'super_admin')
      return res.status(400).send({ status: 400, message: "Cannot give Super Admin Try using other role name", data: {} });

    const perm = [];
    if (Array.isArray(payload.permissions)) {
      /** Files */
      payload.permissions.forEach((file) => {
        perm.push(file);
      });
      role.permissions = perm;
      await role.save();
    }

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

    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    if(payload.name === 'super_admin')
      throw new ValidationException("Cannot give Super Admin Try using other role name");
    
    var role = await Role.findById({ _id });
    if (!role)
      return res.send({ status: 404, message: "No data found", data: {} });
  
    if(role.name === 'super_admin')
      throw new ValidationException("Cannot Edit Adminstrator Role");

    if(payload.name === 'super_admin')
    return res.status(400).send({ status: 400, message: "Cannot give Super Admin Try using other role name", data: {} });

    const perm = [];
    if (Array.isArray(payload.permissions)) {
      /** Permissions */
      payload.permissions.forEach((permission) => {
        perm.push(permission);
      });
      role.permissions = perm;
      await role.save();
    }
    const result = await role.update({
      name: payload.name,
      display_text:payload.display_text,
      created_by: req.user._id,
      org_id: req.user.org_id
    });

    /** Delete  */
    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        role.files.push(file);
      });

      (await role).save();
    }

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
    const role = await Role.find(
      {
        _id: ids,
      },
      null
    );
    console.log(role);
    if (role.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    role.forEach((doc) => {
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
