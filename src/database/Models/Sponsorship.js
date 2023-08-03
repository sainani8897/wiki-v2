const mongoose = require("mongoose");
const SponsorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const SponsorshipSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      required: true,
    },
    members: {
      type: [SponsorSchema],
    },
    investment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
    },
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  },
);

const Sponsorship = mongoose.model("Sponsorship", SponsorshipSchema);

module.exports = Sponsorship;
