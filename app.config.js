// made this a .js so that i can add todos without vscode screaming at me

export default {
  expo: {
    name: `sendr`,
    slug: "sendr",
    version: "v0.2.1-stable",
    orientation: "portrait",
    icon: "./assets/icon.png",
    // icon: "./assets/pride-adaptive-icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0a0a0a",
    },
    // plugins: [
    //     "expo-image-picker",
    //     {
    //         photoPermission:
    //             "allow sendr to access your photos to set your profile picture",
    //     },
    // ],
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/b5016c96-d33a-4893-95e7-9a1781a2f95a",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sniiz.sendr",
      buildNumber: "0.2.1",
    },
    android: {
      package: "com.sniiz.sendr",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        // foregroundImage: "./assets/pride-adaptive-icon.png",
        backgroundColor: "#0a0a0a",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
      // favicon: "./assets/pride-favicon.png",
    },
    scheme: "sendr",
  },
};
