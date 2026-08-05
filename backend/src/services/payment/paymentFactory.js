import StripeProvider from "./providers/stripeProvider.js";
import logger from "../../utils/logger.js";

export class PaymentFactory {
  constructor() {
    this.providers = new Map();
    this.registerDefaultProviders();
  }

  registerDefaultProviders() {
    const stripe = new StripeProvider();
    this.registerProvider("stripe", stripe);
    this.registerProvider("card", stripe);
  }

  /**
   * Register a custom open-source payment provider (e.g. BTCPay, Medusa, KillBill)
   * @param {string} key
   * @param {BasePaymentProvider} providerInstance
   */
  registerProvider(key, providerInstance) {
    this.providers.set(key.toLowerCase(), providerInstance);
  }

  /**
   * Get provider instance by name
   * @param {string} providerName
   * @returns {BasePaymentProvider}
   */
  getProvider(providerName = "stripe") {
    const key = String(providerName || "stripe").toLowerCase().trim();
    const provider = this.providers.get(key);

    if (!provider) {
      logger.error("payment_factory.unsupported_provider", { providerName });
      throw Object.assign(new Error("Only Stripe card payments are supported."), { status: 400, code: "UNSUPPORTED_PAYMENT_PROVIDER" });
    }

    return provider;
  }

  /**
   * Return configuration status of all available providers
   */
  getAvailableProviders() {
    const statusMap = {};
    for (const [key, provider] of this.providers.entries()) {
      // Deduplicate aliases like 'card' -> 'stripe'
      statusMap[provider.name.toLowerCase()] = {
        name: provider.name,
        isConfigured: provider.isConfigured(),
      };
    }
    return statusMap;
  }
}

const paymentFactory = new PaymentFactory();
export default paymentFactory;
