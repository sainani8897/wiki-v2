const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Vendor, User } = require("./index");
const Category = require("./Category");
const Customer = require("./Customer");
const Invoice = require("./Invoice");
const SalesItemsHistory = require("./SalesItemsHistory");
const SalesOrder = require("./SalesOrder");

const dashboardSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    value: {
      type: Object,
      required: true,
    },
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

dashboardSchema.statics.saveOrgData = async function (org_id) {
  const [
    categoriesCount,
    salesCount,
    customersCount,
    vendorsCount,
    usersCount,
    salesRevenue,
    salesReport,
    productsSales,
    purchaseCount,
    lowQtyProducts,
    recentInvoice,
    recentCustomers,
  ] = await Promise.all([
   
    Category.countDocuments({ org_id }).exec(),
    SalesOrder.countDocuments({ org_id }).exec(),
    Customer.countDocuments({ org_id }).exec(),
    Vendor.countDocuments({ org_id }).exec(),
    User.countDocuments({ org_id }).exec(),
    SalesOrder.aggregate([
      { $match: { org_id } },
      {
        $group: {
          _id: "$org_id",
          total: { $sum: "$sale_details.total" },
        },
      },
    ]).exec(),
    SalesOrder.aggregate([
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
    ]).exec(),
    SalesItemsHistory.aggregate([
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
    ]).exec(),
    PurchaseOrder.countDocuments({ org_id }).exec(),
    Product.find({ org_id, qty: { $lt: 5 } }),
    Invoice.find({ org_id }).sort({ createdAt: -1 }).limit(5),
    Customer.find({ org_id }).sort({ createdAt: -1 }).limit(5),
  ]);

  // const productsCount = await Product.countDocuments({ org_id }).exec();
  // const productsOutStockCount = await Product.countDocuments({
  //   org_id,
  //   status: "Out of Stock",
  // }).exec();
  // const categoriesCount = await Category.countDocuments({ org_id }).exec();
  //   const salesCount = await SalesOrder.countDocuments({ org_id }).exec();
  //   const customersCount = await Customer.countDocuments({ org_id }).exec();
  //   const vendorsCount = await Vendor.countDocuments({ org_id }).exec();
  //   const usersCount = await User.countDocuments({ org_id }).exec();

  //   const salesRevenue = await SalesOrder.aggregate([
  //     { $match: { org_id } },
  //     {
  //       $group: {
  //         _id: "$org_id",
  //         total: { $sum: "$sale_details.total" },
  //       },
  //     },
  //   ]).exec();
  //   const salesReport = await SalesOrder.aggregate([
  //     { $match: { org_id } },
  //     {
  //       $group: {
  //         _id: {
  //           $dateToString: {
  //             format: "%Y-%m",
  //             date: "$createdAt",
  //           },
  //         },
  //         total: { $sum: "$sale_details.total" },
  //         sales: { $sum: 1 },
  //       },
  //     },
  //   ]).exec();

  //   const productsSales = await SalesItemsHistory.aggregate([
  //     { $match: { org_id } },
  //     {
  //       $group: {
  //         _id: "$product_id",
  //         total: { $sum: "$amount" },
  //         total_sales: { $sum: 1 },
  //       },
  //     },
  //     {
  //       $project: {
  //         product_id: "$_id",
  //         products: 1,
  //         total: 1,
  //         total_sales: 1,
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
  //     { $sort: { total: -1 } },
  //   ]).exec();

  //   const purchaseCount = await PurchaseOrder.countDocuments({ org_id }).exec();
  //   const lowQtyProducts = await Product.find({ org_id, qty: { $lt: 5 } })
  //     .sort({ qty: 1 })
  //     .limit(5);
  //   const recentInvoice = await Invoice.find({ org_id })
  //     .sort({ createdAt: -1 })
  //     .limit(5);
  //   const recentCustomers = await Customer.find({ org_id })
  //     .sort({ createdAt: -1 })
  //     .limit(5);

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

  const dashboardData = await this.findOneAndUpdate(
    { key: "admin_dashboard",org_id },
    { key: "admin_dashboard", value, org_id },
    { upsert: true }
  );
  return dashboardData;
};

/**
 * Pagination
 */

dashboardSchema.plugin(mongoosePaginate);

const Dashbord = mongoose.model("Dashbord", dashboardSchema);

module.exports = Dashbord;
