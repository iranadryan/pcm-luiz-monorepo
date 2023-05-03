import { createContext, useContext, useEffect, useState } from 'react';

interface ResponsiveContextProviderProps {
  children: React.ReactNode;
}

type PropsResponsiveContext = {
  headerHeight: string;
  isMobile: boolean;
};

const DEFAULT_VALUE: PropsResponsiveContext = {
  headerHeight: '92px',
  isMobile: true,
};

const ResponsiveContext = createContext<PropsResponsiveContext>(DEFAULT_VALUE);

export function ResponsiveContextProvider({
  children,
}: ResponsiveContextProviderProps) {
  const [headerHeight, setHeaderHeight] = useState(
    window.innerWidth >= 768 ? '0px' : '92px'
  );
  const [isMobile, setIsMobile] = useState(
    window.innerWidth >= 768 ? false : true
  );

  useEffect(() => {
    function handleWindowResize() {
      if (window.innerWidth >= 768) {
        setHeaderHeight('0px');
        setIsMobile(false);
      } else {
        setHeaderHeight('92px');
        setIsMobile(true);
      }
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={{ headerHeight, isMobile }}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export const useResponsiveContext = () => useContext(ResponsiveContext);
