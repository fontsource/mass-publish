import { execa } from 'execa';
import stringify from 'json-stringify-pretty-compact';
import * as fs from 'node:fs/promises';
import * as path from 'pathe';

import type { Config } from '../types';

const getHeadCommit = async (): Promise<string> => {
	const { stdout } = await execa('git', ['rev-parse', 'HEAD']);
	return stdout;
};

const updateConfig = async (config: Config): Promise<void> => {
	const headCommit = await getHeadCommit();

	// Update commitFrom with HEAD commit
	const newConfig = config;
	newConfig.commitFrom = headCommit;

	const configPath = path.join(process.cwd(), 'mass-publish.json');
	await fs.writeFile(configPath, stringify(newConfig));
};

export { getHeadCommit, updateConfig };