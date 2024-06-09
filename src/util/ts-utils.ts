export type Paths<T, P extends string = ''> = T extends object
	? {
			[K in keyof T]: K extends string
				? Paths<T[K], `${P}${P extends '' ? '' : '.'}${K}`> | `${P}${P extends '' ? '' : '.'}${K}`
				: never;
		}[keyof T]
	: '';

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? PathValue<T[K], Rest>
		: never
	: P extends keyof T
		? T[P]
		: never;
