const { Permission } = require("../database/Models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 100,
      sort: { date: -1 }
    };
    const query = req.query;
    delete query.org_id;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }

    const permissions = await Permission.paginate(query, options);
    if (permissions.totalDocs > 0)
      return res.send({
        status: 200,
        message: "Data found",
        data: permissions,
      });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: permissions,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var permissions = await Permission.findById({ _id });
    if (permissions)
      return res.send({
        status: 200,
        message: "Data found",
        data: permissions,
      });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;

    const permission = await Permission.create({
      name: payload.name,
      group_name:payload.group_name,
      display_text:payload.display_text,
      description:payload.description,
      created_by: req.user._id,
      org_id: req.user.org_id,
    });

    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        permission.files.push(file);
      });

      (await permission).save();
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

    var permission = await Permission.findById({ _id });
    if (!permission)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await permission.update({
      name: payload.name,
      group_name:payload.group_name,
      display_text:payload.display_text,
      description:payload.description,
      created_by: req.user._id,
      org_id: req.user.org_id,
    });

    /** Delete  */
    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        permission.files.push(file);
      });

      (await permission).save();
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
    const permission = await Permission.find(
      {
        _id: ids,
      },
      null
    );
    console.log(permission);
    if (permission.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    permission.forEach((doc) => {
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
