const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc Get all orders
// @route GET /orders
// @access Private
const getAllOrders = async (req, res) => {
  // Get all orders from MongoDB
  const orders = await Order.find()
    .populate("products.product", "name")
    .lean()
    .exec();

  // If no orders
  if (!orders?.length) {
    return res.status(400).json({ message: "No orders found" });
  }

  // Add username to each order before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const ordersWithUser = await Promise.all(
    orders.map(async (order) => {
      const user = await User.findById(order.user).lean().exec();
      return { ...order, username: user.username };
    })
  );

  res.json(ordersWithUser);
};

// @desc Create new order
// @route POST /orders
// @access Private
const createNewOrder = async (req, res) => {
  const { user, products, totalPrice } = req.body;

  // Confirm data
  if (!user || !products?.length || !totalPrice) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const validUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (!validUsername) {
    return res.status(404).json({ message: `User with ID ${user} not found` });
  }

  for (const item of products) {
    if (
      !item.product ||
      typeof item.quantity !== "number" ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        message:
          "Each product must be valid and have a quantity of at least 1.",
      });
    }

    // Check if the product exists in the database
    const productExists = await Product.findById(item.product);
    if (!productExists) {
      return res
        .status(404)
        .json({ message: `Product with ID ${item.product} not found.` });
    }
  }

  // Create and store the new user
  const order = await Order.create({ user, products, totalPrice });

  if (order) {
    // Created
    return res.status(201).json({ message: "New order created" });
  } else {
    return res.status(400).json({ message: "Invalid order data received" });
  }
};

// @desc Update a order
// @route PATCH /orders
// @access Private
const updateOrder = async (req, res) => {
  const { id, user, products, totalPrice, completed } = req.body;

  // Confirm data
  if (
    !id ||
    !user ||
    !products?.length ||
    !totalPrice ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const validUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (!validUsername) {
    return res.status(404).json({ message: `User with ID ${user} not found` });
  }

  for (const item of products) {
    if (
      !item.product ||
      typeof item.quantity !== "number" ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        message:
          "Each product must be valid and have a quantity of at least 1.",
      });
    }

    // Check if the product exists in the database
    const productExists = await Product.findById(item.product);
    if (!productExists) {
      return res
        .status(404)
        .json({ message: `Product with ID ${item.product} not found.` });
    }
  }

  // Confirm order exists to update
  const order = await Order.findById(id).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  order.user = user;
  order.products = products;
  order.totalPrice = totalPrice;
  order.completed = completed;

  const updatedOrder = await order.save();

  res.json(`'${updatedOrder.title}' updated`);
};

// @desc Delete a order
// @route DELETE /orders
// @access Private
const deleteOrder = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Order ID required" });
  }

  // Confirm order exists to delete
  const order = await Order.findById(id).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  const result = await order.deleteOne();

  const reply = `Order with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllOrders,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
