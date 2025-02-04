import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fooddelight.eukrwqqgwyytmzliauva',
  appName: 'FoodDelight',
  webDir: 'dist',
  server: {
    url: 'https://eukrwqqgwyytmzliauva.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;