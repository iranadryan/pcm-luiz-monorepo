import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

interface IAuthUser {
  name: string;
  role: 'ADMIN' | 'DRIVER' | 'MECHANIC' | 'ATTENDANT';
}

type PropsAuthContext = {
  user: IAuthUser | null;
  setUser: (value: IAuthUser | null) => void;
  signOut: () => void;
};

const DEFAULT_VALUE: PropsAuthContext = {
  user: null,
  setUser: () => null,
  signOut: () => null,
};

const AuthContext = createContext<PropsAuthContext>(DEFAULT_VALUE);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<IAuthUser | null>(null);

  function signOut() {
    setUser(null);
  }

  useEffect(() => {
    const user = sessionStorage.getItem('user');

    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
