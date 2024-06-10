const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
const stripe = require("stripe")(
  "sk_test_51PPmQqK9F79Hh53UfKqL3Pwcz6fFJ8Lcr6OQN8fQSmAVaUZvlE4ur1WiSIEDtXuCekY0006qTL2N2aIHkbyLOSBp00BrCb9gQl"
);

function convert_to_stripe_amount(amount_float) {
  amount_cents = Math.round(amount_float * 100);
  return amount_cents;
}

module.exports = {
  async paymentIntent(req, res) {
    try {
      const { amount } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.status(200).json({
          status: 200,
          clientSecret: paymentIntent.client_secret,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async payout(req, res) {
    try {
      const { amount, sellerId } = req.body;
      const commission = amount * 0.1;
      const payoutAmount = 5;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        // seller is freelancer
        await stripe.transfers.create({
          amount: payoutAmount,
          currency: "usd",
          destination: sellerId,
        });

        res.status(200).json({
          status: 200,
          success: true,
          payoutAmount: Math.random(payoutAmount),
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async paymentsheet(req, res) {
    try {
      const { amount } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: "2024-04-10" }
        );
        const paymentIntent = await stripe.paymentIntents.create({
          amount: convert_to_stripe_amount(amount),
          currency: "eur",
          customer: customer.id,
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter
          // is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {
            enabled: true,
          },
        });
        res.json({
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
          publishableKey:
            "pk_test_51PPmQqK9F79Hh53UdXQpmo2U6aIQelMMTd4DmVAZCubyfcSlIar2w80QsJIKzTttmTsEV72OFuFR6Z1cKiUGohH3005i0T1FT4",
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async updateStripeUser(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        // const account = await stripe.accounts.update("acct_1PPsvKGgpMRw5dP7", {
        //   capabilities: { transfers: { requested: true } },
        // });

        const account = await stripe.accounts.retrieve("acct_1PPsvKGgpMRw5dP7");

        // const account = await stripe.accounts.update("acct_1PPsvKGgpMRw5dP7",{
        //   capabilities: {
        //     card_payments: { requested: true },
        //     transfers: { requested: true },
        //   },
        //   business_type: "individual",
        //   individual: {
        //     first_name: "Saad",
        //     last_name: "Anwar",
        //   },
        // });
        res.status(200).json({
          status: 200,
          data: account.requirements,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
};
