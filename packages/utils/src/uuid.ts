const hex: Array<string> = [];

for (let i = 0; i < 256; i++) hex[i] = i.toString(16).padStart(2, '0');

function createBytes(length: number) {
	return new Uint8Array(new ArrayBuffer(length));
}

function fillRandom(bytes: Uint8Array): void {
	if (crypto?.getRandomValues) {
		crypto.getRandomValues(bytes as Uint8Array<ArrayBuffer>);
	} else {
		for (let i = 0; i < bytes.length; i++) bytes[i] = (Math.random() * 256) | 0;
	}
}

function format(bytes: Uint8Array): string {
	return (
		hex[bytes[0]] +
		hex[bytes[1]] +
		hex[bytes[2]] +
		hex[bytes[3]] +
		'-' +
		hex[bytes[4]] +
		hex[bytes[5]] +
		'-' +
		hex[bytes[6]] +
		hex[bytes[7]] +
		'-' +
		hex[bytes[8]] +
		hex[bytes[9]] +
		'-' +
		hex[bytes[10]] +
		hex[bytes[11]] +
		hex[bytes[12]] +
		hex[bytes[13]] +
		hex[bytes[14]] +
		hex[bytes[15]]
	);
}

function uuidv4(): string {
	if (crypto?.randomUUID) {
		return crypto.randomUUID();
	}

	const bytes = createBytes(16);

	fillRandom(bytes);

	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;

	return format(bytes);
}

function uuidv7(): string {
	const bytes = createBytes(16);

	fillRandom(bytes);

	const now = Date.now();

	bytes[0] = (now / 2 ** 40) & 0xff;
	bytes[1] = (now / 2 ** 32) & 0xff;
	bytes[2] = (now / 2 ** 24) & 0xff;
	bytes[3] = (now / 2 ** 16) & 0xff;
	bytes[4] = (now / 2 ** 8) & 0xff;
	bytes[5] = now & 0xff;

	// version 7
	bytes[6] = (bytes[6] & 0x0f) | 0x70;
	// variant 10xx
	bytes[8] = (bytes[8] & 0x3f) | 0x80;

	return format(bytes);
}

export default uuidv4;
export { uuidv4, uuidv7 };
