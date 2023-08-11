import 'dotenv/config';

export default {
  "expo": {
    "name": "app",
    "slug": "app",
    "plugins": ["@config-plugins/detox"],
    // "updates": {
    //   "url": "https://u.expo.dev/f833bfb5-302d-4c83-a8cb-eeafbdb8594c"
    // },
    //"runtimeVersion": "exposdk:48.0.0",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/logo.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "assets/**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.GetUrSpace",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.GetUrSpace",
      "versionCode": 1,
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "f833bfb5-302d-4c83-a8cb-eeafbdb8594c"
      }
    }
  }
}
