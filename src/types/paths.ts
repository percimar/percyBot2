type PathImpl<T, Key extends keyof T> = Key extends string
	? T[Key] extends object
		? `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>>}` | `${Key}`
		: `${Key}`
	: never;

export type Paths<T> = PathImpl<T, Exclude<keyof T, keyof any[]>>;

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? PathValue<T[K], Rest>
		: never
	: P extends keyof T
		? T[P]
		: never;
