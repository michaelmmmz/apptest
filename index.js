import express from "express";
import NodeMailer from "nodemailer";
import bodyParser from "body-parser";

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json("Hello Mane Updated");
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

app.post("/nodemail", async (req, res) => {
  console.log("accessed");
  const words = res.req.headers.value.split("_");
  console.log(words[0]);
  console.log(words[1]);

  let products = res.req.body;

  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "apptestbymzv1@gmail.com",
      pass: "qfwzaafiwmiqyoup",
    },
  });

  let output = `
        <h2>Thank you For Shopping With Double Trouble</h2>
<h3>Order Confirmation: </h3>
<h4>Shipping Address: ${words[2]}</h4>
    `;

  products.forEach((product) => {
    console.log(product.name);
    output += `
    <div style="display: flex">
  <img src="${product.imageURL}" alt="Product Image" width="250" height="250">
  <div>
    <div style="display: block">
      <div>${product.name}</div>
      <div>${product.price}</div>
      <div>${product.size}</div>
        <div>${product.quantity}</div>
      <div>${product.participantName}</div>
      <div>${product.participantGrade}</div>
      <div>${product.jerseySize}</div>
      <div>${product.jerseyShortSize}</div>
    </div>
  </div>
</div>
    `;
  });

  const options = {
    from: "doubletroubletrainingapp@gmail.com",
    to: [words[0], words[1], "doubletroubletrainingapp@gmail.com"],
    subject:
      "Order Confirmation for " + words[0] + " - Account Email: " + words[1],
    html: output,
  };

  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Sent: " + info.response);
  });
});
