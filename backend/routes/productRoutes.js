
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

// GET one product
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product." });
  }
});

// ADD product
router.post("/", async (req, res) => {
  try {
    const { name, description = "", price, category, image = "", stock = 0 } = req.body;

    if (!String(name || "").trim() || !String(category || "").trim()) {
      return res.status(400).json({
        message: "Product name and category are required.",
      });
    }

    if (price === "" || price === null || price === undefined ||
        !Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ message: "Enter a valid price." });
    }

    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock must be a non-negative whole number.",
      });
    }

    const product = await Product.create({
      name: String(name).trim(),
      description: String(description),
      price: Number(price),
      category: String(category).trim(),
      image: String(image),
      stock: Number(stock),
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product." });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found." });
    }

    const allowed = ["name", "description", "price", "category", "image", "stock"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product. Check the values." });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ message: "Product deleted successfully.", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product." });
  }
});

module.exports = router;
