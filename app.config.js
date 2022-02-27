import "dotenv/config";

export default {
    expo: {
        name: "sendr",
        slug: "sendr",
        version: "0.4.27b",
        orientation: "portrait",
        icon: "./assets/icon.png",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: false,
            bundleIdentifier: "com.sniiz.sendr",
            buildNumber: "0.4.27b",
        },
        android: {
            package: "com.sniiz.sendr_beta",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFFFF",
            },
            versionCode: 1,
        },
        web: {
            favicon: "./assets/favicon.png",
        },
        extra: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
        },
    },
};
