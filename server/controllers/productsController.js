const Product = require("../models/Product");

const getAllAvailableProducts = async (req, res) => {
  const products = await Product.find({ available: true }).lean();

  res.json(products);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find().lean();

  res.json(products);
};

const createNewProduct = async (req, res) => {
  const { name, price, description, weight, imageUrl, available } = req.body;

  if (!name || !price || !imageUrl) {
    return res
      .status(400)
      .json({ message: "Name, price, and imageUrl fields are required" });
  }

  const duplicate = await Product.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate product name" });
  }

  const product = await Product.create({
    name,
    price,
    description: description || "",
    weight: weight || "",
    imageUrl,
    available: available !== undefined ? available : true,
  });

  if (product) {
    return res.status(201).json({ message: "New product created", product });
  } else {
    return res.status(400).json({ message: "Invalid product data received" });
  }
};

const updateProduct = async (req, res) => {
  const { id, name, description, price, weight, imageUrl, available } =
    req.body;

  if (!id || !name || !price || !imageUrl) {
    return res
      .status(400)
      .json({ message: "ID, name, price, and imageUrl are required" });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const duplicate = await Product.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate product name" });
  }

  product.name = name;
  product.description = description || product.description;
  product.price = price;
  product.weight = weight || product.weight;
  product.imageUrl = imageUrl;
  product.available = available !== undefined ? available : product.available;

  const updatedProduct = await product.save();

  res.json({
    message: `'${updatedProduct.name}' updated`,
    product: updatedProduct,
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID required" });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const result = await product.deleteOne();

  const reply = `Product '${result.name}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getAllAvailableProducts,
};
