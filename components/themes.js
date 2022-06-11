import { Storage } from "expo-storage";

// I HOPE THIS FUCKING SHIT FUCKING WORKS
// if it doesnt i cry
// update: it does not, i am in tears
export default class Theme {
  constructor(themes) {
    this.themes = {
      classic: {
        main: "#0a0a0a",
        accent: "#f2f7f2",
        middle: "#727178",
        red: "#ff5555",
        separator1: "#999",
        separator2: "#555",
      },
      light: {
        main: "#f0f5f0",
        accent: "#0a0a0a",
        middle: "#727178",
        red: "#ff5555",
        separator1: "#ddd",
        separator2: "#999",
      },
      highContrastDark: {
        main: "#000",
        accent: "#fff",
        middle: "gray",
        red: "#f00",
        separator1: "gray",
        separator2: "gray",
      },
      highContrastLight: {
        main: "#fff",
        accent: "#000",
        middle: "gray",
        red: "#f00",
        separator1: "gray",
        separator2: "gray",
      },
    };
  }

  static get = (theme) => {
    if (!theme) {
      Storage.getItem({ key: "theme" })
        .then((value) => {
          return this.themes[value || "classic"];
        })
        .catch((error) => {
          Storage.setItem({ key: "theme", value: "classic" }).then(() => {
            return this.themes.classic;
          });
        });
    } else {
      return this.themes[theme];
    }
  };

  static set = (theme) => {
    if (!this.themes.hasOwnProperty(theme)) {
      Storage.setItem({ key: "theme", value: "classic" });
      return this.themes.classic;
    }
    Storage.setItem({ key: "theme", value: theme });
    return this.themes[theme];
  };

  static getAsync = (theme) => {
    return new Promise((resolve) => {
      resolve(get(theme));
    });
  };

  static setAsync = (theme) => {
    return new Promise((resolve) => {
      resolve(this.set(theme));
    });
  };
  // sometimes my genius is almost frightening

  // static addCustomTheme = (theme) => {
  //   this.themes[theme.name] = theme; // NOTE TO SELF: dont forget to make the themes have a name
  // };
  // wait no actually this sounds too difficult for my lil square brain to implement
}
