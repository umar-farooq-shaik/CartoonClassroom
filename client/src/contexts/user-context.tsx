import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth-context';

interface UserContextType {
  progress: any | null;
  achievements: any[] | null;
  stories: any[] | null;
  textbooks: any[] | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { dbUser } = useAuth();

  const { data: progress } = useQuery({
    queryKey: ['/api/progress/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const { data: achievements } = useQuery({
    queryKey: ['/api/achievements/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const { data: stories } = useQuery({
    queryKey: ['/api/stories/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const { data: textbooks } = useQuery({
    queryKey: ['/api/textbooks/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const isLoading = !dbUser;

  const value = {
    progress,
    achievements,
    stories,
    textbooks,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
