export default function binarySearch<T>(
	array: T[],
	compareFn: (element: T, index: number) => number,
): number {
	let left = 0;
	let right = array.length;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		const cmp = compareFn(array[mid], mid);

		if (cmp < 0) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}

	return left;
}
