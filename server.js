import express from "express";
import cors from "cors";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendReceipt(email, amount) {
  const mailOptions = {
    from: `"LearnF1" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Thank you for your donation!",
    html: `
      <h2>Thank you for supporting LearnF1!</h2>
      <p>Your donation of <strong>$${amount}</strong> has been received.</p>
      <p>We truly appreciate your support — every bit helps us keep sharing Formula 1 knowledge!</p>
      <p>Best regards,<br/>The LearnF1 Team 🏎️</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

async function sendThankYouEmail(email, amount) {
  const mailOptions = {
    from: `"LearnF1" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Thank you for your donation!",
    html: `
      <h2>Thank you for supporting LearnF1!</h2>
      <p>Your donation of <strong>$${amount}</strong> helps us keep building the most comprehensive F1 learning resource 🏎️</p>
      <p>We truly appreciate your support and enthusiasm for Formula 1.</p>
      <p>Warm regards,<br/>The LearnF1 Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

app.get("/session-status", async (req, res) => {
  const { session_id } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    const paymentIntent = session.payment_intent;

    // ✅ Send thank-you email once
    await sendThankYouEmail(session.customer_email, session.amount_total / 100);

    res.json({
      customer_email: session.customer_email,
      amount_total: session.amount_total / 100,
      currency: session.currency,
      payment_status: session.payment_status,
      receipt_url: paymentIntent?.charges?.data?.[0]?.receipt_url || null,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Unable to retrieve session" });
  }
});



// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { amount, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: { name: "LearnF1 Donation" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // raw body for Stripe signature
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle event type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email;
      const amount = session.amount_total / 100;

      console.log(`✅ Payment received: ${amount} CAD from ${email}`);

      // Send thank-you email
      sendReceipt(email, amount).catch(console.error);
    }

    response.send();
  }
);

app.listen(4000, () => console.log("Server running on port 4000"));
