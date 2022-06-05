const notifier = require("node-notifier");
const exec = require("child_process").exec;
const ora = require("ora");

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

const versionInfo = require("../assets/version-info.json");

const args = process.argv.slice(2);
const production = args.includes("--production");

var androidDone = false;
var iosDone = false;

const webOnly = true;
// if you're wondering why is this hardcoded, we have some weird issue with native clients at the moment

// web build
const spinner = ora("running expo build:web...", {
  color: "cyan",
  spinner: "dots",
}).start();

execShellCommand("expo build:web")
  .then(() => {
    notifier.notify({
      title: "sendr",
      message: `${versionInfo.number} ${
        production ? "production" : "preview"
      } web build complete`,
      icon: "./assets/icon.png",
    });
    // console.log("web build complete");
    spinner.text = "deploying...";
    // spinner.color = "purple";
    execShellCommand(
      `cp -R ./.vercel ./web-build && cp -r ./html/404.html ./web-build && vercel ./web-build ${
        production ? "--prod" : ""
      }`
    ).then(() => {
      notifier.notify({
        title: "sendr",
        message: `${versionInfo.number} ${
          production ? "production" : "preview"
        } deployed`,
        icon: "./assets/icon.png",
      });
      spinner.stopAndPersist({
        symbol: "🎉",
        text: "deployed",
      });

      // console.log("web build published");
    });
  })
  .catch((error) => {
    notifier.notify({
      title: "sendr",
      message: `${versionInfo.number} ${
        production ? "production" : "preview"
      } web build failed`,
      icon: "./assets/icon.png",
    });
    // console.log(error);
    spinner.fail("web build failed :(\nerror: " + error);
  });

if (!webOnly) {
  const fs = require("fs");

  fs.readFile("./.gitignore", "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    const result = data.replace("firebase.js", "# firebase.js");
    fs.writeFile("./.gitignore", result, "utf8", (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("firebase.js removed from .gitignore");
    });
  });

  execShellCommand("eas build --platform android --profile preview")
    .then(() => {
      notifier.notify({
        title: "sendr",
        message: `${versionInfo.number} ${
          production ? "production" : "preview"
        } android build complete`,
        icon: "./assets/icon.png",
      });
      androidDone = true;
    })
    .catch((error) => {
      notifier.notify({
        title: "sendr",
        message: `${versionInfo.number} ${
          production ? "production" : "preview"
        } android build failed`,
        icon: "./assets/icon.png",
      });
      console.log(error);
    });

  // ios build
  execShellCommand("eas build --platform ios --profile preview")
    .then(() => {
      notifier.notify({
        title: "sendr",
        message: `${versionInfo.number} ${
          production ? "production" : "preview"
        } ios build complete`,
        icon: "./assets/icon.png",
      });
      iosDone = true;
    })
    .catch((error) => {
      notifier.notify({
        title: "sendr",
        message: `${versionInfo.number} ${
          production ? "production" : "preview"
        } ios build failed`,
        icon: "./assets/icon.png",
      });
      console.log(error);
    });

  setTimeout(() => {
    if (androidDone && iosDone) {
      notifier.notify({
        title: "sendr",
        message: `${versionInfo.number} ${
          production ? "production" : "preview"
        } build complete`,
        icon: "./assets/icon.png",
      });
      console.log("build complete");

      fs.readFile("./.gitignore", "utf8", (err, data) => {
        if (err) {
          return console.log(err);
        }
        const result = data.replace("# firebase.js", "firebase.js");
        fs.writeFile("./.gitignore", result, "utf8", (err) => {
          if (err) {
            return console.log(err);
          }
          console.log("firebase.js added back to .gitignore");
        });
      });
    }
  });
}
