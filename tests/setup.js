import path from 'node:path';
import process from 'node:process';
import {snapshot} from 'node:test';
import chalk from 'chalk';

// Use a fixed terminal width so the box art is deterministic
process.env.COLUMNS = '60';

// The snapshots are colorless, so the color support of the environment must not leak in
chalk.level = 0;

// Keep the box art readable by storing it verbatim instead of `util.inspect` output
snapshot.setDefaultSnapshotSerializers([value => value]);

// Keep the snapshots together in `tests/snapshots/<test file>.snapshot`
snapshot.setResolveSnapshotPath(testPath => {
	const {dir, base} = path.parse(testPath);

	return path.join(dir, 'snapshots', `${base}.snapshot`);
});
