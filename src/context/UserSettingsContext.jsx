import { createContext, useContext } from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';

const defaultSettings = {
  fontSize: 20,
  lineHeight: 1.8,
  fontFamily: 'Georgia',
  darkMode: false,
  focusMode: false,
  columnView: true,
  contrast: 'normal',
  scrollSpeed: 50,
  theme: 'light',
  modals: {},
};

const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('appUserSettings', defaultSettings);

  return (
    <UserSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}
