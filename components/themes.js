// import { Storage } from "expo-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// I HOPE THIS FUCKING SHIT FUCKING WORKS
// if it doesnt i cry
// update: it does not, i am in tears
export default class Theme {
  // constructor(themes) {
  //   this.themes = {

  //   };
  // }

  static themes = {
    classic: {
      main: "#0a0a0b",
      accent: "#fefeff",
      middle: "#727178",
      red: "#ff5555",
      separator1: "#999",
      separator2: "#555",
    },
    light: {
      main: "#fefeff",
      accent: "#0a0a0b",
      middle: "#727178",
      red: "#ff5555",
      separator1: "#ddd",
      separator2: "#999",
    },
    high_contrast_dark: {
      main: "#000",
      accent: "#fff",
      middle: "gray",
      red: "#f00",
      separator1: "gray",
      separator2: "gray",
    },
    high_contrast_light: {
      main: "#fff",
      accent: "#000",
      middle: "gray",
      red: "#f00",
      separator1: "gray",
      separator2: "gray",
    },
    midnight: {
      main: "#0a0a0b",
      accent: "#666", // hehe satan
      middle: "#333",
      red: "#a33",
      separator1: "#999",
      separator2: "#555",
    },
    eye_disease: {
      main: "#fefeff",
      accent: "#666",
      middle: "#c5c5c9",
      red: "#a33",
      separator1: "#999",
      separator2: "#555",
    },
  };

  static get(theme) {
    if (theme === undefined) {
      AsyncStorage.getItem("theme")
        .then((value) => {
          return this.themes[value || "classic"];
        })
        .catch((error) => {
          AsyncStorage.setItem("theme", "classic")
            .then(() => {
              return this.themes["classic"];
            })
            .catch((error) => {
              console.log(error);
              return this.themes["classic"];
            });
        });
    } else {
      return this.themes[theme];
    }
  }

  static list() {
    return Object.keys(this.themes);
  }

  static set(theme) {
    // if (!this.themes.hasOwnProperty(theme)) {
    //   Storage.setItem({ key: "theme", value: "classic" });
    //   return this.themes.classic;
    // }
    // Storage.setItem({ key: "theme", value: theme });
    // return this.themes[theme];
    if (!this.themes.hasOwnProperty(theme)) {
      AsyncStorage.setItem("theme", "classic")
        .then(() => {
          return this.themes["classic"];
        })
        .catch((error) => {
          console.log(error);
        });
    }
    AsyncStorage.setItem("theme", theme).then(() => {
      return this.themes[theme];
    });
  }

  static getAsync(theme) {
    return new Promise((resolve) => {
      resolve(this.get(theme));
    });
  }

  static setAsync(theme) {
    return new Promise((resolve) => {
      resolve(this.set(theme));
    });
  }
  // sometimes my genius is almost frightening

  // static addCustomTheme = (theme) => {
  //   this.themes[theme.name] = theme; // NOTE TO SELF: dont forget to make the themes have a name
  // };
  // wait no actually this sounds too difficult for my lil square brain to implement
  // ¯\_(ツ)_/¯
}
