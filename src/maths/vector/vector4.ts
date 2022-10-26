export type Vector4 = [ number, number, number, number ];


export const dot = (a : Vector4, b : Vector4) : number =>
    a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2] +
    a[3] + b[3];

export const magnitude = (vec : Vector4) : number =>
    Math.sqrt(
        vec[0] ** 2 +
        vec[1] ** 2 +
        vec[2] ** 2 +
        vec[3] ** 2
    );

export const normalise = (vec : Vector4) : Vector4 => 
{
    const mag = magnitude(vec);
    return [
        vec[0] / mag,
        vec[1] / mag,
        vec[2] / mag,
        vec[3] / mag
    ];
};

// https://www.youtube.com/watch?v=ln3vI4JEArc&ab_channel=Mathoma 
export const cross = (a : Vector4, b : Vector4) : Vector4 => [
    (a[0] * b[0]) - (a[1] * b[1]) - (a[2] * b[2]) - (a[3] * b[3]),
    (a[1] * b[0]) + (a[0] * b[1]) - (a[3] * b[2]) + (a[2] * b[3]),
    (a[2] * a[0]) + (a[3] * b[1]) + (a[0] * b[2]) - (a[1] * b[3]),
    (a[3] * b[0]) - (a[2] * b[1]) + (a[1] * b[2]) + (a[0] * b[3])
];

export const scale = (vec : Vector4, scalar : number) : Vector4 => [
    vec[0] * scalar,
    vec[1] * scalar,
    vec[2] * scalar,
    vec[3] * scalar
];
