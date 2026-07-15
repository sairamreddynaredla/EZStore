import crypto from "crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export const buildGoogleAuthUrl = ({ clientId, redirectUri, state }) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString().replace(/\+/g, "%20")}`;
};

export const exchangeGoogleCode = async ({ code, clientId, clientSecret, redirectUri }) => {
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(tokenData?.error_description || tokenData?.error || "Unable to exchange Google authorization code");
  }

  const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    throw new Error("Unable to fetch your Google profile");
  }

  return userInfoResponse.json();
};

export const createGoogleState = () => crypto.randomBytes(16).toString("hex");
