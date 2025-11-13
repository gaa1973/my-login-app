import {teardown as teardownDevServer} from "jest-dev-server";

export default async function globalTeardown(globalConfig) {
  await teardownDevServer(globalThis.servers);
}
