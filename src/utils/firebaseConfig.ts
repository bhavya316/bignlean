import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup,
  AuthError 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEBdcprmDMMdcbVDA9IorfuVqSOu85Eoc",
  authDomain: "biglean-4acf5.firebaseapp.com",
  databaseURL: "https://biglean-4acf5-default-rtdb.firebaseio.com",
  projectId: "biglean-4acf5",
  storageBucket: "biglean-4acf5.appspot.com",
  messagingSenderId: "903486712545",
  appId: "1:903486712545:web:a1dd8b044f852e3fff6caf",
  measurementId: "G-YRQ81RX7QW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

// Facebook sign-in function
export const signInWithFacebook = async () => {
  try {
    console.log("Facebook sign-in starting...");
    const result = await signInWithPopup(auth, facebookProvider);
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