import { mocked } from "ts-jest/utils";
import type { MockedFunction } from "ts-jest/dist/utils/testing";

import { readConfig } from "../../changed/changed";
import type { Config } from "../../changed/changed";

export const mockConfig = (
  exampleConfig: Config
): MockedFunction<() => Promise<Config>> => {
  const mockedConfig = mocked(readConfig);
  return mockedConfig.mockResolvedValue(exampleConfig);
};
