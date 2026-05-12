import { createHash } from 'node:crypto';

function hash(input: string): string {
	return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

export default hash;
