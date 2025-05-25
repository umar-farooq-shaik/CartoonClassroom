import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: any | null;
  dbUser: any | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fetch database user info when user is available
  const { data: dbUser } = useQuery({
    queryKey: ['/api/users/demo', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/users/demo/${user?.id}`);
      if (response.status === 404) {
        return null; // User doesn't exist in database yet
      }
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
  });

  const signIn = () => {
    // Simple demo authentication
    const demoUser = {
      id: 'demo_user_123',
      name: 'Demo User',
      email: 'demo@cartoonclassroom.com'
    };
    setUser(demoUser);
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('demo_user');
      queryClient.clear(); // Clear all cached data on sign out
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    dbUser,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
