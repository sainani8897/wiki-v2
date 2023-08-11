const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { UnauthorizedException } = require("../../exceptions");

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    display_text: {
      type: String,
      required: true,
    },
    group_name: {
      type: String
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

permissionSchema.plugin(mongoosePaginate);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
