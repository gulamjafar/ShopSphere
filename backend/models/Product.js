
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: (value) => value.trim().length > 0,
    message: "Product name cannot be empty.",
  },
},
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: (value) => value.trim().length > 0,
    message: "Product category cannot be empty.",
  },
},
    image: {
      type: String,
      default: "",
    },
    stock: {
  type: Number,
  default: 0,
  min: 0,
  validate: {
    validator: Number.isInteger,
    message: "Stock must be a non-negative whole number.",
  },
},
  },
  { timestamps: true }
);

// Keep the existing frontend compatible with p.id.
productSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Product", productSchema);
