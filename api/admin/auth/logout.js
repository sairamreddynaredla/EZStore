import { sendSuccess, setCorsHeaders } from "../_shared.js";

export default async function handler(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  sendSuccess(res, null, "Logout successful");
}
