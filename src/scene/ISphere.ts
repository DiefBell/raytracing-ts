import { type vector } from "glm-ts";
import { type IReadonlySphere } from "./IReadonlySphere";
import { type SphereArray } from "./SphereArray";

export interface ISphere extends IReadonlySphere
{
    position : vector.Vec3;
    radius : number;
    materialIndex : number;

    toArray() : SphereArray;
}
