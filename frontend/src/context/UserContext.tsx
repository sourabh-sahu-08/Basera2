import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  availableUsers: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    api.fetchUsers()
      .then(data => {
        setAvailableUsers(data);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, availableUsers }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
