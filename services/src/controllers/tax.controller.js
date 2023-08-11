const Tax = require("../database/Models/Tax");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {

    try
    {
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
      const taxes = await Tax.paginate(query, options);
      if (taxes.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: taxes });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: taxes,
      });
    }
    catch(error)
    {
      next(error);
    }
  };
  
  exports.show = async function (req, res, next) {
    const _id = req.params.id;
    try {
      var tax = await Tax.findById({ _id });
      if (tax)
        return res.send({ status: 200, message: "Data found", data: tax });
      else throw new NotFoundException("No Data Found!");
    } catch (error) {
      next(error);
    }
  };

exports.create = async function (req, res, next) {
    try {
      /** Basic Form */
       const payload = req.body.payload;
       console.log(req.body.payload);
        const tax = await Tax.create({
          title : payload.title,
          type : payload.type,
          value : payload.value,
          status : payload.status,
          org_id : req.user.org_id
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
  
      var tax = await Tax.findById({ _id });
      if (!tax)
        return res.send({ status: 404, message: "No data found", data: {} });
  
      const result = await tax.update({
        title : payload.title,
        type : payload.type,
        value : payload.value,
        status : payload.status,
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
      const tax = await Tax.find(
        {
          _id: ids,
        },
        null
      );
      // console.log(vendor);
      if (tax.length <= 0) {
        return res.send({
          status: 204,
          message: "No Data found!",
        });
      }
  
      tax.forEach((doc) => {
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