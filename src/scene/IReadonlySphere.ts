import { type vector } from "glm-ts";

export interface IReadonlySphere
{
    readonly position : vector.Vec3;
    readonly radius : number;
    readonly materialIndex : number;
}
