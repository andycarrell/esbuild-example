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

  const report = `
👋 Looks like there's a change in packages 🥡

The following packages have been updated or added:
${changes
  .map(([name, version, prevVersion]) => {
    const socketUrl = `https://socket.dev/npm/package/${name}/overview/${version}`;

    if (prevVersion) {
      return `* '${name}' updated from v${prevVersion} to v${version}. [Review the new version on Socket](${socketUrl})`;
    }

    return `* '${name}' added at v${version}. [Review the new package on Socket](${socketUrl})`;
  })
  .join("\n")}
`;

  return report;
}

async function run() {
  const baseArg = process.argv.find((arg) => arg.startsWith("--base"));
  const compareArg = process.argv.find((arg) => arg.startsWith("--compare"));

  const isVerbose = process.argv.find((arg) => arg.startsWith("--verbose"));
  const shouldWrite = process.argv.find((arg) => arg.startsWith("--write"));

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

  log(report);

  if (shouldWrite) {
    const filePath = path.join(process.cwd(), "compare-packages.txt");
    log(`Writing report to ${filePath}`);
    await fs.writeFile(filePath, report);
  }
}

run();
