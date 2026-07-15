const stripHtml = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=\s*/gi, "")
    .trim();
};

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, sanitizeValue(entryValue)]));
  }

  if (typeof value === "string") {
    return stripHtml(value);
  }

  return value;
};

const sanitizeObjectInPlace = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value) || (value && typeof value === "object")) {
      sanitizeObjectInPlace(value);
      return;
    }

    if (typeof value === "string") {
      object[key] = stripHtml(value);
    }
  });
};

const inputSanitizer = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === "object") {
    sanitizeObjectInPlace(req.query);
  }

  if (req.params && typeof req.params === "object") {
    sanitizeObjectInPlace(req.params);
  }

  next();
};

export default inputSanitizer;
