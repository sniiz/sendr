// made this a .js so that i can add todos without vscode screaming at me

export default {
    expo: {
        name: "sendr",
        slug: "sendr",
        version: "v0.1.9-stable",
        orientation: "portrait",
        icon: "./assets/icon.png", // TODO make an actual icon
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
            supportsTablet: false,
            bundleIdentifier: "com.sniiz.sendr",
            buildNumber: "0.1.9",
        },
        android: {
            package: "com.sniiz.sendr_alpha",
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
