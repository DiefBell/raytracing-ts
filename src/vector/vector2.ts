export type Vector2 = [ number, number ];

export const add = (a: Vector2, b: Vector2): Vector2 => [
	a[0] + b[0],
	a[1] + b[1]
];

/**
 * Subtracts vector b from vector a.
 * 
 * @param a Vector a.
 * @param b Vector b.
 * @returns New 2D vector after subtracting b from a.
 */
export const subtract = (a: Vector2, b: Vector2): Vector2 => [
	a[0] - b[0],
	a[1] - b[1]
];

export const dot = (a: Vector2, b: Vector2): number =>
	a[0] * b[0] +
	a[1] * b[1];

export const magnitude = (vec: Vector2): number =>
	Math.sqrt(
		vec[0] ** vec[0] +
		vec[1] ** vec[1]
	);

export const unit = (vec: Vector2): Vector2 => 
{
	const mag = magnitude(vec);
	return [
		vec[0] / mag,
		vec[1]  /mag
	];
};
export const dir = unit;

export const normalise = (vec: Vector2): void => 
{
	const mag = magnitude(vec);
	vec[0] /= mag;
	vec[1] /= mag;
}
export const normalize = normalise;
