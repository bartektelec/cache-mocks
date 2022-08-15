import { access, mkdir, readFile, writeFile, constants } from "node:fs";
import { promisify } from "node:util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { normalize, join } from "path";
import got from "got";

const makeDir = promisify(mkdir);
const read = promisify(readFile);
const write = promisify(writeFile);

const defaultConfig = {
  target: "mocks",
  ext: "json",
};

interface Arguments {
  target: string;
  ext: "json" | "js" | "ts";
  init?: boolean;
}

const argv = {
  ...defaultConfig,
  ...yargs(hideBin(process.argv)).argv,
} as Arguments;

const pwd = normalize(process.env.PWD!);

const isArgvComplete = (input: typeof argv | Arguments): input is Arguments =>
  (input as Arguments).target !== undefined;

const initApp = async () => {
  if (argv.init) {
    const defaultEndpoints = {
      people: "https://swapi.dev/api/people",
      "people-single": "https://swapi.dev/api/people/1",
    };
    const content = JSON.stringify(defaultEndpoints, null, 2);

    const targetPath = join(pwd, "mock-list.json");

    console.log(`Saving a default mock list file in ${targetPath}`);

    await write(targetPath, content, "utf8");
    return;
  }

  console.info(`Using ${argv.target} as target directory`);

  const data = await import(normalize(join("file://", pwd, "mock-list.js")));
  const endpoints: Record<string, string> = data.default;

  for await (let [filename, url] of Object.entries(endpoints)) {
    if (!isArgvComplete(argv)) break;

    console.log(`Fetching from ${url}`);

    const data = await got(url).json();

    const targetDir = normalize(join(argv.target));

    access(targetDir, constants.R_OK | constants.W_OK, async (err) => {
      if (err) {
        await makeDir(targetDir, { recursive: true });
      }

      const targetPath = normalize(join(targetDir, `${filename}.${argv.ext}`));
      console.log(`Saving to ${targetPath}`);

      let content = JSON.stringify(data, null, 2);

      if (["js", "ts"].includes(argv.ext))
        content = `export default ` + content;

      await write(targetPath, content, "utf8");
    });
  }
};

initApp();

export {};
