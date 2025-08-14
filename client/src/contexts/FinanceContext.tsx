import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FinanceSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  dateFormat: string;
  filters: {
    dateRange: { from?: Date; to?: Date };
    categories: string[];
    accounts: string[];
  };
}

interface FinanceContextType {
  settings: FinanceSettings;
  updateSettings: (newSettings: Partial<FinanceSettings>) => void;
  updateFilters: (filters: Partial<FinanceSettings['filters']>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<FinanceSettings>(() => {
    // Load settings from localStorage on initialization
    const savedSettings = localStorage.getItem('finance-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved finance settings:', error);
      }
    }
    
    // Default settings
    return {
      currency: 'USD',
      theme: 'system',
      dateFormat: 'MM/DD/YYYY',
      filters: {
        dateRange: {},
        categories: [],
        accounts: []
      }
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finance-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<FinanceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateFilters = (filters: Partial<FinanceSettings['filters']>) => {
    setSettings(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters }
    }));
  };

  const value: FinanceContextType = {
    settings,
    updateSettings,
    updateFilters
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
