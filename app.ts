import { access, mkdir, readFile, writeFile, constants } from "node:fs";
import { promisify } from "node:util";

const makeDir = promisify(mkdir);
const read = promisify(readFile);
const write = promisify(writeFile);

interface EndpointConfig {
  url: string;
  name: string;
}

interface Config {
  target?: string;
  endpoints: EndpointConfig[];
}

const config = JSON.parse(
  await read("./cache-mock.json", { encoding: "utf8" })
) as Config;

for await (let endpoint of config.endpoints) {
  console.log(`Fetching ${endpoint.url}`);
  const result = await fetch(endpoint.url);

  const data = await result.json();
  access(config.target ?? "./", constants.R_OK | constants.W_OK, (err) => {
    if (err) {
      makeDir(config.target ?? "./");
    }
  });

  console.log(`Saving to ${endpoint.name}`);
  await write(
    `${config.target}/${endpoint.name}.json`,
    JSON.stringify(data),
    "utf8"
  );
}

export {};
