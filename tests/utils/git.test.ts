import * as fs from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';

import type { Config } from '../../src/types';
import { getHeadCommit, updateConfig } from '../../src/utils/git';

vi.mock('node:fs/promises');

describe('git utils', () => {
	it('gets head commit', async () => {
		const headCommit = await getHeadCommit();
		expect(headCommit.length).toEqual(40);
	});

	it('updates config with new head commit', async () => {
		const config: Config = {
			packages: ['packages/*'],
			ignoreExtension: [],
			commitFrom: 'abc',
			commitMessage: 'chore: release new versions',
		};

		await updateConfig(config);
		const call = vi.mocked(fs.writeFile).mock.lastCall as [string, string];
		expect(JSON.parse(call[1]).commitFrom.length).toEqual(40);
	});
});
