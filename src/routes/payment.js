const express = require("express");
const passport = require("passport");
const Razorpay = require("razorpay");
const Jobs = require("../models/Jobs");
const crypto = require("crypto");
const { calculateCost } = require("../helpers/utils");

const submitWorkflow = require("../controller/k8s");

const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

async function generateAndUpdateOrderId(jobId, amount) {
  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  await Jobs.findOneAndUpdate(
    { _id: jobId },
    { order_id: order.id },
    { new: true }
  );
  // console.log("doc", d0c);

  return order;
}

router.get(
  "/getCost",
  passport.authenticate("jwt_strategy", { session: false }),
  //   calculate cost here
  async (req, res) => {
    try {
      const cost = await calculateCost(req.user.id, req.query.job_id);
      console.log(`cost of job ${req.query.job_id} is ${cost} `);
      const orderObj = await generateAndUpdateOrderId(req.query.job_id, cost);
      res
        .status(200)
        .send({ order_obj: orderObj, rozor_key: process.env.RAZORPAY_API_KEY });
    } catch (err) {
      console.log(err);
    }
  }
);

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  console.log(req.body, isAuthentic, "paymentVerification");

  if (isAuthentic) {
    let jobObj = await Jobs.findOne({ order_id: razorpay_order_id });
    // start solving
    submitWorkflow.submitWorkflow(
      jobObj.user_id,
      jobObj._id,
      jobObj.pypsa_version
    );

    jobObj = await Jobs.findOneAndUpdate(
      { order_id: razorpay_order_id },
      {
        status: "solving",
        payment_id: razorpay_payment_id,
        payment_signature: razorpay_signature,
      },
      { new: true }
    );

    const baseUrl = process.env.BASE_FRONTEND_URL;

    res.redirect(`${baseUrl}/paymentsuccess?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

router.post("/verify", paymentVerification);

module.exports = router;
