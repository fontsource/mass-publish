import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./tests/helpers/setup-tests.ts"],
		outputDiffLines: 250,
	},
});
