import { type vector } from "glm-ts";
import { type Rgb255 } from "../colour/colour";

export interface IReadonlySphere
{
    readonly position : vector.Vec3;
    readonly radius : number;
    readonly albedo : Rgb255;
}
