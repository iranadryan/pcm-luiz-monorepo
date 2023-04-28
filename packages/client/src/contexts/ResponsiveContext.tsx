import { createContext, useContext, useEffect, useState } from 'react';

interface ResponsiveContextProviderProps {
  children: React.ReactNode;
}

type PropsResponsiveContext = {
  headerHeight: string;
};

const DEFAULT_VALUE: PropsResponsiveContext = {
  headerHeight: '92px',
};

const ResponsiveContext = createContext<PropsResponsiveContext>(DEFAULT_VALUE);

export function ResponsiveContextProvider({
  children,
}: ResponsiveContextProviderProps) {
  const [headerHeight, setHeaderHeight] = useState(window.innerWidth >= 768 ? '0px' : '92px');

  useEffect(() => {
    function handleWindowResize() {
      if (window.innerWidth >= 768) {
        setHeaderHeight('0px');
      } else {
        setHeaderHeight('92px');
      }
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={{ headerHeight }}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export const useResponsiveContext = () => useContext(ResponsiveContext);
