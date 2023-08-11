const { MediaManager } = require("../database/Models");
const { NotFoundException } = require("../exceptions");
const fs = require("fs");
const { disks } = require("../config/filesystem");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { date: -1 },
      populate: ["created_by"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }

    /**Getting only authorized user data */
    req.query.created_by = req.user._id;

    const media = await MediaManager.paginate(query, options);
    if (media.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: media });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: media,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var media_manager = await MediaManager.findById({ _id });
    if (media_manager)
      return res.send({
        status: 200,
        message: "Data found",
        data: media_manager,
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

    /** Create */
    const media_manager = await MediaManager.create({
      name: req.file.originalname,
      url: disks.local.root + "/files/" + req.file.filename,
      full_url: disks.public.url + "/storage/files/" + req.file.filename,
      created_by: req.user._id,
    });

    return res.send({
      status: 200,
      message: "Created Successfully",
      data: media_manager,
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
    const media_managers = await MediaManager.find(
      {
        _id: ids,
      },
      null
    );
    if (media_managers.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    media_managers.forEach((media_manager) => {
      /** Delete File */
      // const currDir = path.join(`${__dirname}../${media_manager.url}`);
      fs.unlink(media_manager.url, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file: " + media_manager.url);
        }
      });
      media_manager.delete();
    });

    return res.send({
      status: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
