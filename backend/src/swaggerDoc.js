const buildOpenApiDocument = (appConfig) => ({
  openapi: "3.0.3",
  info: {
    title: "EZStore API",
    version: "1.0.0",
    description: "Production-ready API documentation for the EZStore backend.",
  },
  servers: [
    {
      url: appConfig.BACKEND_URL,
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Service liveness check",
        responses: {
          200: {
            description: "Service is running",
          },
        },
      },
    },
    "/ready": {
      get: {
        summary: "Service readiness check",
        responses: {
          200: {
            description: "Service is ready",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
});

export default buildOpenApiDocument;
