'use client';
import {useState, useEffect, createContext, useContext} from 'react';
import {getAuth, onAuthStateChanged, User} from 'firebase/auth';
import {firebaseApp} from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true, // Initially set to true as we are checking the auth state
});

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeAuth = async () => {
      if (firebaseApp) {
        try {
          const auth = getAuth(firebaseApp);
          unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
          });
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          setIsLoading(false);
        }
      } else {
        console.warn("Firebase app not initialized.");
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup subscription on unmount
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{user, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

