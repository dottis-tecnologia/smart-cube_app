/**
 * Theme Provider
 * Wrapper para React Native Paper + gestos
 */

import React, { ReactNode } from 'react';
import { PaperProvider, MD3Theme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../theme/paperTheme';

interface ThemeProviderProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
  customTheme?: MD3Theme;
}

export function ThemeProvider({ 
  children, 
  theme = 'light',
  customTheme 
}: ThemeProviderProps) {
  const currentTheme = customTheme || (theme === 'dark' ? darkTheme : lightTheme);

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={currentTheme}>
        <BottomSheetModalProvider>
          {children}
        </BottomSheetModalProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Hook para acessar o tema (re-export do paper)
export { useTheme } from 'react-native-paper';
