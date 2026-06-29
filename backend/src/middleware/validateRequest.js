export const validateRequest = (schema) => (req, res, next) => {
  const target = schema && typeof schema === "object" && !("safeParse" in schema)
    ? {
        body: schema.body ?? null,
        params: schema.params ?? null,
        query: schema.query ?? null,
      }
    : { body: schema };

  const checks = Object.entries(target).filter(([, value]) => value);
  for (const [key, validator] of checks) {
    const { error } = validator.safeParse(req[key]);
    if (error) {
      const message = error.issues?.[0]?.message || "Validation failed";
      return res.status(400).json({ success: false, message, data: null, meta: { code: "VALIDATION_ERROR" } });
    }
  }

  return next();
};
