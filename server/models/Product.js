const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(AutoIncrement, {
  inc_field: "productNumber",
  id: "productNums",
  start_seq: 100,
});

module.exports = mongoose.model("Product", productSchema);
