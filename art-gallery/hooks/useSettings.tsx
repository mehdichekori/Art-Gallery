'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings, defaultSettings, RefreshFrequency, Theme, CanvasSize } from '@/types/settings';

interface SettingsContextType extends Settings {
  updateRefreshFrequency: (frequency: RefreshFrequency) => void;
  updateShowDetailsBeforeClick: (show: boolean) => void;
  updateTheme: (theme: Theme) => void;
  updateCanvasSize: (size: CanvasSize) => void;
  updateOnlyHighlighted: (onlyHighlighted: boolean) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('gallery-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gallery-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateRefreshFrequency = (frequency: RefreshFrequency) => {
    setSettings(prev => ({ ...prev, refreshFrequency: frequency }));
  };

  const updateShowDetailsBeforeClick = (show: boolean) => {
    setSettings(prev => ({ ...prev, showDetailsBeforeClick: show }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const updateCanvasSize = (size: CanvasSize) => {
    setSettings(prev => ({ ...prev, canvasSize: size }));
  };

  const updateOnlyHighlighted = (onlyHighlighted: boolean) => {
    setSettings(prev => ({ ...prev, onlyHighlighted }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        updateRefreshFrequency,
        updateShowDetailsBeforeClick,
        updateTheme,
        updateCanvasSize,
        updateOnlyHighlighted,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
