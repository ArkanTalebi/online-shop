const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

const getAllCarts = async (req, res) => {
  const carts = await Cart.find().lean();

  if (!carts?.length) {
    return res.status(400).json({ message: "No carts found" });
  }

  const cartsWithUser = await Promise.all(
    carts.map(async (cart) => {
      const user = await User.findById(cart.user).lean().exec();
      return { ...cart, username: user?.username };
    })
  );

  res.json(cartsWithUser);
};

const createNewCart = async (req, res) => {
  const { user, productId, quantity } = req.body;

  if (!user || !productId || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Cart.findOne({ user, productId }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate cart item" });
  }

  const cart = await Cart.create({
    user,
    productId,
    quantity,
  });

  if (cart) {
    return res.status(201).json({ message: "New cart created", cart });
  } else {
    return res.status(400).json({ message: "Invalid cart data received" });
  }
};

const updateCart = async (req, res) => {
  const { id, user, productId, quantity } = req.body;

  if (!id || !user || !productId || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = await Product.findById(productId).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const cart = await Cart.findById(id).exec();

  if (!cart) {
    return res.status(400).json({ message: "Cart not found" });
  }

  cart.user = user;
  cart.productId = productId;
  cart.quantity = quantity;

  const updatedCart = await cart.save();

  res.json({
    message: `'${updatedCart._id}' updated`,
    cart: updatedCart,
  });
};

const deleteCart = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Cart ID required" });
  }

  const cart = await Cart.findById(id).exec();

  if (!cart) {
    return res.status(400).json({ message: "Cart not found" });
  }

  const result = await cart.deleteOne();

  const reply = `Cart '${result._id}' deleted`;

  res.json(reply);
};

module.exports = {
  getAllCarts,
  createNewCart,
  updateCart,
  deleteCart,
};
