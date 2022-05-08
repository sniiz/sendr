// made this a .js so that i can add todos without vscode screaming at me

export default {
    expo: {
        name: "sendr",
        slug: "sendr",
        version: "v0.2.0-wip",
        orientation: "portrait",
        icon: "./assets/icon.png",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#000000",
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
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.sniiz.sendr",
            buildNumber: "0.2.0",
        },
        android: {
            package: "com.sniiz.sendr",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#000000",
            },
        },
        web: {
            favicon: "./assets/favicon.png",
        },
    },
};
