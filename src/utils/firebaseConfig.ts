import { getApp, getApps, initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import type { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAJBGWLW6blCxLNUzFaZf9pxwrP36PYKTs",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "bignlean-fbffd.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://bignlean-fbffd-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bignlean-fbffd",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "bignlean-fbffd.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "394356090128",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:394356090128:web:9b6ae4290fcaa390977195",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GB5FME9F4M",
};

const firebaseSetupErrorMessage =
  "Firebase web app config is missing. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_APP_ID, and NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID from Firebase Console.";

const isFirebaseWebConfigMissing =
  !firebaseConfig.apiKey ||
  !firebaseConfig.appId ||
  !firebaseConfig.messagingSenderId;

let authInitError: unknown = null;
let auth: Auth | null = null;

const getFirebaseSetupErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "auth/invalid-api-key"
  ) {
    return "Firebase web API key is invalid. Set NEXT_PUBLIC_FIREBASE_API_KEY from the Firebase Web App config, not the service account JSON.";
  }

  return firebaseSetupErrorMessage;
};

const getFirebaseAuth = (): Auth | null => {
  if (isFirebaseWebConfigMissing) {
    authInitError = new Error(firebaseSetupErrorMessage);
    return null;
  }

  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getAuth(app);
  } catch (error) {
    authInitError = error;
    return null;
  }
};

const getFirebaseAuthOrError = () => {
  const firebaseAuth = auth || getFirebaseAuth();

  if (firebaseAuth) {
    auth = firebaseAuth;
  }

  if (!firebaseAuth) {
    const error = authInitError || new Error(firebaseSetupErrorMessage);

    return {
      auth: null,
      error,
      errorMessage: getFirebaseSetupErrorMessage(error),
    };
  }

  return {
    auth: firebaseAuth,
    error: null,
    errorMessage: "",
  };
};

auth = getFirebaseAuth();

// Google provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  'prompt': 'select_account'
});

// Facebook provider setup
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Helper function to check if error is a Firebase Auth error with code
const isFirebaseAuthError = (error: unknown): error is { code: string } => {
  return typeof error === 'object' && 
         error !== null && 
         'code' in error && 
         typeof (error as any).code === 'string';
};

// Google sign-in function
export const signInWithGoogle = async () => {
  try {
    console.log("Google sign-in starting...");
    const { auth: firebaseAuth, error, errorMessage } = getFirebaseAuthOrError();

    if (!firebaseAuth) {
      return {
        success: false,
        error,
        errorMessage,
      };
    }

    const result = await signInWithPopup(firebaseAuth, googleProvider);
    console.log("Google sign-in successful");
    const idToken = await result.user.getIdToken();
    
    return { 
      success: true, 
      idToken, 
      user: result.user 
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Google sign-in failed";
    
    // Type guard to check error structure before accessing properties
    if (isFirebaseAuthError(error)) {
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google sign-in is not enabled in Firebase Console. Please contact support.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups for this website.";
      }
    }
    
    return { 
      success: false, 
      error,
      errorMessage
    };
  }
};

// Facebook sign-in function
export const signInWithFacebook = async () => {
  try {
    console.log("Facebook sign-in starting...");
    const { auth: firebaseAuth, error, errorMessage } = getFirebaseAuthOrError();

    if (!firebaseAuth) {
      return {
        success: false,
        error,
        errorMessage,
      };
    }

    const result = await signInWithPopup(firebaseAuth, facebookProvider);
    console.log("Facebook sign-in successful");
    const idToken = await result.user.getIdToken();
    
    // Get Facebook access token (can be useful for additional FB API calls)
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    
    return { 
      success: true, 
      idToken, 
      user: result.user,
      accessToken
    };
  } catch (error) {
    console.error("Facebook sign-in error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Facebook sign-in failed";
    
    // Type guard to check error structure before accessing properties
    if (isFirebaseAuthError(error)) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with the same email address but different sign-in credentials.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups for this website.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in process was cancelled.";
      }
    }
    
    return { 
      success: false, 
      error,
      errorMessage
    };
  }
};

export { auth };
