import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flashanzan.app',
  appName: 'FlashAnzan',
  webDir: 'dist/flashanzan-app',
  android: {
    allowMixedContent: false,
    backgroundColor: '#667eea',
    overrideUserAgent: undefined,
    appendUserAgent: undefined
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
