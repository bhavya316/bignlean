const admin = require("firebase-admin");

// Check if Firebase is already initialized
let firebaseAdmin;
try {
  firebaseAdmin = admin.app(); // Try to get the default app
  console.log("Firebase Admin SDK already initialized");
} catch (error) {
  // Firebase not initialized yet, initialize it
  try {
    // Use the correct service account for biglean-4acf5
    const serviceAccount = require("../firebase-service-account.json");
    
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://biglean-4acf5-default-rtdb.firebaseio.com"
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    // Fallback initialization for development
    if (process.env.NODE_ENV === "development") {
      firebaseAdmin = admin.initializeApp({
        projectId: "biglean-4acf5"
      });
      console.log("Firebase Admin SDK initialized in development mode");
    }
  }
}

module.exports = admin;