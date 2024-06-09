import { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

export const useAuthState = (): boolean => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        await getCurrentUser();
        setIsSignedIn(true);
      } catch (error) {
        setIsSignedIn(false);
      }
    };

    checkAuthState();

    

    
  }, []);

  return isSignedIn;
};