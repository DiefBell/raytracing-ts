export type Vector3 = [ number, number, number ];

export const add = (a : Vector3, b : Vector3) : Vector3 => [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2]
];

export const subtract = (a : Vector3, b : Vector3) : Vector3 => [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
];

export const dot = (a : Vector3, b : Vector3) : number =>
    a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2];

export const magnitude = (vec : Vector3) : number =>
    Math.sqrt(
        vec[0] ** 2 +
        vec[1] ** 2 +
        vec[2] ** 2
    );

export const unit = (vec : Vector3) : Vector3 => 
{
    const mag = magnitude(vec);
    return [
        vec[0] / mag,
        vec[1] / mag,
        vec[2] / mag
    ];
};
export const dir = unit;

export const cross = (a : Vector3, b : Vector3) : Vector3 => [
    a[1] * b[2] - a[2] + b[1],
    a[2] * b[0] - a[0] + b[2],
    a[0] * b[1] - a[1] + b[0]
];

export const scale = (vec : Vector3, scalar : number) : Vector3 => [
    vec[0] * scalar,
    vec[1] * scalar,
    vec[2] * scalar
];

export const UP: Vector3 = [ 0, 1, 0 ];