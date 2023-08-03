const Invoice = require("../database/Models/Invoice");
const { NotFoundException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
      populate: ["customer_id", "items.product_id", "sales_order"],
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    if (req.query?.search && req.query?.search != "") {
      query.$or = [
        { invoice_no: { $regex: req.query.search } },
        { order_no: { $regex: req.query.search } },
        { status: { $regex: req.query.search } },
      ];
    }

    if (req.query?.status && Array.isArray(req.query?.status)) {
      query.status = { $in: req.query?.status };
    }

    if (req.query?.payment_status && Array.isArray(req.query?.payment_status)) {
        query.payment = { $in: req.query?.payment_status };
    }

    const invoices = await Invoice.paginate(query, options);
    if (invoices.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: invoices });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: invoices,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var invoice = await Invoice.findById({ _id });
    if (invoice)
      return res.send({ status: 200, message: "Data found", data: invoice });
    else throw new NotFoundException("No Data Found!");
  } catch (error) {
    next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    /** Basic Form */
    const payload = req.body.payload;

    const invoice = await Invoice.create({
      order_no: payload.order_no,
      invoice_no: payload.invoice_no,
      invoice_date: payload.invoice_date,
      shipment_date: payload.shipment_date,
      customer_id: payload.customer_id,
      sales_executives: payload.sales_executives,
      items: payload.items,
      sales_order: payload.sales_order,
      sale_details: payload.sale_details,
      customer_comments: payload.customer_comments,
      status: payload.status,
      created_by: req.user._id,
      org_id: req.user.org_id,
    });

    if (Array.isArray(payload.files)) {
      /** Files */
      payload.files.forEach((file) => {
        invoice.files.push(file);
      });

      (await invoice).save();
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
    console.log(_id);
    if (typeof _id !== "undefined" && !_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.send({ status: 404, message: "Not found!" });
    }

    var order = await Invoice.findById({ _id });
    if (!order)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await order.update({
      order_no: payload.order_no,
      invoice_no: payload.invoice_no,
      invoice_date: payload.invoice_date,
      shipment_date: payload.shipment_date,
      customer_id: payload.customer_id,
      sales_executives: payload.sales_executives,
      sales_order: payload.sales_order,
      items: payload.items,
      sale_details: payload.sale_details,
      customer_comments: payload.customer_comments,
      status: payload.status,
      created_by: req.user._id,
      org_id: req.user.org_id,
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
    const invoice = await Invoice.find(
      {
        _id: ids,
      },
      null
    );
    // console.log(vendor);
    if (invoice.length <= 0) {
      return res.send({
        status: 204,
        message: "No Data found!",
      });
    }

    invoice.forEach((doc) => {
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
