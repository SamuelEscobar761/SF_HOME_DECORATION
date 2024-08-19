import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface DeviceContextType {
  width: number;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;  // `ReactNode` cubre cualquier cosa que pueda ser renderizada: números, strings, elementos o una array (o fragmento) que contiene estos tipos.
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ width }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
