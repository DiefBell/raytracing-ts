import { type vector } from "glm-ts";
import { type IReadonlySphere } from "./IReadonlySphere";
import { type Rgb255 } from "../colour/colour";
import { type SphereArray } from "./SphereArray";

export interface ISphere extends IReadonlySphere
{
    position : vector.Vec3;
    radius : number;
    albedo : Rgb255;

    toArray() : SphereArray;
}
