import { vector3, vector4 } from "../vector";

export type Quaternion = vector4.Vector4;

export const fromAxisAngle = (axis: vector3.Vector3, angle: number): Quaternion =>
{
    const DEG_TO_RAD = Math.PI / 180;
    const angleRads = angle * DEG_TO_RAD;

    const halfAngle = angleRads / 2;
    const s = Math.sin(halfAngle);

    return [
        axis[0] * s,
        axis[1] * s,
        axis[2] * s,
        Math.cos(halfAngle)
    ];
};

// https://www.mathworks.com/help/aeroblks/quaternionrotation.html 
export const rotate = (vec: vector3.Vector3, q: Quaternion): vector3.Vector3 =>
{
    const x = 
        vec[0] * (
            1 -
            (2 * ( q[1] ** 2 )) -
            (2 * ( q[2] ** 2 ))
        ) +
        vec[1] * 2 * (
            (q[0] * q[1]) +
            (q[3] * q[2])
        ) +
        vec[2]
};
