const Category = require("../database/Models/Category");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
      populate: ["parent_id"],
    };
    const query = req.query;

    /** Ignore root  */
    if (query?.ignore_root == "true") {
      query.category_name = { $ne: "Root" };
    }

    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    const categories = await Category.paginate(query, options);
    if (categories.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: categories });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: categories,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var category = await Category.findById({ _id });
    if (category)
      return res.send({ status: 200, message: "Data found", data: category });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;
    const category = await Category.create({
      category_name: payload.category_name,
      slug: payload.category_name,
      parent_id: payload.parent_id ?? null,
      sort: payload.sort,
      status: payload.status,
      icon: payload.icon ?? null,
      org_id: req.user.org_id,
    });
    //category.icon = payload.icon

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

    var category = await Category.findById({ _id });
    if (!category)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await category.update({
      category_name: payload.category_name,
      slug: payload.slug,
      parent_id: payload.parent_id,
      sort: payload.sort,
      status: payload.status,
      icon: payload.icon,
    });

    // category.icon = payload.icon

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
    const category = await Category.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (category.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    category.forEach((doc) => {
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

exports.createRootCategory = async function (req, res, next) {
  try {
    /** Basic Form */
    rootCategory = await Category.findOne({
      category_name: "Root",
      slug: "root",
      org_id: req.user.org_id,
    });

    if (rootCategory) {
      return res.status(400).send({
        status: 400,
        message: "Root all ready Created",
      });
    }

    const category = await Category.create({
      category_name: "Root",
      slug: "root",
      parent_id: null,
      sort: 1,
      status: "Active",
      icon: null,
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
