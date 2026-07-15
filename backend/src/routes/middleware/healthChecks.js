import prisma from "../../database/prismaClient.js";

const readiness = async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "Service ready",
      data: { status: "ready" },
      meta: { code: "READY", status: 200 },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Service unavailable",
      data: { status: "not_ready" },
      meta: { code: "NOT_READY", status: 503 },
    });
  }
};

const liveness = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Service alive",
    data: { status: "alive" },
    meta: { code: "ALIVE", status: 200 },
  });
};

export { readiness, liveness };
