import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.nexora.browser001',
  appName: 'Nexora',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
