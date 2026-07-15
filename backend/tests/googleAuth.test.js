import test from "node:test";
import assert from "node:assert/strict";
import { buildGoogleAuthUrl } from "../src/services/shared/googleAuth.js";

test("buildGoogleAuthUrl includes the configured redirect URI and required scopes", () => {
  const url = buildGoogleAuthUrl({
    clientId: "google-client-id",
    redirectUri: "https://example.com/api/auth/google/callback",
    state: "abc123",
  });

  assert.match(url, /client_id=google-client-id/);
  assert.match(url, /redirect_uri=https%3A%2F%2Fexample.com%2Fapi%2Fauth%2Fgoogle%2Fcallback/);
  assert.match(url, /response_type=code/);
  assert.match(url, /scope=openid%20email%20profile/);
  assert.match(url, /state=abc123/);
});
