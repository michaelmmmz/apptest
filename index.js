import express from "express";

const app = express();
const port = process.env.PORT || 3000; //add your port here
const PUBLISHABLE_KEY =
  "pk_test_51NNlt0B5G8BtepfW0VFC8IQuzlPkvdjYpUEJRDeg0MeYDvwaIEPFmBRugZnIrUNj0LuB3VbIhjrHLGZTihu8v6c200kvp3CXmU";
const SECRET_KEY =
  "sk_test_51NNlt0B5G8BtepfWWYCdgLCcqfeuliM2BLmxS9UzcGDNKcZtciEa2cDs9wegPsyE14nPdRd4uXzfU0SbQlVe0mJd00LvZTy4p5";
import Stripe from "stripe";

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2022-11-15" });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.json("Hello Mane");
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(res.req.headers.value), //lowest denomination of particular currency
      currency: "usd",
      payment_method_types: ["card"], //by default
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});
