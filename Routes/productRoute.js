const express = require("express");
const { productModel } = require("../Models/productModel");
const { authenticate } = require("../auth/auth");
const productRoute = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);


productRoute.post("/create", authenticate, async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    await product.save();
    return res
      .status(200)
      .json({ success: true, msg: "Product created", product });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, msg: "Error in creating product", error });
  }
});

productRoute.get("/all", async (req, res) => {
  try {
    const products = await productModel.find();
    return res
      .status(200)
      .json({ success: true, productCount: products.length, products })
      .sort({ price: 1 });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, msg: "Error in fetching products", error });
  }
});
productRoute.get("/product/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, msg: "Error in fetching product", error });
  }
});
productRoute.get("/all/:interval", authenticate, async (req, res) => {
  try {
    const interval = req.params.interval;
    const products = await productModel
      .find({ interval: { $regex: interval, $options: "i" } })
      .sort({ price: 1 });
    return res
      .status(200)
      .json({ success: true, productCount: products.length, products });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, msg: "Error in fetching products", error });
  }
});

productRoute.post("/create-checkout-session", authenticate, async (req, res) => {
  try {
  const plan = req.body;

  const lineItems = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: plan.plans,
        },
        unit_amount: plan.price * 100,
      },
      quantity: 1,
    },
  ];
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,

    mode: "payment",
    success_url: `http://localhost:5173/success`,
    cancel_url: `http://localhost:5173/cancel`,
  });
  return res.status(200).json({ sessionId: session.id});
  } catch (error) {
      return res.status(403).json({success:false, msg:"Error in making payments", error})

  }
});

module.exports = { productRoute };
