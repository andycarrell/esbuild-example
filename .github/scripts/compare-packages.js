const { promises: fs } = require("fs");
const path = require("path");

function compare(a, b) {
  return Object.entries(b).reduce((acc, [name, newVersion]) => {
    const oldVersion = a[name];
    if (oldVersion === newVersion) {
      return acc;
    }
    return [...acc, [name, newVersion, oldVersion]];
  }, []);
}

function generate(a, b) {
  const changes = [
    ...compare(a.dependencies, b.dependencies),
    ...compare(a.devDependencies, b.devDependencies),
  ];

  if (changes.length === 0) {
    return null;
  }

  const report = `<h3>This pull request changes package.json 👋 </h3>
The following packages have been updated or added 🥡
<br/>
<br/>
<ul>${changes
    .map(([name, version, prevVersion]) => {
      const withSocketUrl = (str) =>
        `<a href="https://socket.dev/npm/package/${name}/overview/${version}">${str}</a>`;

      if (prevVersion) {
        return `<li>'${name}' updated from v${prevVersion} to v${version}. ${withSocketUrl(
          "Review the new version on Socket"
        )}`;
      }

      return `<li>'${name}' added at v${version}.  ${withSocketUrl(
        "Review the new package on Socket"
      )}`;
    })
    .join("")}
</ul>`;

  return report;
}

async function run() {
  const baseArg = process.argv.find((arg) => arg.startsWith("--base"));
  const compareArg = process.argv.find((arg) => arg.startsWith("--compare"));
  const isVerbose = process.argv.find((arg) => arg.startsWith("--verbose"));
  const outputArg = process.argv.find((arg) => arg.startsWith("--output"));

  const log = (...args) => {
    if (isVerbose) {
      console.log(...args);
    }
  };

  if (!baseArg || !compareArg) {
    console.error(
      "Arguments missing, either --base or --compare. Unable to run script"
    );

    process.exit(1);
  }

  const [, basePkgPath] = baseArg.split("=");
  const [, comparePkgPath] = compareArg.split("=");

  const basePkg = require(path.join(process.cwd(), basePkgPath));
  const comparePkg = require(path.join(process.cwd(), comparePkgPath));

  const report = generate(basePkg, comparePkg);

  if (!report) {
    log("No changes detected!");
    return;
  }

  log("Report:");
  log(report);

  if (outputArg) {
    const [, outputPath = process.cwd()] = outputArg.split("=");
    const filePath = path.join(outputPath, "report.md");
    log(`Writing report to ${filePath}`);
    await fs.writeFile(filePath, report);
  }
}

run();
