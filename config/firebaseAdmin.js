const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const databaseURL =
  process.env.FIREBASE_DATABASE_URL ||
  "https://biglean-4acf5-default-rtdb.firebaseio.com";

const projectId = process.env.FIREBASE_PROJECT_ID || "biglean-4acf5";

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
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
  console.log("Firebase Admin SDK already initialized");
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

    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    // Fallback initialization for development
    if (process.env.NODE_ENV === "development") {
      firebaseAdmin = admin.initializeApp({
        projectId,
      });
      console.log("Firebase Admin SDK initialized in development mode");
    }
  }
}

module.exports = admin;
