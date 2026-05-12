type Fn = (this: any, ...args: any[]) => any;

function debounce<T extends Fn>(
	func: T,
	ms: number,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout>;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), ms);
	};
}

export default debounce;
