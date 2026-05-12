type Comparable = Record<any, any> | any[] | null | undefined | number | string | boolean;

function deepCompare(firstComparable: Comparable, secondComparable: Comparable) {
	if (typeof firstComparable !== typeof secondComparable) {
		return false;
	}

	if (firstComparable === null && secondComparable === null) {
		return true;
	}

	if (typeof firstComparable !== 'object') {
		return firstComparable === secondComparable;
	}

	if (Array.isArray(firstComparable) !== Array.isArray(secondComparable)) {
		return false;
	}

	if (Array.isArray(firstComparable) && Array.isArray(secondComparable)) {
		if (firstComparable.length !== secondComparable.length) {
			return false;
		}

		for (let i = 0; i < firstComparable.length; i++) {
			if (!deepCompare(firstComparable[i] as any, secondComparable[i] as any)) {
				return false;
			}
		}

		return true;
	}

	if (firstComparable == null || secondComparable == null) {
		return false;
	}

	const firstKeys = Object.keys(firstComparable);
	const secondKeys = Object.keys(secondComparable);

	if (firstKeys.length !== secondKeys.length) {
		return false;
	}

	for (const key of firstKeys) {
		const firstObj = firstComparable as Record<any, any>;
		const secondObj = secondComparable as Record<any, any>;

		const firstValue = firstObj[key];
		const secondValue = secondObj[key];

		if (!secondObj.hasOwnProperty(key) || !deepCompare(firstValue, secondValue)) {
			return false;
		}
	}

	return true;
}

export default deepCompare;
