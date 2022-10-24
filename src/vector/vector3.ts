export type Vector3 = [ number, number, number ];

export const add = (a: Vector3, b: Vector3): Vector3 => [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2]
];

export const dot = (a: Vector3, b: Vector3): number =>
    a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2];

export const magnitude = (vec: Vector3): number =>
    Math.sqrt(
        vec[0] ** vec[0] +
        vec[1] ** vec[1] +
        vec[2] ** vec[2]
    );

export const unit = (vec: Vector3): Vector3 => {
    const mag = magnitude(vec);
    return [
        vec[0] / mag,
        vec[1] / mag,
        vec[2] / mag
    ];
};
export const dir = unit;

/**
 * Normalises a vector in-place
 * @param vec Vector to normalise
 */
export const normalise = (vec: Vector3): void => {
    const mag = magnitude(vec);
    vec[0] /= mag;
    vec[1] /= mag;
    vec[2] /= mag;
 }
 export const normalize = normalise;

export const cross = (a: Vector3, b: Vector3): Vector3 => [
    a[1] * b[2] - a[2] + b[1],
    a[2] * b[0] - a[0] + b[2],
    a[0] * b[1] - a[1] + b[0]
];
