import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  AuthError 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA95Rt8oHRrmSGGHjWoari13E3yTlH8V-Q",
  authDomain: "bignlean-c2640.firebaseapp.com",
  projectId: "bignlean-c2640",
  storageBucket: "bignlean-c2640.firebasestorage.app",
  messagingSenderId: "1092388843773",
  appId: "1:1092388843773:web:741df8273c7578e0e3ce94",
  measurementId: "G-1G6B8Q252F",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const analyticsPromise =
  typeof window !== "undefined"
    ? isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)
    : Promise.resolve(null);

// Google provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  'prompt': 'select_account'
});

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
    const result = await signInWithPopup(auth, googleProvider);
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

export { auth, analyticsPromise };
