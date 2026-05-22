const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

const databaseURL =
  process.env.FIREBASE_DATABASE_URL ||
  "https://bignlean-fbffd-default-rtdb.firebaseio.com";

const projectId = process.env.FIREBASE_PROJECT_ID || "bignlean-fbffd";

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      type: "service_account",
      project_id: projectId,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_CERT_URL ||
        "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
    };
  }

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, "..", "firebase-service-account.json");

  if (fs.existsSync(serviceAccountPath)) {
    return require(serviceAccountPath);
  }

  return null;
};

// Check if Firebase is already initialized
let firebaseAdmin;
try {
  firebaseAdmin = admin.app(); // Try to get the default app
  logger.info("Firebase Admin SDK already initialized");
} catch (error) {
  // Firebase not initialized yet, initialize it
  try {
    const serviceAccount = loadServiceAccount();

    if (serviceAccount) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL,
      });
    } else {
      firebaseAdmin = admin.initializeApp({ projectId });
    }

    logger.info("Firebase Admin SDK initialized successfully");
  } catch (error) {
    logger.error({ err: error }, "Error initializing Firebase Admin SDK");
    // Fallback initialization for development
    if (process.env.NODE_ENV === "development") {
      firebaseAdmin = admin.initializeApp({
        projectId,
      });
      logger.info("Firebase Admin SDK initialized in development mode");
    }
  }
}

module.exports = admin;
