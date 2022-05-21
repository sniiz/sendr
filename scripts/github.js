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

const message = process.argv.slice(2);

const spinner = ora(`creating commit named ${message}`, {
  color: "cyan",
  spinner: "dots",
}).start();

execShellCommand(`git add -A && git commit -a -m "${message}"`).then(() => {
  spinner.text = "pushing...";
  execShellCommand("git push")
    .then(() => {
      spinner.stopAndPersist({
        symbol: "🎉",
        text: `done, link: ${process.env.GITHUB_URL}`,
      });
    })
    .catch((err) => {
      spinner.stopAndPersist({
        symbol: "💥",
        text: err,
      });
    });
});
