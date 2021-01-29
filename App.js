import React from 'react';
import { enableScreens } from 'react-native-screens';
import Navigation from './src/navigation'
import { Provider as PaperProvider } from 'react-native-paper';

enableScreens();

export default function App() {
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
}
