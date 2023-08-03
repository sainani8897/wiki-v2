const { Vendor, User } = require("../database/Models");
const Category = require("../database/Models/Category");
const Customer = require("../database/Models/Customer");
const Dashbord = require("../database/Models/Dashboard");
const Invoice = require("../database/Models/Invoice");
const SalesItemsHistory = require("../database/Models/SalesItemsHistory");
const SalesOrder = require("../database/Models/SalesOrder");
const { NotFoundException, ValidationException } = require("../exceptions");

exports.index = async function (req, res, next) {
  try {
    /** Pagination obj  */
    const options = {
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10,
      sort: { createdAt: -1 },
    };

    const query = req.query;
    if (
      typeof req.query._id !== "undefined" &&
      !req.query._id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.send({ status: 404, message: "Not found!" });
    }
    const dashboard = await Dashbord.paginate(query, options);
    if (dashboard.totalDocs > 0)
      return res.send({ status: 200, message: "Data found", data: dashboard });
    else
      return res.send({
        status: 204,
        message: "No Content found",
        data: dashboard,
      });
  } catch (error) {
    next(error);
  }
};

exports.show = async function (req, res, next) {
  const _id = req.params.id;
  try {
    var invoice = await Payment.findById({ _id });
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
    const org_id = req.query.org_id;
    const invoice = await Invoice.findOne({ _id: payload.invoice });
    const categoriesCount = await Category.countDocuments({ org_id }).exec();
    const salesCount = await SalesOrder.countDocuments({ org_id }).exec();
    const customersCount = await Customer.countDocuments({ org_id }).exec();
    const vendorsCount = await Vendor.countDocuments({ org_id }).exec();
    const usersCount = await User.countDocuments({ org_id }).exec();

    const salesRevenue = await SalesOrder.aggregate([
      { $match: { org_id } },
      {
        $group: {
          _id: "$org_id",
          total: { $sum: "$sale_details.total" },
        },
      },
    ]).exec();
    const salesReport = await SalesOrder.aggregate([
      { $match: { org_id } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          total: { $sum: "$sale_details.total" },
          sales: { $sum: 1 },
        },
      },
    ]).exec();

    const productsSales = await SalesItemsHistory.aggregate([
      { $match: { org_id } },
      {
        $group: {
          _id: "$product_id",
          total: { $sum: "$amount" },
          total_sales: { $sum: 1 },
        },
      },
      {
        $project: {
          product_id: "$_id",
          products: 1,
          total: 1,
          total_sales: 1,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_doc",
        },
      },
      { $sort: { total: -1 } },
    ]).exec();

    // const categorySales = await SalesItemsHistory.aggregate([
    //     { $match: { org_id } },
    //     {
    //       $group: {
    //         _id: "$products.category_id",
    //         total: { $sum: "$amount" },
    //       },
    //     },
    //     {
    //       $project: {
    //         product_id: "$_id",
    //         products: 1,
    //         total: 1,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "products",
    //         localField: "product_id",
    //         foreignField: "_id",
    //         as: "product_doc",
    //       },
    //     },
    //   ]).exec();

    const purchaseCount = await PurchaseOrder.countDocuments({ org_id }).exec();
    const lowQtyProducts = await Product.find({ org_id, qty: { $lt: 5 } })
      .sort({ qty: 1 })
      .limit(5);
    const recentInvoice = await Invoice.find({ org_id })
      .sort({ createdAt: -1 })
      .limit(5);
    const recentCustomers = await Customer.find({ org_id })
      .sort({ createdAt: -1 })
      .limit(5);

    const value = {
      salesCount,
      salesRevenue,
      purchaseCount,
      salesReport,
      productsCount,
      categoriesCount,
      productsOutStockCount,
      org_id,
      customersCount,
      vendorsCount,
      usersCount,
      productsSales,
      lowQtyProducts,
      recentInvoice,
      recentCustomers,
    };

    const dashboard = await Dashbord.findOneAndUpdate(
      { key: "admin_dashboard" },
      { key: "admin_dashboard", value, org_id },
      { upsert: true }
    );

    return res.send({
      status: 200,
      message: "Created Successfully",
      dashboard,
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

    var order = await Payment.findById({ _id });
    if (!order)
      return res.send({ status: 404, message: "No data found", data: {} });

    const result = await order.update({
      payment_date: payload.payment_date,
      payment_mode: payload.payment_mode,
      payment_type: payload.payment_type,
      deposit_to: payload.deposit_to,
      status: payload.status,
      notes: payload.notes,
      reference: payload.reference,
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
    const invoice = await Payment.find(
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
