import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ensure test-friendly model stubs exist so unit tests can monkey-patch methods
// without throwing when the generated Prisma client doesn't expose a model.
const _ensureModelStubs = (models = []) => {
	models.forEach((name) => {
		try {
			if (!prisma[name]) prisma[name] = {};
		} catch (e) {
			// ignore
		}
	});
};

_ensureModelStubs([
	"coupon",
	"couponUsage",
	"order",
	"product",
	"customer",
	"idempotencyKey",
	"stripeWebhookEvent",
]);

export default prisma;
