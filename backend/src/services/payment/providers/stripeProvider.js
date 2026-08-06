import Stripe from "stripe";
import config from "../../../config/index.js";
import logger from "../../../utils/logger.js";
export default class StripeProvider {
  constructor() {
    this.name = "Stripe";
    this.client = null;
    this.initClient();
  }

  initClient() {
    try {
      const stripeOptions = {};
      if (config.STRIPE_API_VERSION) {
        stripeOptions.apiVersion = config.STRIPE_API_VERSION;
      }
      this.client = new Stripe(config.STRIPE_SECRET_KEY, stripeOptions);
    } catch (err) {
      logger.error("stripe.init_failed", { error: String(err) });
      throw Object.assign(new Error("Stripe could not be initialized. Check STRIPE_SECRET_KEY."), {
        code: "STRIPE_CONFIGURATION_ERROR",
      });
    }
  }

  isConfigured() {
    return Boolean(this.client);
  }

  async createPaymentOrder({ orderNumber, amount, currency = "USD", customer, metadata = {}, idempotencyKey }) {
    if (!this.client) {
      throw Object.assign(new Error("Stripe is not configured"), { status: 503, code: "STRIPE_CONFIGURATION_ERROR" });
    }

    const amountInCents = Math.round(amount * 100);
    let stripeCustomer = null;

    if (customer?.email) {
      try {
        stripeCustomer = await this.client.customers.create({
          email: customer.email,
          name: customer.fullName || undefined,
          phone: customer.phone || undefined,
          metadata: { orderNumber },
        });
      } catch (custErr) {
        logger.warn("stripe.customer_create_failed", { error: String(custErr) });
      }
    }

    const paymentIntent = await this.client.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      ...(stripeCustomer ? { customer: stripeCustomer.id } : {}),
      metadata: {
        orderNumber,
        ...metadata,
      },
      receipt_email: customer?.email || undefined,
      automatic_payment_methods: { enabled: true },
    }, idempotencyKey ? { idempotencyKey } : undefined);

    return {
      provider: "Stripe",
      providerOrderId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      stripeCustomerId: stripeCustomer?.id || null,
    };
  }

  async cancelPaymentOrder(providerOrderId) {
    if (!this.client || !providerOrderId) return null;

    try {
      return await this.client.paymentIntents.cancel(providerOrderId);
    } catch (error) {
      // The database error remains the primary failure. Cancellation is a
      // best-effort cleanup and may legitimately fail for an already-settled
      // PaymentIntent.
      logger.warn("stripe.payment_intent_cancel_failed", {
        providerOrderId,
        error: String(error),
      });
      return null;
    }
  }

  async processRefund({ transactionId, amount, reason }) {
    if (!this.client) {
      throw Object.assign(new Error("Stripe client not configured"), { status: 503, code: "STRIPE_CONFIGURATION_ERROR" });
    }

    const amountInCents = amount ? Math.round(amount * 100) : undefined;
    const refund = await this.client.refunds.create({
      payment_intent: transactionId,
      ...(amountInCents ? { amount: amountInCents } : {}),
      metadata: { reason: reason || "Customer refund" },
    });

    return {
      success: refund.status === "succeeded",
      refundId: refund.id,
      status: refund.status,
      rawResponse: refund,
    };
  }

  async parseWebhookEvent(req) {
    if (!this.client || !config.STRIPE_WEBHOOK_SECRET) {
      throw Object.assign(new Error("Stripe webhook configuration missing"), { status: 503, code: "STRIPE_CONFIGURATION_ERROR" });
    }

    const signature = req.headers["stripe-signature"];
    const event = this.client.webhooks.constructEvent(req.rawBody, signature, config.STRIPE_WEBHOOK_SECRET);

    const eventType = event.type;
    const eventObject = event.data.object;
    let status = "ignored";

    if (eventType === "payment_intent.succeeded") status = "paid";
    else if (eventType === "payment_intent.payment_failed") status = "failed";
    else if (eventType === "charge.refunded") status = "refunded";
    else if (eventType === "checkout.session.completed") status = "paid";

    return {
      eventId: event.id,
      eventType: event.type,
      status,
      orderNumber: eventObject.metadata?.orderNumber,
      providerOrderId: eventObject.payment_intent || eventObject.id,
      payload: event,
    };
  }
}
