const Document = require("../database/Models/Document");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
      populate: ["files", "created_by"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }

    const documents = await Document.paginate(query, options);
    if (documents.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: documents });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: documents,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var document = await Document.findById({ _id });
    if (document)
      return res.send({ status: 200, message: "Data found", data: document });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;

    const document = await Document.create({
      name: payload.name,
      added_at: payload.added_at,
      created_by: req.user._id,
    });

    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        document.files.push(file);
      });

      (await document).save();
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

    var document = await Document.findById({ _id });
    if (!document)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await document.update({
      name: payload.name,
      added_at: payload.added_at,
      created_by: req.user._id,
    });

    /** Delete  */
    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        document.files.push(file);
      });

      (await document).save();
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
    const document = await Document.find(
      {
        _id: ids,
      },
      null
    );
    console.log(document);
    if (document.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    document.forEach((doc) => {
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
