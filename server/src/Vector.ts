export type Vector2D = [ number, number ];
export type Vector3D = [ number, number, number ];
export type Vector4D = [ number, number, number, number ]
export type RGB = Vector3D;
export type RGBA = Vector4D;

export const dot3D = (a : Vector3D, b : Vector3D) : number =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const multiply3D = (vector : Vector3D, scalar : number) : Vector3D =>
    [ vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];

export const add3D = (a : Vector3D, b : Vector3D) : Vector3D =>
    [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ];

export const magnitude3D = (vector : Vector3D) : number =>
    Math.sqrt(
        vector[0] * vector[0] +
        vector[1] * vector[1] +
        vector[2] * vector[2]
    );

export const normalise3D = (vector : Vector3D) : Vector3D =>
{
    const magnitude = magnitude3D(vector);
    return [
        vector[0] / magnitude,
        vector[1] / magnitude,
        vector[2] / magnitude
    ]
}