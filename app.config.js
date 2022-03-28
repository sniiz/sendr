// made this a .js so that i can add todos without vscode screaming at me

export default {
    expo: {
        name: "sendr",
        slug: "sendr",
        version: "v0.1.6pa",
        orientation: "portrait",
        icon: "./assets/icon.png", // TODO make an actual icon
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
            supportsTablet: true,
            bundleIdentifier: "com.sniiz.sendr",
            buildNumber: "0.1.0pa",
        },
        android: {
            package: "com.sniiz.sendr_alpha",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFFFF",
            },
        },
        web: {
            favicon: "./assets/favicon.png",
        },
    },
};
