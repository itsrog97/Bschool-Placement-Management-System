import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to indicate ongoing sign-in flow
let isSigningIn = false;
// In-memory cache for access token (never in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export interface AuthSuccessResult {
  firebaseUser: FirebaseUser;
  accessToken: string;
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
}

// Initialize Auth State Listener
export const initAuth = (
  onAuthSuccess?: (result: AuthSuccessResult) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) {
          onAuthSuccess({
            firebaseUser: user,
            accessToken: cachedAccessToken,
            email: user.email || '',
            displayName: user.displayName || 'Placement Coordinator',
            photoURL: user.photoURL || '',
            uid: user.uid
          });
        }
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign In with Google Popup
export const googleSignIn = async (): Promise<AuthSuccessResult> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    // Fallback token extraction or token string
    cachedAccessToken = credential?.accessToken || (await result.user.getIdToken());

    return {
      firebaseUser: result.user,
      accessToken: cachedAccessToken,
      email: result.user.email || '',
      displayName: result.user.displayName || 'Placement Coordinator',
      photoURL: result.user.photoURL || '',
      uid: result.user.uid
    };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Sign Up with Google Popup (Aliases signInWithPopup with new account intent)
export const googleSignUp = async (): Promise<AuthSuccessResult> => {
  return googleSignIn();
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  cachedAccessToken = null;
  await signOut(auth);
};

// Get current cached token
export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};
